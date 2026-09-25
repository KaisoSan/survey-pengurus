import React, { useState, useEffect, useRef } from 'react';
import {
  ArrowLeft,
  Send,
  User,
  Shield,
  Heart,
  Flame,
  CloudRain,
  Compass,
  MessageCircleHeart,
  CheckCircle2,
} from 'lucide-react';
import {
  MOOD_OPTIONS,
  type SurveyData,
} from '../types/survey';

interface ScreenFormProps {
  initialData: SurveyData;
  onSubmit: (data: SurveyData) => void;
  onBackToWelcome: () => void;
  onSaveDraft: (data: SurveyData) => void;
}

export const ScreenForm: React.FC<ScreenFormProps> = ({
  initialData,
  onSubmit,
  onBackToWelcome,
  onSaveDraft,
}) => {
  const [formData, setFormData] = useState<SurveyData>(initialData);
  const [isDraftSaved, setIsDraftSaved] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Auto-save debounce effect
  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }
    saveTimeoutRef.current = setTimeout(() => {
      onSaveDraft(formData);
      setIsDraftSaved(true);
      const hideIndicator = setTimeout(() => setIsDraftSaved(false), 2000);
      return () => clearTimeout(hideIndicator);
    }, 600);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [formData, onSaveDraft]);

  // Calculate completion percentage
  const calculateProgress = () => {
    let filled = 0;
    const total = 7;

    // 1. Identitas (either has name or is marked anonymous)
    if (formData.isAnonim || formData.nama.trim().length > 0) {
      filled += 1;
    }

    // 2. Mood
    if (formData.mood) filled += 1;

    // 3. Momen Bahagia
    if (formData.momenBahagia.trim().length > 5) filled += 1;

    // 4. Keluh Kesah
    if (formData.keluhKesah.trim().length > 5) filled += 1;

    // 5. Part Sedih & Kecewa
    if (formData.partSedihKecewa.trim().length > 5) filled += 1;

    // 6. Arah & Perubahan
    if (formData.arahPerubahan.trim().length > 5) filled += 1;

    // 7. Pesan untuk Kak Sam
    if (formData.pesanUntukKakSam.trim().length > 5) filled += 1;

    return Math.min(100, Math.round((filled / total) * 100));
  };

  const progress = calculateProgress();

  const handleTextChange = (field: keyof SurveyData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (validationError) setValidationError(null);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Check if at least mood or one story is filled
    const hasAnyContent =
      formData.mood ||
      formData.momenBahagia.trim() ||
      formData.keluhKesah.trim() ||
      formData.partSedihKecewa.trim() ||
      formData.arahPerubahan.trim() ||
      formData.pesanUntukKakSam.trim();

    if (!hasAnyContent) {
      setValidationError('Tuliskan setidaknya satu unek-unek, cerita, atau pilih mood kamu sebelum mengirim.');
      window.scrollTo({ top: 300, behavior: 'smooth' });
      return;
    }

    setValidationError(null);
    onSubmit({
      ...formData,
      submittedAt: new Date().toISOString(),
    });
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-4 sm:py-8 animate-in fade-in duration-300">
      {/* Sticky Progress Bar & Navigation Header */}
      <div className="sticky top-2 z-40 bg-white/90 backdrop-blur-md rounded-2xl border border-stone-200/80 p-3.5 shadow-sm mb-6 flex flex-col gap-2">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onBackToWelcome}
            className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition-colors p-1.5 rounded-lg hover:bg-stone-100 cursor-pointer min-h-[44px]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Baca Ulang Surat</span>
          </button>

          <div className="flex items-center gap-2">
            <span
              className={`text-[11px] font-medium transition-opacity duration-300 flex items-center gap-1 ${
                isDraftSaved ? 'opacity-100 text-emerald-700' : 'opacity-0'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Tersimpan di HP</span>
            </span>
            <div className="text-xs font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/70">
              {progress}% Terisi
            </div>
          </div>
        </div>

        {/* Visual Progress Track */}
        <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
          <div
            className="bg-gradient-to-r from-amber-400 to-amber-500 h-2 rounded-full transition-all duration-500 ease-out"
            style={{ width: `${Math.max(5, progress)}%` }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Banner Safe Space */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-stone-800 text-xs sm:text-sm flex items-start gap-3">
          <Shield className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-stone-900">Ruang Cerita Jujur & Terbuka: </span>
            Tidak ada jawaban benar atau salah. Bicaralah sejujur-jujurnya demi kebaikanmu dan generasi adik tingkat berikutnya.
          </div>
        </div>

        {/* Validation Error Alert if any */}
        {validationError && (
          <div className="p-4 rounded-2xl bg-rose-50 border border-rose-300 text-rose-800 text-sm font-medium flex items-center gap-2 animate-shake">
            <span>⚠️</span>
            <span>{validationError}</span>
          </div>
        )}

        {/* SECTION 1: IDENTITAS */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-5">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              1
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Identitas Pengisi</h2>
              <p className="text-xs text-stone-500">Bisa gunakan nama asli atau kirim secara anonim</p>
            </div>
          </div>

          {/* Anonymous Toggle Pill */}
          <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-stone-800 font-medium">
              <span>🤫</span>
              <span>Kirim sebagai Anonim / Rahasia</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer min-h-[44px]">
              <input
                type="checkbox"
                checked={formData.isAnonim}
                onChange={(e) => {
                  const checked = e.target.checked;
                  setFormData((prev) => ({
                    ...prev,
                    isAnonim: checked,
                    nama: checked ? '' : prev.nama,
                  }));
                }}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-amber-400 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[11px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-600"></div>
            </label>
          </div>

          {/* Nama Input (Disabled if Anonymous) */}
          {!formData.isAnonim && (
            <div className="space-y-1.5 animate-in fade-in duration-200">
              <label htmlFor="input-nama" className="text-xs sm:text-sm font-semibold text-stone-700 flex items-center gap-1.5">
                <User className="w-4 h-4 text-stone-400" />
                <span>Nama Lengkap / Panggilan</span>
                <span className="text-stone-400 text-xs font-normal">(opsional)</span>
              </label>
              <input
                id="input-nama"
                type="text"
                value={formData.nama}
                onChange={(e) => handleTextChange('nama', e.target.value)}
                placeholder="Contoh: Budi, Salsa, atau nama panggilanmu"
                className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/50 min-h-[44px]"
              />
            </div>
          )}
        </div>

        {/* SECTION 2: OVERALL MOOD */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-4">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold text-sm">
              2
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-stone-900">Overall Mood 1 Periode</h2>
              <p className="text-xs text-stone-500">Gambarkan perasaanmu selama menjalani 1 periode ini</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {MOOD_OPTIONS.map((mood) => {
              const isSelected = formData.mood === mood.id;
              return (
                <button
                  key={mood.id}
                  type="button"
                  onClick={() => setFormData((prev) => ({ ...prev, mood: mood.id }))}
                  className={`min-h-[56px] p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-3.5 ${
                    isSelected
                      ? `${mood.badgeBg} ring-2 ring-amber-500 shadow-md`
                      : 'bg-stone-50/60 border-stone-200 hover:border-stone-300 hover:bg-stone-100'
                  }`}
                >
                  <span className="text-3xl shrink-0 select-none">{mood.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-stone-900 leading-tight">{mood.label}</p>
                    <p className="text-xs text-stone-600 mt-1 leading-snug">{mood.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* SECTION 3: MOMEN PALING BAHAGIA & BERKESAN */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center font-bold text-sm">
              3
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
                <span>Part Paling Bahagia & Berkesan</span>
              </h2>
              <p className="text-xs text-stone-500">Momen yang paling bikin bangga atau bersyukur</p>
            </div>
          </div>

          <label htmlFor="momen-bahagia" className="text-xs sm:text-sm font-medium text-stone-700 block leading-relaxed">
            Momen apa yang paling bikin kamu bahagia, bangga, atau bersyukur selama kepengurusan ini?
          </label>
          <textarea
            id="momen-bahagia"
            rows={4}
            value={formData.momenBahagia}
            onChange={(e) => handleTextChange('momenBahagia', e.target.value)}
            placeholder="Ceritain momen pas event sukses, kebersamaan divisi, candaan saat rapat larut malam, atau pencapaian yang bikin haru..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/40 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* SECTION 4: KELUH KESAH (THE UNFILTERED RANT) */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              4
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-amber-600" />
                <span>Keluh Kesah & Kekesalan (The Unfiltered Rant)</span>
              </h2>
              <p className="text-xs text-amber-700 font-medium">Ruang aman 100%, ga ada yang dihakimi di sini</p>
            </div>
          </div>

          <label htmlFor="keluh-kesah" className="text-xs sm:text-sm font-medium text-stone-700 block leading-relaxed">
            Keluarkan unek-unek, rasa capek, atau kekesalan yang selama ini kamu tahan. Ruang ini 100% aman buat kamu bercerita.
          </label>
          <textarea
            id="keluh-kesah"
            rows={5}
            value={formData.keluhKesah}
            onChange={(e) => handleTextChange('keluhKesah', e.target.value)}
            placeholder="Boleh banget tumpahkan capeknya koordinasi, anggota yang hilang-hilangan, beban tugas yang timpang, atau hal yang bikin emosi di dada..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/40 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* SECTION 5: PART SEDIH & KECEWA */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-sm">
              5
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <CloudRain className="w-4 h-4 text-blue-500" />
                <span>Part Sedih & Kecewa</span>
              </h2>
              <p className="text-xs text-stone-500">Hal yang sempat bikin nyesek atau patah semangat</p>
            </div>
          </div>

          <label htmlFor="part-sedih" className="text-xs sm:text-sm font-medium text-stone-700 block leading-relaxed">
            Hal apa yang sempat bikin kamu kecewa, nyesek, atau sedih selama di organisasi ini?
          </label>
          <textarea
            id="part-sedih"
            rows={4}
            value={formData.partSedihKecewa}
            onChange={(e) => handleTextChange('partSedihKecewa', e.target.value)}
            placeholder="Misal ekspektasi yang ga sesuai, merasa kurang didengar, miskomunikasi internal, atau rasa kesepian saat pegang tanggung jawab..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/40 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* SECTION 6: ARAH & PERUBAHAN */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-sm">
              6
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <Compass className="w-4 h-4 text-emerald-600" />
                <span>Arah & Perubahan untuk Generasi Selanjutnya</span>
              </h2>
              <p className="text-xs text-stone-500">Warisan kebiasaan baik & evaluasi sistem</p>
            </div>
          </div>

          <label htmlFor="arah-perubahan" className="text-xs sm:text-sm font-medium text-stone-700 block leading-relaxed">
            Menurut kamu, apa kebiasaan atau sistem periode ini yang HARUS diubah agar junior periode depan tidak merasakan hal buruk yang sama?
          </label>
          <textarea
            id="arah-perubahan"
            rows={4}
            value={formData.arahPerubahan}
            onChange={(e) => handleTextChange('arahPerubahan', e.target.value)}
            placeholder="Saran alur kerja, cara regenerasi, budaya rapat, pembagian tugas antar sekbid, atau batasan waktu istirahat yang lebih sehat..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/40 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* SECTION 7: PESAN KHUSUS UNTUK KAK SAM */}
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-100 shadow-sm space-y-3">
          <div className="flex items-center gap-2.5 border-b border-stone-100 pb-3">
            <div className="w-8 h-8 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold text-sm">
              7
            </div>
            <div className="flex-1">
              <h2 className="text-base sm:text-lg font-bold text-stone-900 flex items-center gap-1.5">
                <MessageCircleHeart className="w-4 h-4 text-purple-600" />
                <span>Pesan Khusus untuk Kak Sam</span>
              </h2>
              <p className="text-xs text-stone-500">Pesan langsung dari hati ke hati untuk ketua kalian</p>
            </div>
          </div>

          <label htmlFor="pesan-sam" className="text-xs sm:text-sm font-medium text-stone-700 block leading-relaxed">
            Pesan, kritik, masukan, atau unek-unek khusus buat Kak Sam.
          </label>
          <textarea
            id="pesan-sam"
            rows={4}
            value={formData.pesanUntukKakSam}
            onChange={(e) => handleTextChange('pesanUntukKakSam', e.target.value)}
            placeholder="Kritik kepemimpinan, kesan selama dibimbing Kak Sam, ucapan terima kasih, atau apa pun yang ingin kamu sampaikan langsung..."
            className="w-full px-4 py-3 text-sm rounded-xl border border-stone-200 focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 bg-stone-50/40 transition-all placeholder:text-stone-400"
          />
        </div>

        {/* SUBMIT BUTTON CONTAINER */}
        <div className="pt-4 pb-10">
          <button
            type="submit"
            className="w-full min-h-[56px] px-8 py-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-white font-bold rounded-2xl shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2.5 text-base sm:text-lg cursor-pointer transition-all focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            <span>Kirim Jawaban 💌</span>
            <Send className="w-5 h-5" />
          </button>
          <p className="text-center text-xs text-stone-400 mt-3">
            Setelah diklik, kamu bisa langsung mengirimkan rekap jawaban via WhatsApp atau menyalinnya.
          </p>
        </div>
      </form>
    </div>
  );
};
