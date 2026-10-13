import React, { useState } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import ApplicationForm from './components/ApplicationForm';
import SuccessView from './components/SuccessView';
import AdminDashboard from './components/AdminDashboard';

export default function App() {
  const [currentView, setCurrentView] = useState('form'); // 'form' | 'success' | 'admin'
  const [submittedRecord, setSubmittedRecord] = useState(null);

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
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <Header currentView={currentView} setCurrentView={setCurrentView} />

      <main className="flex-1">
        {currentView === 'form' && (
          <ApplicationForm onSubmissionComplete={handleSubmissionComplete} />
        )}

        {currentView === 'success' && (
          <SuccessView
            submittedRecord={submittedRecord}
            onStartNew={handleStartNewApplication}
          />
        )}

        {currentView === 'admin' && (
          <AdminDashboard onBackToForm={() => setCurrentView('form')} />
        )}
      </main>

      <Footer />
    </div>
  );
}
