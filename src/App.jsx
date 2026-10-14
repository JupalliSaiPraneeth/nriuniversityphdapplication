import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import UniversityPortal from './components/portal/UniversityPortal';
import ApplicationForm from './components/ApplicationForm';
import SuccessView from './components/SuccessView';
import AdminDashboard from './components/AdminDashboard';
import ApplicationStatusModal from './components/portal/ApplicationStatusModal';
import PrivacyPolicyModal from './components/portal/PrivacyPolicyModal';

export default function App() {
  const [currentView, setCurrentView] = useState('portal'); // 'portal' | 'form' | 'success' | 'admin'
  const [submittedRecord, setSubmittedRecord] = useState(null);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);

  const handleOpenForm = () => {
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
    setCurrentView('portal');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmissionComplete = (record) => {
    setSubmittedRecord(record);
    setCurrentView('success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartNewApplication = () => {
    setSubmittedRecord(null);
    setCurrentView('form');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans overflow-x-hidden w-full max-w-full">
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onOpenStatus={handleOpenStatus}
      />

      <main className="flex-1">
        {currentView === 'portal' && (
          <UniversityPortal
            onOpenForm={handleOpenForm}
            onOpenStatus={handleOpenStatus}
            onOpenAdmin={handleOpenAdmin}
          />
        )}

        {currentView === 'form' && (
          <ApplicationForm
            onSubmissionComplete={handleSubmissionComplete}
            onBackToPortal={handleBackToPortal}
          />
        )}

        {currentView === 'success' && (
          <SuccessView
            submittedRecord={submittedRecord}
            onStartNew={handleStartNewApplication}
            onBackToPortal={handleBackToPortal}
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
      />

      {/* Candidate Privacy Policy Modal */}
      <PrivacyPolicyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
    </div>
  );
}
