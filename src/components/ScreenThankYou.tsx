import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Heart,
  Copy,
  Check,
  Share2,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  ShieldCheck,
  Phone,
} from 'lucide-react';
import { type SurveyData, MOOD_OPTIONS } from '../types/survey';
import { APP_CONFIG } from '../config';
import { fireCelebrationConfetti } from '../utils/confetti';
import { formatSurveyResponseForWhatsApp, generateWhatsAppLink } from '../utils/whatsappFormatter';

interface ScreenThankYouProps {
  data: SurveyData;
  onEditAgain: () => void;
  onResetAll: () => void;
  onShowToast: (title: string, description?: string, type?: 'success' | 'error' | 'info') => void;
}

export const ScreenThankYou: React.FC<ScreenThankYouProps> = ({
  data,
  onEditAgain,
  onResetAll,
  onShowToast,
}) => {
  const [copied, setCopied] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [customPhone, setCustomPhone] = useState(APP_CONFIG.KAK_SAM_WHATSAPP);
  const [showPhoneSetting, setShowPhoneSetting] = useState(false);

  // Trigger celebration confetti on mount
  useEffect(() => {
    fireCelebrationConfetti();
  }, []);

  const formattedMessage = formatSurveyResponseForWhatsApp(data);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(formattedMessage);
      setCopied(true);
      onShowToast(
        'Rangkuman Jawaban Berhasil Disalin! 📋',
        'Kamu bisa langsung menempelkannya (paste) di chat WhatsApp atau catatan pribadimu.',
        'success'
      );
      setTimeout(() => setCopied(false), 3000);
    } catch {
      // Fallback
      onShowToast(
        'Gagal menyalin secara otomatis',
        'Silakan salin teks dari pratinjau rangkuman di bawah.',
        'error'
      );
    }
  };

  const handleOpenWhatsApp = () => {
    const waUrl = generateWhatsAppLink(formattedMessage, customPhone);
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    onShowToast(
      'Membuka WhatsApp... 📲',
      'Pesan rekap telah terisi otomatis, tinggal klik Kirim di WhatsApp!',
      'info'
    );
  };

  const moodObj = MOOD_OPTIONS.find((m) => m.id === data.mood);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-500">
      {/* Thank you card */}
      <div className="bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-200/60 border border-stone-100 text-center relative overflow-hidden">
        {/* Confetti button */}
        <button
          type="button"
          onClick={fireCelebrationConfetti}
          className="absolute top-4 right-4 p-2 text-stone-400 hover:text-amber-600 rounded-full hover:bg-stone-50 transition-colors cursor-pointer"
          title="Semburkan confetti lagi!"
          aria-label="Semburkan confetti lagi"
        >
          <Sparkles className="w-5 h-5 text-amber-500 animate-spin" />
        </button>

        {/* Big Heart Icon */}
        <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto rounded-3xl bg-amber-50 border border-amber-200 flex items-center justify-center text-3xl sm:text-4xl shadow-inner mb-5">
          💌
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
          Terima Kasih Banyak! 🤍
        </h1>
        <p className="text-sm sm:text-base text-stone-600 mt-2 max-w-lg mx-auto leading-relaxed">
          Semua unek-unek, cerita bahagia, dan masukanmu sangat berarti bagi Kak Sam dan masa depan kepengurusan OSIS berikutnya.
        </p>

        {/* Safe space note & mood pill */}
        <div className="my-5 flex flex-col sm:flex-row items-center justify-center gap-2">
          <div className="p-3 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-center gap-2 text-xs text-stone-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>
              {data.isAnonim
                ? 'Terkirim secara Anonim / Rahasia (identitasmu aman).'
                : `Terkirim atas nama: ${data.nama || 'Anggota OSIS'}.`}
            </span>
          </div>
          {moodObj && (
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center gap-1.5 text-xs text-amber-800 font-medium">
              <span>Mood 1 Periode:</span>
              <span className="font-bold">{moodObj.emoji} {moodObj.label}</span>
            </div>
          )}
        </div>

        {/* Primary Action Buttons */}
        <div className="space-y-3 pt-3">
          {/* WhatsApp Button */}
          <button
            type="button"
            onClick={handleOpenWhatsApp}
            className="w-full min-h-[54px] px-6 py-3.5 bg-[#25D366] hover:bg-[#20BD5A] active:scale-[0.99] text-white font-bold rounded-2xl shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2.5 text-base cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-emerald-200"
          >
            <Share2 className="w-5 h-5" />
            <span>Kirim Rekap via WhatsApp ke Kak Sam</span>
          </button>

          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`w-full min-h-[50px] px-6 py-3 border font-semibold rounded-2xl flex items-center justify-center gap-2 text-sm sm:text-base transition-all cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-200 ${
              copied
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800'
                : 'bg-stone-50 hover:bg-stone-100 border-stone-200 text-stone-800'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Rangkuman Tersalin ke Clipboard!</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-stone-600" />
                <span>Salin Rangkuman Jawaban</span>
              </>
            )}
          </button>
        </div>

        {/* Phone setting toggle */}
        <div className="pt-4 border-t border-stone-100 mt-6">
          <button
            type="button"
            onClick={() => setShowPhoneSetting(!showPhoneSetting)}
            className="text-xs text-stone-500 hover:text-stone-800 flex items-center justify-center gap-1.5 mx-auto cursor-pointer"
          >
            <Phone className="w-3.5 h-3.5 text-emerald-600" />
            <span>
              Nomor WhatsApp Kak Sam: <strong className="text-stone-800 font-semibold">{customPhone}</strong>
            </span>
            <span className="text-amber-700 underline ml-1">
              ({showPhoneSetting ? 'Tutup' : 'Ubah'})
            </span>
          </button>

          {showPhoneSetting && (
            <div className="mt-3 p-3.5 rounded-2xl bg-amber-50/60 border border-amber-200 text-left animate-in fade-in duration-200">
              <label htmlFor="input-phone" className="block text-xs font-semibold text-stone-700 mb-1">
                Nomor WhatsApp Tujuan:
              </label>
              <div className="flex gap-2">
                <input
                  id="input-phone"
                  type="tel"
                  value={customPhone}
                  onChange={(e) => setCustomPhone(e.target.value)}
                  placeholder="Contoh: 082228307927"
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-amber-400 bg-white"
                />
              </div>
              <p className="text-[11px] text-stone-500 mt-1.5">
                Bisa ditulis dengan awalan 08 atau 62. Sistem otomatis mengarahkannya ke chat WhatsApp Kak Sam.
              </p>
            </div>
          )}
        </div>

        {/* Collapsible Answer Preview */}
        <div className="mt-6 pt-4 border-t border-stone-100 text-left">
          <button
            type="button"
            onClick={() => setShowSummary(!showSummary)}
            className="w-full py-2.5 flex items-center justify-between text-xs sm:text-sm font-semibold text-stone-700 hover:text-stone-900 cursor-pointer"
          >
            <span>Lihat Rangkuman Jawaban Kamu</span>
            {showSummary ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showSummary && (
            <div className="mt-3 p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs sm:text-sm text-stone-700 space-y-3 font-mono whitespace-pre-wrap leading-relaxed max-h-96 overflow-y-auto">
              {formattedMessage}
            </div>
          )}
        </div>

        {/* Edit or Reset controls */}
        <div className="mt-6 pt-4 border-t border-stone-100 flex flex-wrap items-center justify-center gap-4 text-xs font-medium text-stone-500">
          <button
            type="button"
            onClick={onEditAgain}
            className="hover:text-stone-900 underline cursor-pointer"
          >
            Ubah / Edit Jawaban
          </button>
          <span>•</span>
          <button
            type="button"
            onClick={onResetAll}
            className="text-rose-500 hover:text-rose-700 underline flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Mulai Ulang Survei Baru</span>
          </button>
        </div>
      </div>

      {/* Footer Signature */}
      <div className="text-center mt-6 text-stone-400 text-xs flex items-center justify-center gap-1">
        <span>Semoga sukses untuk langkah kalian selanjutnya!</span>
        <Heart className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
      </div>
    </div>
  );
};
