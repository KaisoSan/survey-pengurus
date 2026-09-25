import React, { useEffect } from 'react';
import { Sparkles, Heart, MailOpen, Clock, ShieldCheck, ChevronRight } from 'lucide-react';
import { fireWarmConfetti } from '../utils/confetti';

interface ScreenWelcomeProps {
  onStartSurvey: () => void;
  hasExistingDraft: boolean;
  onClearDraft?: () => void;
}

export const ScreenWelcome: React.FC<ScreenWelcomeProps> = ({
  onStartSurvey,
  hasExistingDraft,
  onClearDraft,
}) => {
  useEffect(() => {
    // Soft confetti burst when the letter opens
    const timer = setTimeout(() => {
      fireWarmConfetti();
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto px-4 py-6 sm:py-10 animate-in fade-in duration-500">
      {/* Header Badge */}
      <div className="flex items-center justify-center gap-2 mb-4 text-xs sm:text-sm font-medium text-amber-800 bg-amber-100/80 border border-amber-200/80 px-3.5 py-1.5 rounded-full w-fit mx-auto shadow-xs">
        <MailOpen className="w-4 h-4 text-amber-600 animate-pulse" />
        <span>Pesan Khusus & Ruang Aman OSIS</span>
      </div>

      {/* Main Letter Envelope Card */}
      <article className="relative bg-white rounded-3xl p-6 sm:p-10 shadow-xl shadow-stone-200/60 border border-stone-100 overflow-hidden">
        {/* Subtle decorative stamp / badge in the top right corner */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 border-2 border-dashed border-amber-300 rounded-xl p-2 bg-amber-50/60 text-center select-none rotate-3">
          <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800">OSIS</div>
          <div className="text-base leading-none my-0.5">💌</div>
          <div className="text-[9px] text-amber-600 font-mono">2025/2026</div>
        </div>

        {/* Letter Greeting */}
        <div className="mb-6 pr-16 sm:pr-20">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight leading-snug">
            Surat Hangat dari <span className="text-amber-600">Kak Sam</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>Dibaca dalam waktu ~3 menit</span>
          </p>
        </div>

        {/* Letter Body - verbatim as requested */}
        <div className="space-y-4 text-stone-700 text-sm sm:text-base leading-relaxed sm:leading-loose text-left font-normal border-t border-b border-stone-100 py-6 my-2">
          <p className="font-medium text-stone-900">
            Congratulations! 🎉 kepada kalian semua. Kemarin kalian telah menyelesaikan acara terbesar kalian!, sebuah pencapaian terbesar kalian selama 1 periode ini dan telah kalian sukseskan acaranya!!. Ucapan terima kasih terbesar kakak untuk kalian karena itu adalah event terakhir kalian (mungkin si yah). Dan ucapan mohon maaf sebesar-besarnya dari kakak karena ga bisa nemenin dan ada di samping kalian selama persiapan dan jalannya event.
          </p>

          <p>
            Selain itu, kalian sudah 1 periode kepengurusan kalian di OSIS. Selama 1 periode ini kalian sudah melewati banyak hal, entah itu hal yg membuat kalian bahagia, senang dan duka, maupun sedih. Oleh karena itu, kakak pengen tau keluh kesah kalian, bahagia senangnya kalian, sedihnya kalian, kecewanya kalian selama 1 periode ini (intinya kayak survei gitu wkwk).
          </p>

          <p>
            Dan tujuan kakak minta kalian untuk mengisi survei dari kakak adalah apa yg perlu diubah dari periode sebelumnya, arah yg jelas untuk periode selanjutnya, dan bagaimana untuk menyikapi generasi kalian dengan cara yg lebih tepat, karena pastinya ada beberapa hal yg kalian rasakan tidak perlu sampai junior kalian rasakan karena arahnya yg masih kurang tepat.
          </p>

          <p>
            Terimakasih sekali lagi untuk meluangkan waktu kalian untuk membuka dan membaca link yg kakak kirim. Dan sekarang kakak minta waktunya sebentar lagi yaa untuk ngisi surveinya.
          </p>

          {/* Letter Closing & Signature */}
          <div className="pt-4 text-right">
            <p className="text-stone-600 italic">Love you all,</p>
            <p className="text-xl sm:text-2xl font-bold text-amber-700 font-serif mt-1">
              Kak Sam
            </p>
          </div>
        </div>

        {/* Safe Space Highlight Box */}
        <div className="my-6 p-4 rounded-2xl bg-[#FFFDF9] border border-amber-200/70 flex items-start gap-3 text-stone-700">
          <ShieldCheck className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs sm:text-sm">
            <strong className="text-stone-900 block font-semibold mb-0.5">100% Safe Space & Bebas Berekspresi</strong>
            <span>
              Kamu bisa memilih mengirim secara <strong>Anonim / Rahasia</strong> jika ingin lebih nyaman. Semua masukan, cerita bahagia, maupun unek-unek kalian sangat dihargai untuk perbaikan nyata ke depan.
            </span>
          </div>
        </div>

        {/* Existing Draft Notice if available */}
        {hasExistingDraft && (
          <div className="mb-5 p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-xs sm:text-sm text-amber-900 flex items-center justify-between gap-3">
            <span className="flex items-center gap-1.5">
              <span>💾</span>
              <span>Kamu punya draf jawaban sebelumnya yang tersimpan di HP ini.</span>
            </span>
            {onClearDraft && (
              <button
                type="button"
                onClick={onClearDraft}
                className="text-amber-800 hover:text-amber-950 underline shrink-0 font-medium cursor-pointer"
              >
                Reset Draf
              </button>
            )}
          </div>
        )}

        {/* Primary CTA */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-3">
          <button
            type="button"
            onClick={onStartSurvey}
            className="w-full sm:w-auto flex-1 min-h-[52px] px-8 py-3.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 active:scale-[0.99] text-white font-semibold rounded-2xl shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2.5 transition-all text-base cursor-pointer focus:outline-none focus:ring-4 focus:ring-amber-300"
          >
            <span>{hasExistingDraft ? 'Lanjutkan Isi Survei ✨' : 'Mulai Isi Survei ✨'}</span>
            <ChevronRight className="w-5 h-5" />
          </button>

          <button
            type="button"
            onClick={fireWarmConfetti}
            className="text-stone-400 hover:text-amber-600 p-2.5 rounded-xl hover:bg-stone-50 transition-colors flex items-center gap-1.5 text-xs font-medium cursor-pointer"
            title="Klik untuk semburan confetti!"
          >
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">Efek Confetti</span>
          </button>
        </div>
      </article>

      {/* Footer subtle text */}
      <p className="text-center text-xs text-stone-400 mt-6 flex items-center justify-center gap-1.5">
        <span>Dibuat dengan</span>
        <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" />
        <span>khusus untuk keluarga besar OSIS</span>
      </p>
    </div>
  );
};
