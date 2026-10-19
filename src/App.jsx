import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UniversityPortal from './components/portal/UniversityPortal';
import ApplicationForm from './components/ApplicationForm';
import SuccessView from './components/SuccessView';
import AdminDashboard from './components/AdminDashboard';
import ApplicationStatusModal from './components/portal/ApplicationStatusModal';
import PrivacyPolicyModal from './components/portal/PrivacyPolicyModal';
import EditApplicationModal from './components/portal/EditApplicationModal';
import { supabase, isSupabaseConfigured, dbService } from './lib/supabase';

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // 'portal' | 'form' | 'success' | 'admin'
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [editingApplication, setEditingApplication] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editModalInitialEmail, setEditModalInitialEmail] = useState('');

  // Handle email magic link click (only when explicit auth tokens are present in URL)
  useEffect(() => {
    if (!isSupabaseConfigured() || !supabase) return;

    const urlHash = window.location.hash || '';
    const urlSearch = window.location.search || '';
    const hasAuthTokenInUrl =
      urlHash.includes('access_token') ||
      urlHash.includes('type=magiclink') ||
      urlHash.includes('type=recovery') ||
      urlSearch.includes('code=');

    // On standard visits or reloads without auth token in URL, stay on portal and do NOT auto-open form
    if (!hasAuthTokenInUrl) {
      return;
    }

    const { data: authListener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if ((event === 'SIGNED_IN' || event === 'USER_UPDATED') && session?.user?.email) {
        const userEmail = session.user.email;
        const app = await dbService.findApplicationByEmail(userEmail);
        if (app) {
          setEditingApplication(app);
          setIsEditModalOpen(false);
          setCurrentView('form');
          window.scrollTo({ top: 0, behavior: 'smooth' });
          try {
            window.history.replaceState({}, document.title, window.location.pathname);
          } catch {}
        }
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  const handleOpenForm = () => {
    setEditingApplication(null);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenEditModal = (prefillEmail = '') => {
    setEditModalInitialEmail(prefillEmail || '');
    setIsEditModalOpen(true);
  };

  const handleOtpVerified = (application) => {
    setEditingApplication(application);
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenStatus = () => {
    setIsStatusModalOpen(true);
  };

  const handleOpenAdmin = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToPortal = () => {
    setEditingApplication(null);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentView('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExitEditModeToNew = () => {
    setEditingApplication(null);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionComplete = (record) => {
    setSubmittedRecord(record);
    setEditingApplication(null);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewApplication = () => {
    setSubmittedRecord(null);
    setEditingApplication(null);
    if (supabase) {
      supabase.auth.signOut().catch(() => {});
    }
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden w-full max-w-full">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenForm={handleOpenForm}
        onOpenStatus={handleOpenStatus}
        onOpenEdit={() => handleOpenEditModal()}
      />

      <main className="flex-1">
        {currentView === 'portal' && (
          <UniversityPortal
            onOpenForm={handleOpenForm}
            onOpenStatus={handleOpenStatus}
            onOpenEdit={(email) => handleOpenEditModal(email)}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentView === 'form' && (
          <ApplicationForm
            onSubmissionComplete={handleSubmissionComplete}
            onBackToPortal={handleBackToPortal}
            onExitEditMode={handleExitEditModeToNew}
            initialData={editingApplication}
            isEditMode={Boolean(editingApplication)}
          />
        )}

        {currentView === 'success' && (
          <SuccessView
            submittedRecord={submittedRecord}
            onStartNew={handleStartNewApplication}
            onBackToPortal={handleBackToPortal}
            onOpenEdit={() =>
              handleOpenEditModal(
                submittedRecord?.personal_details?.email ||
                  submittedRecord?.applicant_email ||
                  ''
              )
            }
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onBackToForm={handleBackToPortal} />
        )}
      </main>

      <Footer
        onOpenForm={handleOpenForm}
        onOpenStatus={handleOpenStatus}
        onOpenPrivacy={() => setIsPrivacyModalOpen(true)}
        setCurrentView={setCurrentView}
      />

      {/* Application Status Tracking Modal */}
      <ApplicationStatusModal
        isOpen={isStatusModalOpen}
        onClose={() => setIsStatusModalOpen(false)}
        onOpenForm={handleOpenForm}
        onOpenEdit={(email) => handleOpenEditModal(email)}
      />

      {/* Candidate Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />

      {/* Candidate OTP Verification & Edit Application Modal */}
      <EditApplicationModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onVerified={handleOtpVerified}
        initialEmail={editModalInitialEmail}
      />
    </div>
  );
}
