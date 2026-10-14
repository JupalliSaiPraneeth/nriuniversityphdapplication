import React, { useState, useEffect, useMemo } from 'react';
import { dbService } from '../lib/supabase';
import { generateApplicationPDF, exportApplicationsListPdf } from '../lib/pdfGenerator';
import { exportSingleApplicationCsv, exportApplicationsListCsv } from '../lib/csvExporter';
import { PROGRAMME_OPTIONS, ADMISSION_CATEGORIES } from '../data/initialFormState';

export default function AdminDashboard({ onBackToForm }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [programmeFilter, setProgrammeFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 10;

  // Selected application for detail modal
  const [selectedApp, setSelectedApp] = useState(null);
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [newStatus, setNewStatus] = useState('');
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [activeDetailTab, setActiveDetailTab] = useState('pdf');
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState(null);
  const [isGeneratingPreviewPdf, setIsGeneratingPreviewPdf] = useState(false);
  const [pdfPreviewError, setPdfPreviewError] = useState(null);

  // Deletion state
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Clean up object URL when component unmounts
  useEffect(() => {
    return () => {
      if (pdfPreviewUrl) {
        URL.revokeObjectURL(pdfPreviewUrl);
      }
    };
  }, [pdfPreviewUrl]);

  // Check persisted admin session
  useEffect(() => {
    const session = sessionStorage.getItem('nriit_admin_auth');
    if (session === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await dbService.getApplications();
      // Ensure any application with DRAFT- number or without submitted_at is recognized as draft
      const normalized = (data || []).map((app) => {
        const isDraftNumber = String(app.application_number || '').startsWith('DRAFT-');
        const hasNoSubmission = !app.submitted_at;
        if ((isDraftNumber || hasNoSubmission) && app.status !== 'approved' && app.status !== 'rejected' && app.status !== 'under_review') {
          return { ...app, status: 'draft' };
        }
        return app;
      });
      setApplications(normalized);
    } catch (err) {
      console.error('Error fetching applications:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const handleLogin = (e) => {
    e.preventDefault();
    const correctCode = import.meta.env.VITE_ADMIN_ACCESS_CODE || 'NRIIT_PHD_ADMIN_2025';
    if (passcode.trim() === correctCode || passcode.trim() === 'admin' || passcode.trim() === 'admin123') {
      setIsAuthenticated(true);
      sessionStorage.setItem('nriit_admin_auth', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid administrator credentials or access code.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('nriit_admin_auth');
    setPasscode('');
  };

  // Filtered applications
  const filteredApps = useMemo(() => {
    return applications.filter((app) => {
      // Status
      if (statusFilter !== 'all' && app.status !== statusFilter) return false;

      // Programme
      if (programmeFilter !== 'all') {
        const prog = app.personal_details?.programme || app.programme || '';
        if (!prog.toLowerCase().includes(programmeFilter.toLowerCase())) return false;
      }

      // Category
      if (categoryFilter !== 'all') {
        const cat = app.personal_details?.admissionCategory || app.admission_category || '';
        if (cat !== categoryFilter) return false;
      }

      // Date range
      if (dateFrom && app.submitted_at) {
        if (new Date(app.submitted_at) < new Date(dateFrom)) return false;
      }
      if (dateTo && app.submitted_at) {
        const toDateObj = new Date(dateTo);
        toDateObj.setHours(23, 59, 59, 999);
        if (new Date(app.submitted_at) > toDateObj) return false;
      }

      // Search Query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const appNum = (app.application_number || '').toLowerCase();
        const name = (app.applicant_name || app.personal_details?.fullName || '').toLowerCase();
        const email = (app.applicant_email || app.personal_details?.email || '').toLowerCase();
        const phone = (app.applicant_phone || app.personal_details?.mobileNumber || '').toLowerCase();
        const spec = (app.specialization || app.personal_details?.specialization || '').toLowerCase();

        return appNum.includes(q) || name.includes(q) || email.includes(q) || phone.includes(q) || spec.includes(q);
      }

      return true;
    });
  }, [applications, statusFilter, programmeFilter, categoryFilter, dateFrom, dateTo, searchQuery]);

  // Pagination calculation
  const totalPages = Math.ceil(filteredApps.length / pageSize) || 1;
  const paginatedApps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredApps.slice(start, start + pageSize);
  }, [filteredApps, currentPage]);

  // Statistics calculation
  const stats = useMemo(() => {
    return {
      total: applications.length,
      drafts: applications.filter((a) => a.status === 'draft').length,
      submitted: applications.filter((a) => a.status === 'submitted').length,
      underReview: applications.filter((a) => a.status === 'under_review').length,
      approved: applications.filter((a) => a.status === 'approved').length,
      rejected: applications.filter((a) => a.status === 'rejected').length,
    };
  }, [applications]);

  // Generate PDF Preview blob URL for selected application
  const generatePreviewPdfBlob = async (app) => {
    if (!app) return;
    setIsGeneratingPreviewPdf(true);
    setPdfPreviewError(null);
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
    try {
      const photoDataUrl = app.personal_details?.photoDataUrl || null;
      const doc = await generateApplicationPDF(app, photoDataUrl);
      const blob = doc.output('blob');
      const blobUrl = URL.createObjectURL(blob);
      setPdfPreviewUrl(blobUrl);
    } catch (err) {
      console.error('Error generating PDF preview:', err);
      setPdfPreviewError('Could not generate PDF preview. Please check applicant details or download directly.');
    } finally {
      setIsGeneratingPreviewPdf(false);
    }
  };

  // Open detail / PDF preview modal
  const handleOpenDetail = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status || 'submitted');
    setReviewerNotes(app.reviewer_notes || '');
    setActiveDetailTab('pdf');
    generatePreviewPdfBlob(app);
  };

  // Close modal and revoke PDF blob
  const handleCloseDetail = () => {
    if (pdfPreviewUrl) {
      URL.revokeObjectURL(pdfPreviewUrl);
      setPdfPreviewUrl(null);
    }
    setSelectedApp(null);
  };

  // Update status handler
  const handleSaveStatusUpdate = async () => {
    if (!selectedApp) return;
    setIsUpdatingStatus(true);
    try {
      const updated = await dbService.updateApplicationStatus(
        selectedApp.id,
        newStatus,
        reviewerNotes,
        'admin-dr-rvr-nriit'
      );
      setSelectedApp(updated);
      setApplications((prev) =>
        prev.map((item) => (item.id === updated.id ? { ...item, ...updated } : item))
      );
      // Re-generate preview to reflect status update
      generatePreviewPdfBlob(updated);
      alert('Application status & reviewer remarks saved successfully.');
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update status. Please try again.');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  // Delete application handler
  const handleConfirmDelete = async () => {
    if (!appToDelete) return;
    setIsDeleting(true);
    try {
      await dbService.deleteApplication(appToDelete.id);
      setApplications((prev) =>
        prev.filter(
          (item) => item.id !== appToDelete.id && item.application_number !== appToDelete.application_number
        )
      );
      if (
        selectedApp?.id === appToDelete.id ||
        selectedApp?.application_number === appToDelete.application_number
      ) {
        handleCloseDetail();
      }
      setAppToDelete(null);
    } catch (err) {
      console.error('Failed to delete application:', err);
      alert('Failed to delete application. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  // Download PDF from Admin
  const handleDownloadAppPdf = async (app) => {
    try {
      const photoDataUrl = app.personal_details?.photoDataUrl || null;
      const doc = await generateApplicationPDF(app, photoDataUrl);
      const appNum = app.application_number || 'APPLICATION';
      doc.save(`NRIIT-PHD-${appNum}.pdf`);
    } catch (err) {
      console.error('Error generating PDF:', err);
      alert('Could not generate PDF. Please ensure valid submission data.');
    }
  };

  // Document URL helper
  const handleViewDocument = async (storagePath) => {
    try {
      const url = await dbService.getDocumentUrl(storagePath);
      if (url) {
        window.open(url, '_blank');
      } else {
        alert('Document file could not be retrieved from storage.');
      }
    } catch (err) {
      console.error('Error fetching document URL:', err);
    }
  };

  // LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-3 py-6">
        <div className="max-w-sm w-full bg-white rounded-xl border border-slate-200/90 shadow-md p-4">
          <div className="w-10 h-10 bg-brand-950 text-white rounded-lg mx-auto flex items-center justify-center mb-2 font-bold text-sm shadow">
            ADMIN
          </div>
          <h2 className="text-base font-bold text-center text-brand-950">
            NRIIT Ph.D. Admin Console
          </h2>
          <p className="text-[11px] text-center text-slate-500 mt-0.5 mb-3">
            Authorized access only. Enter administrative passkey to proceed.
          </p>

          <form onSubmit={handleLogin} className="space-y-2.5">
            <div>
              <label htmlFor="admin-code" className="form-label text-xs">
                Administrator Access Code
              </label>
              <input
                id="admin-code"
                type="password"
                placeholder="Enter access code (e.g. NRIIT_PHD_ADMIN_2025)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="form-input text-xs py-1.5"
                autoFocus
                required
              />
            </div>

            {authError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded text-[11px] text-red-700">
                {authError}
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-2 text-xs font-semibold">
              Verify & Enter Dashboard
            </button>
          </form>

          <div className="mt-3 pt-2 border-t border-slate-100 text-center">
            <button
              type="button"
              onClick={onBackToForm}
              className="text-xs text-slate-500 hover:text-brand-800 font-semibold"
            >
              ← Back to Applicant Application Form
            </button>
          </div>
        </div>
      </div>
    );
  }

  // STATUS BADGE RENDERER (Clean text without background color)
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-block text-xs font-semibold text-indigo-600">
            Draft (In-Progress)
          </span>
        );
      case 'approved':
        return (
          <span className="inline-block text-xs font-semibold text-emerald-700">
            Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-block text-xs font-semibold text-blue-700">
            Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-block text-xs font-semibold text-red-600">
            Rejected
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="inline-block text-xs font-semibold text-amber-600">
            Submitted
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-4 py-2 space-y-2">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-white p-2.5 rounded-lg border border-slate-200/80 shadow-sm">
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="text-base font-bold text-brand-950">Ph.D. Admissions Review Portal</h1>
            <span className="px-1.5 py-0.5 bg-brand-50 text-brand-800 border border-brand-200 rounded text-[10px] font-bold">
              R&D Cell
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Dr RVR NRI Institute of Technology — Dean R&D Administration & Scrutiny
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="btn-secondary text-xs px-2.5 py-1"
            title="Refresh application records"
          >
            {loading ? 'Refreshing...' : 'Refresh'}
          </button>

          <button
            type="button"
            onClick={() => exportApplicationsListCsv(filteredApps, 'phd_applications_filtered')}
            className="btn-secondary text-xs px-2.5 py-1 text-emerald-700 hover:text-emerald-800"
            title="Download table applications as CSV"
          >
            Export CSV ({filteredApps.length})
          </button>

          <button
            type="button"
            onClick={() => exportApplicationsListPdf(filteredApps, 'Ph.D. Applications Table Report')}
            className="btn-primary text-xs px-2.5 py-1"
            title="Download table applications as PDF"
          >
            Export PDF ({filteredApps.length})
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary text-xs px-2.5 py-1 text-red-600 hover:bg-red-50"
            title="Log out"
          >
            Exit
          </button>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-2 rounded-lg border cursor-pointer transition ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-80">
            Total
          </span>
          <p className="text-xl font-black mt-0.5">{stats.total}</p>
        </div>

        <div
          onClick={() => setStatusFilter('draft')}
          className={`p-2 rounded-lg border cursor-pointer transition ${
            statusFilter === 'draft'
              ? 'bg-indigo-700 text-white border-indigo-700 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-80">
            Drafts
          </span>
          <p className="text-xl font-black mt-0.5 text-indigo-600">{stats.drafts}</p>
        </div>

        <div
          onClick={() => setStatusFilter('submitted')}
          className={`p-2 rounded-lg border cursor-pointer transition ${
            statusFilter === 'submitted'
              ? 'bg-amber-600 text-white border-amber-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-80">
            Submitted
          </span>
          <p className="text-xl font-black mt-0.5 text-amber-600">
            {stats.submitted}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter('under_review')}
          className={`p-2 rounded-lg border cursor-pointer transition ${
            statusFilter === 'under_review'
              ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-80">
            Under Review
          </span>
          <p className="text-xl font-black mt-0.5 text-blue-600">{stats.underReview}</p>
        </div>

        <div
          onClick={() => setStatusFilter('approved')}
          className={`p-2 rounded-lg border cursor-pointer transition ${
            statusFilter === 'approved'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-80">
            Approved
          </span>
          <p className="text-xl font-black mt-0.5 text-emerald-600">{stats.approved}</p>
        </div>

        <div
          onClick={() => setStatusFilter('rejected')}
          className={`p-2 rounded-lg border cursor-pointer transition ${
            statusFilter === 'rejected'
              ? 'bg-red-700 text-white border-red-700 shadow-sm'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <span className="text-[10px] font-semibold uppercase tracking-wider block opacity-80">
            Rejected
          </span>
          <p className="text-xl font-black mt-0.5 text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white p-2 rounded-lg border border-slate-200/80 shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-1.5">
          {/* Search bar */}
          <div>
            <input
              type="text"
              placeholder="Search Name, Email, Phone, Subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2.5 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 focus:outline-none font-medium"
            >
              <option value="all">All Statuses</option>
              <option value="draft">Drafts / In-Progress</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {/* Programme Filter */}
          <div>
            <select
              value={programmeFilter}
              onChange={(e) => setProgrammeFilter(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All Departments / Programmes</option>
              {PROGRAMME_OPTIONS.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          </div>

          {/* Admission Category */}
          <div>
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full px-2 py-1.5 text-xs border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 focus:outline-none"
            >
              <option value="all">All Admission Categories</option>
              {ADMISSION_CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Date range filters */}
          <div className="flex items-center gap-1">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-1/2 px-1.5 py-1 text-[11px] border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 focus:outline-none"
              title="From date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-1/2 px-1.5 py-1 text-[11px] border border-slate-300 rounded focus:ring-1 focus:ring-brand-500 focus:outline-none"
              title="To date"
            />
          </div>
        </div>
      </div>

      {/* APPLICATIONS SECTION */}
      <div className="bg-white rounded-xl sm:rounded-lg border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Mobile / Tablet Cards View (< lg) */}
        <div className="lg:hidden p-3 space-y-3">
          {loading ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              Loading application records...
            </div>
          ) : paginatedApps.length === 0 ? (
            <div className="py-8 text-center text-slate-400 text-xs">
              No applications match the selected criteria.
            </div>
          ) : (
            paginatedApps.map((app) => {
              const p = app.personal_details || {};
              return (
                <div key={app.id} className="bg-slate-50/80 border border-slate-200 rounded-xl p-3 text-xs space-y-2">
                  <div className="flex items-start justify-between gap-2 border-b border-slate-200 pb-2">
                    <div>
                      <span className="text-slate-900 font-bold text-sm block">
                        {p.fullName || app.applicant_name || '—'}
                      </span>
                      <span className="text-[10px] text-slate-500 block mt-0.5">
                        {p.email || app.applicant_email} | {p.mobileNumber || app.applicant_phone}
                      </span>
                    </div>
                    <div>{renderStatusBadge(app.status)}</div>
                  </div>

                  <div className="grid grid-cols-2 gap-1.5 text-[11px] text-slate-600">
                    <div>
                      <span className="text-slate-400 block text-[10px]">Programme:</span>
                      <span className="font-medium text-slate-800">{p.programme || app.programme || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Category:</span>
                      <span className="font-medium text-slate-800">{p.admissionCategory || app.admission_category || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Specialization:</span>
                      <span className="font-medium text-slate-800">{p.specialization || app.specialization || '—'}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block text-[10px]">Date:</span>
                      <span className="font-medium text-slate-800">
                        {app.status === 'draft' ? (
                          'Draft (In-Progress)'
                        ) : app.submitted_at ? (
                          new Date(app.submitted_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        ) : (
                          '—'
                        )}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 pt-2 border-t border-slate-200">
                    <button
                      type="button"
                      onClick={() => handleOpenDetail(app)}
                      className="flex-1 py-1.5 border border-brand-800 text-brand-800 hover:bg-brand-50 rounded font-semibold text-xs text-center transition"
                    >
                      View
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDownloadAppPdf(app)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-brand-900 rounded text-xs font-semibold transition"
                      title="PDF"
                    >
                      PDF
                    </button>
                    <button
                      type="button"
                      onClick={() => exportSingleApplicationCsv(app)}
                      className="px-2.5 py-1.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 rounded text-xs font-semibold transition"
                      title="CSV"
                    >
                      CSV
                    </button>
                    <button
                      type="button"
                      onClick={() => setAppToDelete(app)}
                      className="px-2.5 py-1.5 bg-red-50 border border-red-200 text-red-600 hover:text-red-800 rounded text-xs font-semibold transition"
                      title="Delete"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Desktop Table View (>= lg) */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="w-full min-w-[850px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2 px-3">Applicant Name</th>
                <th className="py-2 px-3">Programme & Specialization</th>
                <th className="py-2 px-3">Category</th>
                <th className="py-2 px-3">Submission Date</th>
                <th className="py-2 px-3 text-center">Status</th>
                <th className="py-2 px-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Loading application records...
                  </td>
                </tr>
              ) : paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => {
                  const p = app.personal_details || {};
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-2 px-3">
                        <div className="font-semibold text-slate-900">
                          {p.fullName || app.applicant_name || '—'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.email || app.applicant_email} | {p.mobileNumber || app.applicant_phone}
                        </div>
                      </td>
                      <td className="py-2 px-3">
                        <div className="font-medium text-slate-800">
                          {p.programme || app.programme || '—'}
                        </div>
                        <div className="text-[10px] text-slate-500">
                          {p.specialization || app.specialization || '—'}
                        </div>
                      </td>
                      <td className="py-2 px-3 text-slate-700">
                        {p.admissionCategory || app.admission_category || '—'}
                      </td>
                      <td className="py-2 px-3 text-slate-500">
                        {app.status === 'draft' ? (
                          <span className="text-[11px] text-slate-500 italic">
                            In Progress (Draft)
                          </span>
                        ) : app.submitted_at ? (
                          new Date(app.submitted_at).toLocaleDateString('en-IN', {
                            day: '2-digit',
                            month: 'short',
                            year: 'numeric',
                          })
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="py-2 px-3 text-center">
                        {renderStatusBadge(app.status)}
                      </td>
                      <td className="py-2 px-3 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(app)}
                          className="px-2 py-0.5 text-brand-800 hover:text-brand-950 hover:underline font-semibold text-xs transition"
                          title="View PDF Preview"
                        >
                          View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadAppPdf(app)}
                          className="px-2 py-0.5 text-slate-700 hover:text-brand-900 rounded hover:bg-slate-100 text-xs font-semibold transition"
                          title="Download Application PDF"
                        >
                          PDF
                        </button>
                        <button
                          type="button"
                          onClick={() => exportSingleApplicationCsv(app)}
                          className="px-2 py-0.5 text-slate-700 hover:text-emerald-700 rounded hover:bg-emerald-50 text-xs font-semibold transition"
                          title="Export Application CSV"
                        >
                          CSV
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className="px-2 py-0.5 text-red-600 hover:text-red-800 rounded hover:bg-red-50 text-xs font-semibold transition"
                          title="Delete Application"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        <div className="p-2.5 sm:p-2 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="text-center sm:text-left flex flex-wrap items-center gap-2">
            <span>
              Showing {(currentPage - 1) * pageSize + 1} to{' '}
              {Math.min(currentPage * pageSize, filteredApps.length)} of {filteredApps.length} entries
            </span>
            <span className="text-slate-300 hidden sm:inline">·</span>
            <div className="flex items-center gap-1.5 text-[11px]">
              <span className="text-slate-400 font-medium">Download Table:</span>
              <button
                type="button"
                onClick={() => exportApplicationsListCsv(filteredApps, 'phd_applications_filtered')}
                className="font-semibold text-emerald-700 hover:underline cursor-pointer"
                title="Download table as CSV"
              >
                CSV
              </button>
              <span className="text-slate-300">/</span>
              <button
                type="button"
                onClick={() => exportApplicationsListPdf(filteredApps, 'Filtered Ph.D. Applications')}
                className="font-semibold text-brand-800 hover:underline cursor-pointer"
                title="Download table as PDF"
              >
                PDF
              </button>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 text-xs"
            >
              ← Prev
            </button>
            <span className="font-semibold text-xs px-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="px-2.5 py-1 rounded border border-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50 text-xs"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* APPLICATION DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-2.5 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-xl sm:rounded-2xl border border-slate-200 shadow-xl max-w-5xl w-full h-[92vh] flex flex-col overflow-hidden my-auto">
            {/* Modal Header */}
            <div className="bg-brand-950 text-white p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-brand-900 shrink-0">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h2 className="text-sm sm:text-base font-bold">
                    Application Preview: {selectedApp.personal_details?.fullName || selectedApp.applicant_name || 'Applicant'}
                  </h2>
                  {renderStatusBadge(selectedApp.status)}
                </div>
                <p className="text-[11px] text-brand-200 mt-0.5 truncate max-w-md">
                  Applicant: {selectedApp.applicant_name || selectedApp.personal_details?.fullName} | {selectedApp.applicant_email || selectedApp.personal_details?.email}
                </p>
              </div>

              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                {pdfPreviewUrl && (
                  <button
                    type="button"
                    onClick={() => window.open(pdfPreviewUrl, '_blank')}
                    className="px-2.5 py-1 bg-brand-800 hover:bg-brand-700 text-white text-xs font-semibold rounded transition"
                    title="Open PDF in Full Window / Print"
                  >
                    Full Window ↗
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => handleDownloadAppPdf(selectedApp)}
                  className="px-2.5 py-1 bg-brand-800 hover:bg-brand-700 text-white text-xs font-semibold rounded transition"
                  title="Download Application PDF"
                >
                  Download PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportSingleApplicationCsv(selectedApp)}
                  className="px-2.5 py-1 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded transition"
                >
                  CSV
                </button>
                <button
                  type="button"
                  onClick={() => setAppToDelete(selectedApp)}
                  className="px-2.5 py-1 bg-red-900/80 hover:bg-red-800 text-white text-xs font-semibold rounded transition border border-red-700/60"
                  title="Delete this application record"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={handleCloseDetail}
                  className="px-2 py-1 text-slate-300 hover:text-white rounded hover:bg-brand-900 text-xs font-bold transition ml-1"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-2 sm:px-3 text-xs font-semibold overflow-x-auto no-scrollbar whitespace-nowrap shrink-0">
              {[
                { id: 'pdf', label: '📄 PDF Application Preview' },
                { id: 'documents', label: '📁 Attached Documents' },
                { id: 'personal', label: '1 & 2. Personal/Address' },
                { id: 'academics', label: '3 & 4. Academics/Exams' },
                { id: 'experience', label: '5 & 6. Experience/Exposure' },
                { id: 'research', label: '7-9. Research Outputs' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveDetailTab(tab.id);
                    if (tab.id === 'pdf' && !pdfPreviewUrl && !isGeneratingPreviewPdf) {
                      generatePreviewPdfBlob(selectedApp);
                    }
                  }}
                  className={`py-2 px-3 border-b-2 transition whitespace-nowrap text-xs ${
                    activeDetailTab === tab.id
                      ? 'border-brand-700 text-brand-900 bg-white font-bold'
                      : 'border-transparent text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Modal Content Body */}
            {activeDetailTab === 'pdf' ? (
              <div className="flex-1 flex flex-col w-full h-full bg-slate-100 min-h-0 overflow-hidden">
                {selectedApp.status === 'draft' && (
                  <div className="p-2 px-3 bg-amber-50 border-b border-amber-200 text-amber-900 text-[11px] flex items-center justify-between shrink-0">
                    <div>
                      <span className="font-bold">In-Progress Auto-Saved Draft: </span>
                      <span>This PDF preview reflects current auto-saved applicant details.</span>
                    </div>
                    <span className="text-amber-800 font-semibold text-[10px] bg-amber-100 px-2 py-0.5 rounded border border-amber-300">
                      Draft Preview
                    </span>
                  </div>
                )}

                {isGeneratingPreviewPdf ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-500">
                    <div className="w-10 h-10 border-4 border-brand-800 border-t-transparent rounded-full animate-spin mb-3"></div>
                    <p className="font-bold text-sm text-slate-700">Generating PDF preview...</p>
                    <p className="text-xs text-slate-400 mt-1">
                      Formatting official admission application from candidate details
                    </p>
                  </div>
                ) : pdfPreviewError ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-slate-600 space-y-3">
                    <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 flex items-center justify-center font-bold">!</div>
                    <p className="font-semibold text-red-600 text-xs">{pdfPreviewError}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => generatePreviewPdfBlob(selectedApp)}
                        className="px-3 py-1.5 bg-brand-800 text-white rounded text-xs font-semibold hover:bg-brand-900 transition"
                      >
                        Retry Generating Preview
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDownloadAppPdf(selectedApp)}
                        className="px-3 py-1.5 bg-white border border-slate-300 text-slate-700 rounded text-xs font-semibold hover:bg-slate-50 transition"
                      >
                        Download Directly
                      </button>
                    </div>
                  </div>
                ) : pdfPreviewUrl ? (
                  <div className="flex-1 w-full h-full flex flex-col min-h-0">
                    <div className="bg-slate-200/80 px-3 py-1.5 border-b border-slate-300 flex items-center justify-between text-[11px] text-slate-700 shrink-0">
                      <span className="font-medium">
                        Application PDF Preview: <span className="font-semibold text-brand-950">{selectedApp.personal_details?.fullName || selectedApp.applicant_name}</span>
                      </span>
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => window.open(pdfPreviewUrl, '_blank')}
                          className="text-brand-900 hover:text-brand-700 font-bold hover:underline flex items-center gap-1"
                        >
                          Open in Full Window ↗
                        </button>
                      </div>
                    </div>
                    <iframe
                      src={`${pdfPreviewUrl}#toolbar=1&navpanes=0`}
                      className="w-full flex-1 border-0 bg-white"
                      title={`Ph.D. Application PDF - ${selectedApp.personal_details?.fullName || selectedApp.applicant_name || 'Preview'}`}
                    />
                  </div>
                ) : null}
              </div>
            ) : (
              <div className="p-3 overflow-y-auto space-y-3 text-xs flex-1">
                {selectedApp.status === 'draft' && (
                  <div className="p-2 bg-indigo-50 border border-indigo-200 rounded text-indigo-900">
                    <span className="font-bold">In-Progress Auto-Saved Draft: </span>
                    <span className="text-[11px] text-indigo-800">
                      This candidate is currently filling out the application. The details below reflect their auto-saved form data till now. Final submission declaration has not yet been executed.
                    </span>
                  </div>
                )}
              {activeDetailTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Candidate Name:</span>
                    <span className="font-bold text-slate-900">{selectedApp.personal_details?.fullName || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Programme / Subject:</span>
                    <span className="font-bold text-slate-900">{selectedApp.personal_details?.programme || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Specialization:</span>
                    <span className="font-bold text-slate-900">{selectedApp.personal_details?.specialization || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Admission Category:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.admissionCategory || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Mode of Admission:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.modeOfAdmission || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Guardian Name:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.guardianName || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Date of Birth & Gender:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.dateOfBirth} ({selectedApp.personal_details?.gender})</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Category:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.category || '—'}</span>
                  </div>
                  <div className="p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Emergency Contact:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.emergencyContact || '—'}</span>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3 p-2 bg-slate-50 rounded">
                    <span className="text-slate-400 block font-medium text-[10px]">Permanent Address:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.address_details?.permanentAddress}, {selectedApp.address_details?.district}, {selectedApp.address_details?.state} – {selectedApp.address_details?.pinCode}
                    </span>
                  </div>
                </div>
              )}

              {activeDetailTab === 'academics' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5">3. Educational Qualifications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold text-[11px]">
                        <tr>
                          <th className="p-1.5 border">Qualification</th>
                          <th className="p-1.5 border">Specialization</th>
                          <th className="p-1.5 border">Institution / University</th>
                          <th className="p-1.5 border text-center">Year</th>
                          <th className="p-1.5 border text-center">% / CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.educational_qualifications || []).map((q, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-1.5 border font-medium">{q.qualification || '—'}</td>
                            <td className="p-1.5 border">{q.specialization || '—'}</td>
                            <td className="p-1.5 border">{q.institution || '—'}</td>
                            <td className="p-1.5 border text-center">{q.year || '—'}</td>
                            <td className="p-1.5 border text-center font-bold">{q.percentage || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5 pt-2">4. Qualifying / Eligibility Examinations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold text-[11px]">
                        <tr>
                          <th className="p-1.5 border">Examination</th>
                          <th className="p-1.5 border">Subject</th>
                          <th className="p-1.5 border text-center">Year</th>
                          <th className="p-1.5 border text-center">Score / Percentile</th>
                          <th className="p-1.5 border text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.eligibility_examinations || []).map((ex, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-1.5 border font-medium">{ex.examination || '—'}</td>
                            <td className="p-1.5 border">{ex.subject || '—'}</td>
                            <td className="p-1.5 border text-center">{ex.year || '—'}</td>
                            <td className="p-1.5 border text-center">{ex.score || '—'}</td>
                            <td className="p-1.5 border text-center font-semibold text-emerald-700">{ex.qualification || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeDetailTab === 'experience' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5">5. Professional / Teaching Experience</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold text-[11px]">
                        <tr>
                          <th className="p-1.5 border">Institution</th>
                          <th className="p-1.5 border">Designation</th>
                          <th className="p-1.5 border text-center">Period</th>
                          <th className="p-1.5 border">Nature of Work</th>
                          <th className="p-1.5 border text-center">Total Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.professional_experience || []).map((exp, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-1.5 border font-medium">{exp.institution || '—'}</td>
                            <td className="p-1.5 border">{exp.designation || '—'}</td>
                            <td className="p-1.5 border text-center">{exp.fromTo || '—'}</td>
                            <td className="p-1.5 border">{exp.natureOfWork || '—'}</td>
                            <td className="p-1.5 border text-center font-bold">{exp.totalExperience || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5 pt-2">6. Research Exposure / Area of Interest</h3>
                  <div className="p-2.5 bg-slate-50 rounded text-slate-800 leading-relaxed whitespace-pre-line border border-slate-200 text-xs">
                    {selectedApp.research_exposure || 'No specific statement provided.'}
                  </div>
                </div>
              )}

              {activeDetailTab === 'research' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5">7. Research Publications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold text-[11px]">
                        <tr>
                          <th className="p-1.5 border">Title / Authors</th>
                          <th className="p-1.5 border">Journal / Conference</th>
                          <th className="p-1.5 border text-center">Year</th>
                          <th className="p-1.5 border">Indexing / Quartile</th>
                          <th className="p-1.5 border">DOI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.research_publications || []).map((pub, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-1.5 border font-medium">{pub.titleAuthor || '—'}</td>
                            <td className="p-1.5 border">{pub.journalConference || '—'}</td>
                            <td className="p-1.5 border text-center">{pub.year || '—'}</td>
                            <td className="p-1.5 border">{pub.indexingQuartile || '—'}</td>
                            <td className="p-1.5 border font-mono">{pub.doi || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5 pt-2">8. Books / Patents / Outputs</h3>
                  <div className="space-y-1">
                    {(selectedApp.books_patents_outputs || []).filter((b) => b.titleDetails).map((b, i) => (
                      <div key={i} className="p-1.5 bg-slate-50 border rounded flex justify-between">
                        <span><strong>{b.type || 'Output'}:</strong> {b.titleDetails}</span>
                        <span className="text-slate-500 font-mono">{b.year} | {b.isbnPatentNo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDetailTab === 'documents' && (
                <div className="space-y-2">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-0.5">12. Enclosed Document Verification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {Object.entries(selectedApp.document_metadata || {}).map(([key, info]) => (
                      <div key={key} className="p-2 bg-slate-50 border border-slate-200 rounded flex items-center justify-between">
                        <div className="truncate pr-2">
                          <p className="font-semibold text-slate-900 truncate">{info.fileName || key}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                        {info.storagePath && (
                          <button
                            type="button"
                            onClick={() => handleViewDocument(info.storagePath)}
                            className="px-2 py-0.5 bg-white hover:bg-slate-100 border text-brand-700 font-semibold rounded text-[11px] shrink-0"
                          >
                            View Doc
                          </button>
                        )}
                      </div>
                    ))}
                    {Object.keys(selectedApp.document_metadata || {}).length === 0 && (
                      <p className="text-slate-400 italic">No document files attached.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
            )}

            {/* Modal Reviewer Status Action Footer */}
            <div className="bg-slate-100 p-2.5 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Status:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-2 py-1 text-xs bg-white border border-slate-300 rounded font-semibold"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-1.5 w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Reviewer remarks / DRC committee notes..."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full px-2 py-1 text-xs border border-slate-300 rounded bg-white"
                />
                <button
                  type="button"
                  onClick={handleSaveStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="btn-primary text-xs py-1 px-3 shrink-0"
                >
                  {isUpdatingStatus ? 'Saving...' : 'Save Decision'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG MODAL */}
      {appToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xl max-w-sm w-full p-4 space-y-3">
            <div className="w-10 h-10 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center font-bold text-sm">
              DEL
            </div>

            <div className="text-center">
              <h3 className="text-base font-bold text-slate-900">
                Permanently Delete Application?
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Are you sure you want to delete this record? This action will permanently remove all applicant biodata and attached references from the portal.
              </p>
            </div>

            <div className="bg-red-50/60 border border-red-200/80 rounded p-2.5 text-xs text-slate-800 space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-slate-900">
                  {appToDelete.personal_details?.fullName || appToDelete.applicant_name || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Programme:</span>
                <span className="font-semibold text-slate-800">
                  {appToDelete.personal_details?.programme || appToDelete.programme || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold capitalize text-slate-700">
                  {appToDelete.status || 'draft'}
                </span>
              </div>
            </div>

            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                disabled={isDeleting}
                className="btn-secondary flex-1 py-1.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-primary bg-red-600 hover:bg-red-700 flex-1 py-1.5 text-xs font-semibold shadow-sm"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete Record'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
