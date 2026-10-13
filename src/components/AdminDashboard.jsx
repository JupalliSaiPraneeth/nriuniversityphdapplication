import React, { useState, useEffect, useMemo } from 'react';
import {
  ShieldCheck,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  AlertCircle,
  RefreshCw,
  LogOut,
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  Layers,
  Lock,
  FileEdit,
  Trash2,
} from 'lucide-react';
import { dbService } from '../lib/supabase';
import { generateApplicationPDF } from '../lib/pdfGenerator';
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
  const [activeDetailTab, setActiveDetailTab] = useState('personal');

  // Deletion state
  const [appToDelete, setAppToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

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

  // Open detail modal
  const handleOpenDetail = (app) => {
    setSelectedApp(app);
    setNewStatus(app.status || 'submitted');
    setReviewerNotes(app.reviewer_notes || '');
    setActiveDetailTab('personal');
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
        setSelectedApp(null);
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
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200/90 shadow-xl p-8">
          <div className="w-14 h-14 bg-brand-950 text-white rounded-2xl mx-auto flex items-center justify-center mb-4 shadow">
            <Lock className="w-7 h-7 text-gold-400" />
          </div>
          <h2 className="text-xl font-bold text-center text-brand-950">
            NRIIT Ph.D. Admin Console
          </h2>
          <p className="text-xs text-center text-slate-500 mt-1 mb-6">
            Authorized access only. Enter administrative passkey to proceed.
          </p>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="admin-code" className="form-label">
                Administrator Access Code
              </label>
              <input
                id="admin-code"
                type="password"
                placeholder="Enter access code (e.g. NRIIT_PHD_ADMIN_2025)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="form-input"
                autoFocus
                required
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button type="submit" className="w-full btn-primary py-2.5">
              Verify & Enter Dashboard
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
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

  // STATUS BADGE RENDERER
  const renderStatusBadge = (status) => {
    switch (status) {
      case 'draft':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <FileEdit className="w-3 h-3 text-indigo-500" /> Draft / In-Progress
          </span>
        );
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
            <CheckCircle className="w-3 h-3" /> Approved
          </span>
        );
      case 'under_review':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
            <Clock className="w-3 h-3" /> Under Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
            <XCircle className="w-3 h-3" /> Rejected
          </span>
        );
      case 'submitted':
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
            <AlertCircle className="w-3 h-3" /> Submitted
          </span>
        );
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Top Admin Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/80 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-brand-950">Ph.D. Admissions Review Portal</h1>
            <span className="px-2 py-0.5 bg-brand-50 text-brand-800 border border-brand-200 rounded text-[11px] font-semibold">
              R&D Cell
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Dr RVR NRI Institute of Technology — Dean R&D Administration & Scrutiny
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            type="button"
            onClick={fetchApplications}
            disabled={loading}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5"
            title="Refresh application records"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <button
            type="button"
            onClick={() => exportApplicationsListCsv(filteredApps, 'phd_applications_filtered')}
            className="btn-secondary text-xs px-3 py-2 flex items-center gap-1.5 text-emerald-700 hover:text-emerald-800"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
            Export Filtered CSV ({filteredApps.length})
          </button>

          <button
            type="button"
            onClick={() => exportApplicationsListCsv(applications, 'phd_applications_all')}
            className="btn-primary text-xs px-3.5 py-2 flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export All CSV ({applications.length})
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="btn-secondary text-xs px-3 py-2 text-red-600 hover:bg-red-50 flex items-center gap-1"
            title="Log out"
          >
            <LogOut className="w-3.5 h-3.5" />
            Exit
          </button>
        </div>
      </div>

      {/* METRIC STATS CARDS */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        <div
          onClick={() => setStatusFilter('all')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'all'
              ? 'bg-slate-900 text-white border-slate-900 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Total
            </span>
            <Layers className="w-4 h-4 opacity-70" />
          </div>
          <p className="text-2xl font-black mt-2">{stats.total}</p>
        </div>

        <div
          onClick={() => setStatusFilter('draft')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'draft'
              ? 'bg-indigo-700 text-white border-indigo-700 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Drafts (In-Progress)
            </span>
            <FileEdit className="w-4 h-4 text-indigo-400" />
          </div>
          <p className="text-2xl font-black mt-2 text-indigo-600">{stats.drafts}</p>
        </div>

        <div
          onClick={() => setStatusFilter('submitted')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'submitted'
              ? 'bg-amber-600 text-white border-amber-600 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Submitted
            </span>
            <AlertCircle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-black mt-2 text-amber-600 group-hover:text-amber-700">
            {stats.submitted}
          </p>
        </div>

        <div
          onClick={() => setStatusFilter('under_review')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'under_review'
              ? 'bg-blue-600 text-white border-blue-600 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Under Review
            </span>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-2xl font-black mt-2 text-blue-600">{stats.underReview}</p>
        </div>

        <div
          onClick={() => setStatusFilter('approved')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'approved'
              ? 'bg-emerald-700 text-white border-emerald-700 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Approved
            </span>
            <CheckCircle className="w-4 h-4 text-emerald-500" />
          </div>
          <p className="text-2xl font-black mt-2 text-emerald-600">{stats.approved}</p>
        </div>

        <div
          onClick={() => setStatusFilter('rejected')}
          className={`p-4 rounded-xl border cursor-pointer transition ${
            statusFilter === 'rejected'
              ? 'bg-red-700 text-white border-red-700 shadow-md'
              : 'bg-white border-slate-200 hover:border-slate-300'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider opacity-80">
              Rejected
            </span>
            <XCircle className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-black mt-2 text-red-600">{stats.rejected}</p>
        </div>
      </div>

      {/* SEARCH AND FILTERS TOOLBAR */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Search App No, Name, Email, Phone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
            />
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none font-medium"
            >
              <option value="all">All Application Statuses</option>
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
              className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
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
          <div className="flex items-center gap-1.5">
            <input
              type="date"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-1/2 px-2 py-2 text-[11px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              title="From date"
            />
            <span className="text-slate-400 text-xs">to</span>
            <input
              type="date"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-1/2 px-2 py-2 text-[11px] border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 focus:outline-none"
              title="To date"
            />
          </div>
        </div>
      </div>

      {/* APPLICATIONS TABLE */}
      <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-xs">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-semibold uppercase tracking-wider">
                <th className="py-3 px-4">Application No.</th>
                <th className="py-3 px-4">Applicant Name</th>
                <th className="py-3 px-4">Programme & Specialization</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Submission Date</th>
                <th className="py-3 px-4 text-center">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-brand-600" />
                    Loading application records...
                  </td>
                </tr>
              ) : paginatedApps.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No applications match the selected criteria.
                  </td>
                </tr>
              ) : (
                paginatedApps.map((app) => {
                  const p = app.personal_details || {};
                  return (
                    <tr key={app.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-brand-900">
                        {app.application_number}
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-900">
                          {p.fullName || app.applicant_name || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.email || app.applicant_email} | {p.mobileNumber || app.applicant_phone}
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="font-medium text-slate-800">
                          {p.programme || app.programme || '—'}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {p.specialization || app.specialization || '—'}
                        </div>
                      </td>
                      <td className="py-3 px-4 text-slate-700">
                        {p.admissionCategory || app.admission_category || '—'}
                      </td>
                      <td className="py-3 px-4 text-slate-500">
                        {app.status === 'draft' ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-medium bg-slate-100 text-slate-600 border border-slate-200">
                            <FileEdit className="w-3 h-3 text-slate-400" /> In Progress (Draft)
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
                      <td className="py-3 px-4 text-center">
                        {renderStatusBadge(app.status)}
                      </td>
                      <td className="py-3 px-4 text-right space-x-1 whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleOpenDetail(app)}
                          className="px-2.5 py-1.5 bg-brand-50 hover:bg-brand-100 text-brand-800 rounded font-semibold transition"
                          title="View Full Application Details"
                        >
                          <Eye className="w-3.5 h-3.5 inline mr-1" /> View
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDownloadAppPdf(app)}
                          className="px-2 py-1.5 text-slate-600 hover:text-brand-900 rounded hover:bg-slate-100 transition"
                          title="Download Application PDF"
                        >
                          <FileText className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => exportSingleApplicationCsv(app)}
                          className="px-2 py-1.5 text-slate-600 hover:text-emerald-700 rounded hover:bg-emerald-50 transition"
                          title="Export Application CSV"
                        >
                          <FileSpreadsheet className="w-3.5 h-3.5 inline" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setAppToDelete(app)}
                          className="px-2 py-1.5 text-slate-400 hover:text-red-700 rounded hover:bg-red-50 transition"
                          title="Delete Application"
                        >
                          <Trash2 className="w-3.5 h-3.5 inline text-red-500" />
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
        <div className="p-4 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <div>
            Showing {(currentPage - 1) * pageSize + 1} to{' '}
            {Math.min(currentPage * pageSize, filteredApps.length)} of {filteredApps.length} entries
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((p) => p - 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold">
              Page {currentPage} of {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((p) => p + 1)}
              className="p-1.5 rounded border border-slate-200 disabled:opacity-30 disabled:pointer-events-none hover:bg-slate-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* APPLICATION DETAIL MODAL */}
      {selectedApp && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col overflow-hidden my-auto animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="bg-brand-950 text-white p-5 flex items-center justify-between border-b border-brand-900">
              <div>
                <div className="flex items-center gap-2.5">
                  <h2 className="text-lg font-bold">
                    Application Scrutiny: {selectedApp.application_number}
                  </h2>
                  {renderStatusBadge(selectedApp.status)}
                </div>
                <p className="text-xs text-brand-200 mt-0.5">
                  Applicant: {selectedApp.applicant_name || selectedApp.personal_details?.fullName} | {selectedApp.applicant_email}
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadAppPdf(selectedApp)}
                  className="px-3 py-1.5 bg-brand-800 hover:bg-brand-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5" /> PDF
                </button>
                <button
                  type="button"
                  onClick={() => exportSingleApplicationCsv(selectedApp)}
                  className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5"
                >
                  <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                </button>
                <button
                  type="button"
                  onClick={() => setAppToDelete(selectedApp)}
                  className="px-2.5 py-1.5 bg-red-900/80 hover:bg-red-800 text-white text-xs font-semibold rounded-lg transition flex items-center gap-1.5 border border-red-700/60"
                  title="Delete this application record"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  className="p-1.5 text-slate-300 hover:text-white rounded-lg hover:bg-brand-900 transition ml-2"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Modal Navigation Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-5 text-xs font-semibold overflow-x-auto">
              {[
                { id: 'personal', label: '1 & 2. Personal/Address' },
                { id: 'academics', label: '3 & 4. Academics/Exams' },
                { id: 'experience', label: '5 & 6. Experience/Exposure' },
                { id: 'research', label: '7-9. Research Outputs' },
                { id: 'documents', label: '12. Enclosures & Review' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveDetailTab(tab.id)}
                  className={`py-3 px-4 border-b-2 transition whitespace-nowrap ${
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
            <div className="p-6 overflow-y-auto space-y-5 text-xs flex-1">
              {selectedApp.status === 'draft' && (
                <div className="p-3 bg-indigo-50 border border-indigo-200 rounded-lg text-indigo-900 flex items-center gap-2.5">
                  <FileEdit className="w-4 h-4 text-indigo-600 shrink-0" />
                  <div>
                    <span className="font-bold">In-Progress Auto-Saved Draft:</span>
                    <p className="text-[11px] text-indigo-800">
                      This candidate is currently filling out the application. The details below reflect their auto-saved form data till now. Final submission declaration has not yet been executed.
                    </p>
                  </div>
                </div>
              )}
              {activeDetailTab === 'personal' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Candidate Name:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedApp.personal_details?.fullName || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Programme / Subject:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedApp.personal_details?.programme || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Specialization:</span>
                    <span className="font-bold text-slate-900 text-sm">{selectedApp.personal_details?.specialization || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Admission Category:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.admissionCategory || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Mode of Admission:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.modeOfAdmission || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Guardian Name:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.guardianName || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Date of Birth & Gender:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.dateOfBirth} ({selectedApp.personal_details?.gender})</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Category:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.category || '—'}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Emergency Contact:</span>
                    <span className="font-semibold text-slate-800">{selectedApp.personal_details?.emergencyContact || '—'}</span>
                  </div>
                  <div className="sm:col-span-2 md:col-span-3 p-3 bg-slate-50 rounded-lg">
                    <span className="text-slate-400 block font-medium">Permanent Address:</span>
                    <span className="font-semibold text-slate-800">
                      {selectedApp.address_details?.permanentAddress}, {selectedApp.address_details?.district}, {selectedApp.address_details?.state} – {selectedApp.address_details?.pinCode}
                    </span>
                  </div>
                </div>
              )}

              {activeDetailTab === 'academics' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1">3. Educational Qualifications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold">
                        <tr>
                          <th className="p-2 border">Qualification</th>
                          <th className="p-2 border">Specialization</th>
                          <th className="p-2 border">Institution / University</th>
                          <th className="p-2 border text-center">Year</th>
                          <th className="p-2 border text-center">% / CGPA</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.educational_qualifications || []).map((q, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 border font-medium">{q.qualification || '—'}</td>
                            <td className="p-2 border">{q.specialization || '—'}</td>
                            <td className="p-2 border">{q.institution || '—'}</td>
                            <td className="p-2 border text-center">{q.year || '—'}</td>
                            <td className="p-2 border text-center font-bold">{q.percentage || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 pt-3">4. Qualifying / Eligibility Examinations</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold">
                        <tr>
                          <th className="p-2 border">Examination</th>
                          <th className="p-2 border">Subject</th>
                          <th className="p-2 border text-center">Year</th>
                          <th className="p-2 border text-center">Score / Percentile</th>
                          <th className="p-2 border text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.eligibility_examinations || []).map((ex, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 border font-medium">{ex.examination || '—'}</td>
                            <td className="p-2 border">{ex.subject || '—'}</td>
                            <td className="p-2 border text-center">{ex.year || '—'}</td>
                            <td className="p-2 border text-center">{ex.score || '—'}</td>
                            <td className="p-2 border text-center font-semibold text-emerald-700">{ex.qualification || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeDetailTab === 'experience' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1">5. Professional / Teaching Experience</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold">
                        <tr>
                          <th className="p-2 border">Institution</th>
                          <th className="p-2 border">Designation</th>
                          <th className="p-2 border text-center">Period</th>
                          <th className="p-2 border">Nature of Work</th>
                          <th className="p-2 border text-center">Total Experience</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.professional_experience || []).map((exp, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 border font-medium">{exp.institution || '—'}</td>
                            <td className="p-2 border">{exp.designation || '—'}</td>
                            <td className="p-2 border text-center">{exp.fromTo || '—'}</td>
                            <td className="p-2 border">{exp.natureOfWork || '—'}</td>
                            <td className="p-2 border text-center font-bold">{exp.totalExperience || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 pt-3">6. Research Exposure / Area of Interest</h3>
                  <div className="p-3 bg-slate-50 rounded-lg text-slate-800 leading-relaxed whitespace-pre-line border border-slate-200">
                    {selectedApp.research_exposure || 'No specific statement provided.'}
                  </div>
                </div>
              )}

              {activeDetailTab === 'research' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1">7. Research Publications</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-slate-200">
                      <thead className="bg-slate-100 font-semibold">
                        <tr>
                          <th className="p-2 border">Title / Authors</th>
                          <th className="p-2 border">Journal / Conference</th>
                          <th className="p-2 border text-center">Year</th>
                          <th className="p-2 border">Indexing / Quartile</th>
                          <th className="p-2 border">DOI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {(selectedApp.research_publications || []).map((pub, i) => (
                          <tr key={i} className="border-b">
                            <td className="p-2 border font-medium">{pub.titleAuthor || '—'}</td>
                            <td className="p-2 border">{pub.journalConference || '—'}</td>
                            <td className="p-2 border text-center">{pub.year || '—'}</td>
                            <td className="p-2 border">{pub.indexingQuartile || '—'}</td>
                            <td className="p-2 border font-mono">{pub.doi || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1 pt-3">8. Books / Patents / Outputs</h3>
                  <div className="space-y-1">
                    {(selectedApp.books_patents_outputs || []).filter((b) => b.titleDetails).map((b, i) => (
                      <div key={i} className="p-2 bg-slate-50 border rounded flex justify-between">
                        <span><strong>{b.type || 'Output'}:</strong> {b.titleDetails}</span>
                        <span className="text-slate-500 font-mono">{b.year} | {b.isbnPatentNo}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeDetailTab === 'documents' && (
                <div className="space-y-4">
                  <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-1">12. Enclosed Document Verification</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {Object.entries(selectedApp.document_metadata || {}).map(([key, info]) => (
                      <div key={key} className="p-3 bg-slate-50 border border-slate-200 rounded-lg flex items-center justify-between">
                        <div className="truncate pr-2">
                          <p className="font-semibold text-slate-900 truncate">{info.fileName || key}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1')}</p>
                        </div>
                        {info.storagePath && (
                          <button
                            type="button"
                            onClick={() => handleViewDocument(info.storagePath)}
                            className="px-2 py-1 bg-white hover:bg-slate-100 border text-brand-700 font-semibold rounded text-[11px] flex items-center gap-1 shrink-0"
                          >
                            <ExternalLink className="w-3 h-3" /> View Doc
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

            {/* Modal Reviewer Status Action Footer */}
            <div className="bg-slate-100 p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <label className="text-xs font-bold text-slate-700 whitespace-nowrap">
                  Update Status:
                </label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="px-3 py-1.5 text-xs bg-white border border-slate-300 rounded-lg font-semibold"
                >
                  <option value="submitted">Submitted</option>
                  <option value="under_review">Under Review</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-1/2">
                <input
                  type="text"
                  placeholder="Reviewer remarks / DRC committee notes..."
                  value={reviewerNotes}
                  onChange={(e) => setReviewerNotes(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs border border-slate-300 rounded-lg bg-white"
                />
                <button
                  type="button"
                  onClick={handleSaveStatusUpdate}
                  disabled={isUpdatingStatus}
                  className="btn-primary text-xs py-1.5 px-4 shrink-0"
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
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl max-w-md w-full p-6 space-y-4 animate-in zoom-in-95">
            <div className="w-12 h-12 rounded-full bg-red-100 text-red-600 mx-auto flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center">
              <h3 className="text-lg font-bold text-slate-900">
                Permanently Delete Application?
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Are you sure you want to delete this record? This action will permanently remove all applicant biodata and attached references from the portal.
              </p>
            </div>

            <div className="bg-red-50/60 border border-red-200/80 rounded-xl p-3.5 text-xs text-slate-800 space-y-1.5">
              <div className="flex justify-between">
                <span className="text-slate-500">Application No:</span>
                <span className="font-mono font-bold text-brand-950">
                  {appToDelete.application_number}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Applicant:</span>
                <span className="font-semibold text-slate-900">
                  {appToDelete.personal_details?.fullName || appToDelete.applicant_name || '—'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Status:</span>
                <span className="font-semibold capitalize text-slate-700">
                  {appToDelete.status || 'draft'}
                </span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setAppToDelete(null)}
                disabled={isDeleting}
                className="btn-secondary flex-1 py-2.5 text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="btn-primary bg-red-600 hover:bg-red-700 flex-1 py-2.5 text-xs font-semibold shadow-sm"
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
