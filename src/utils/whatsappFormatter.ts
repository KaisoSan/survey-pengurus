import { MOOD_OPTIONS, type SurveyData } from '../types/survey';
import { APP_CONFIG } from '../config';

export const formatSurveyResponseForWhatsApp = (data: SurveyData): string => {
  const moodObj = MOOD_OPTIONS.find((m) => m.id === data.mood);
  const moodText = moodObj ? `${moodObj.emoji} ${moodObj.label}` : (data.mood || 'Belum dipilih');

  const senderName = data.isAnonim ? '🤫 Anonim (Junior OSIS)' : (data.nama.trim() || 'Tanpa Nama');

  const lines = [
    '✨ *EVALUASI AKHIR PERIODE OSIS: UNTUK KAK SAM* ✨',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '',
    `👤 *Nama:* ${senderName}`,
    `💭 *Mood 1 Periode:* ${moodText}`,
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🌟 *Momen Paling Bahagia & Berkesan:*',
    data.momenBahagia.trim() || '_(tidak diisi)_',
    '',
    '🔥 *Keluh Kesah & Kekesalan (Unfiltered Rant):*',
    data.keluhKesah.trim() || '_(tidak diisi)_',
    '',
    '🌧️ *Part Sedih & Kecewa:*',
    data.partSedihKecewa.trim() || '_(tidak diisi)_',
    '',
    '🌱 *Arah & Perubahan untuk Generasi Selanjutnya:*',
    data.arahPerubahan.trim() || '_(tidak diisi)_',
    '',
    '💌 *Pesan Khusus untuk Kak Sam:*',
    data.pesanUntukKakSam.trim() || '_(tidak diisi)_',
    '',
    '━━━━━━━━━━━━━━━━━━━━━━━━━━━━',
    '🤍 _Pesan ini dikirim melalui Web Safe Space Survei OSIS Kak Sam._',
  ];

  return lines.join('\n');
};

export const generateWhatsAppLink = (text: string, phoneNumber?: string): string => {
  const targetPhone = phoneNumber && phoneNumber.trim() ? phoneNumber : APP_CONFIG.KAK_SAM_WHATSAPP;
  let cleanPhone = targetPhone.replace(/[^0-9]/g, '');

  // Convert leading 0 to 62 for Indonesian numbers
  if (cleanPhone.startsWith('0')) {
    cleanPhone = '62' + cleanPhone.slice(1);
  }

  const encodedText = encodeURIComponent(text);
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodedText}`;
  }
  return `https://wa.me/?text=${encodedText}`;
};
