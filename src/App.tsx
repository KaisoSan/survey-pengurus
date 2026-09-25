import React, { useState, useCallback } from 'react';
import { ScreenWelcome } from './components/ScreenWelcome';
import { ScreenForm } from './components/ScreenForm';
import { ScreenThankYou } from './components/ScreenThankYou';
import { ToastContainer, type ToastMessage, type ToastType } from './components/Toast';
import type { SurveyData } from './types/survey';
import { HeartHandshake } from 'lucide-react';

const DRAFT_STORAGE_KEY = 'survey_sam_draft_v1';
const SUBMITTED_STORAGE_KEY = 'survey_sam_submitted_v1';

const defaultSurveyData: SurveyData = {
  nama: '',
  isAnonim: false,
  mood: '',
  momenBahagia: '',
  keluhKesah: '',
  partSedihKecewa: '',
  arahPerubahan: '',
  pesanUntukKakSam: '',
};

export const App: React.FC = () => {
  const [currentScreen, setCurrentScreen] = useState<'welcome' | 'form' | 'thankyou'>('welcome');
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Restore saved draft or submitted data from localStorage lazily
  const [surveyData, setSurveyData] = useState<SurveyData>(() => {
    try {
      const savedSubmitted = localStorage.getItem(SUBMITTED_STORAGE_KEY);
      if (savedSubmitted) {
        return JSON.parse(savedSubmitted) as SurveyData;
      }
      const savedDraft = localStorage.getItem(DRAFT_STORAGE_KEY);
      if (savedDraft) {
        return JSON.parse(savedDraft) as SurveyData;
      }
    } catch {
      // fallback
    }
    return defaultSurveyData;
  });

  const [hasExistingDraft, setHasExistingDraft] = useState<boolean>(() => {
    try {
      return Boolean(
        localStorage.getItem(SUBMITTED_STORAGE_KEY) ||
        localStorage.getItem(DRAFT_STORAGE_KEY)
      );
    } catch {
      return false;
    }
  });

  // Show toast notification helper
  const showToast = useCallback((title: string, description?: string, type: ToastType = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts((prev) => [...prev, { id, title, description, type }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const handleDismissToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Save draft helper
  const handleSaveDraft = useCallback((data: SurveyData) => {
    try {
      localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(data));
      setHasExistingDraft(true);
    } catch {
      // ignore quota error
    }
  }, []);

  // Clear draft
  const handleClearDraft = () => {
    try {
      localStorage.removeItem(DRAFT_STORAGE_KEY);
      setSurveyData(defaultSurveyData);
      setHasExistingDraft(false);
      showToast('Draf Dibersihkan', 'Formulir telah dikembalikan ke kondisi awal.', 'info');
    } catch {
      // ignore
    }
  };

  // Form submit handler
  const handleSubmitSurvey = (submittedData: SurveyData) => {
    setSurveyData(submittedData);
    try {
      localStorage.setItem(SUBMITTED_STORAGE_KEY, JSON.stringify(submittedData));
      localStorage.removeItem(DRAFT_STORAGE_KEY);
    } catch {
      // ignore
    }
    setCurrentScreen('thankyou');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Reset everything to start fresh
  const handleResetAll = () => {
    if (window.confirm('Apakah kamu yakin ingin mereset formulir dan mulai dari awal?')) {
      try {
        localStorage.removeItem(DRAFT_STORAGE_KEY);
        localStorage.removeItem(SUBMITTED_STORAGE_KEY);
      } catch {
        // ignore
      }
      setSurveyData(defaultSurveyData);
      setHasExistingDraft(false);
      setCurrentScreen('welcome');
      showToast('Formulir Direset', 'Kamu bisa mengisi survei dari awal kembali.', 'info');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FDFBF7] text-[#1E293B]">
      {/* Top Navbar Header */}
      <header className="border-b border-stone-200/70 bg-white/70 backdrop-blur-md sticky top-0 z-30 px-4 py-3">
        <div className="max-w-2xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold shadow-xs">
              <HeartHandshake className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-amber-800">
                OSIS Safe Space
              </p>
              <p className="text-[11px] text-stone-500 font-medium">Survei Akhir Periode Kak Sam</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 text-xs text-stone-500">
            {currentScreen === 'welcome' && (
              <span className="bg-stone-100 text-stone-700 px-2.5 py-1 rounded-full font-medium">
                Halaman 1 / 3
              </span>
            )}
            {currentScreen === 'form' && (
              <span className="bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">
                Halaman 2 / 3
              </span>
            )}
            {currentScreen === 'thankyou' && (
              <span className="bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">
                Selesai 🎉
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col justify-center">
        {currentScreen === 'welcome' && (
          <ScreenWelcome
            onStartSurvey={() => {
              setCurrentScreen('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            hasExistingDraft={hasExistingDraft}
            onClearDraft={handleClearDraft}
          />
        )}

        {currentScreen === 'form' && (
          <ScreenForm
            initialData={surveyData}
            onSubmit={handleSubmitSurvey}
            onBackToWelcome={() => {
              setCurrentScreen('welcome');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSaveDraft={handleSaveDraft}
          />
        )}

        {currentScreen === 'thankyou' && (
          <ScreenThankYou
            data={surveyData}
            onEditAgain={() => {
              setCurrentScreen('form');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onResetAll={handleResetAll}
            onShowToast={showToast}
          />
        )}
      </main>

      {/* Toast Alert Notifications */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
};

export default App;
