export type MoodOption = {
  id: string;
  emoji: string;
  label: string;
  description: string;
  badgeBg: string;
  badgeText: string;
};

export interface SurveyData {
  nama: string;
  isAnonim: boolean;
  mood: string;
  momenBahagia: string;
  keluhKesah: string;
  partSedihKecewa: string;
  arahPerubahan: string;
  pesanUntukKakSam: string;
  submittedAt?: string;
  // Optional for backward compatibility with drafts
  divisi?: string;
  divisiLainnya?: string;
}


export const MOOD_OPTIONS: MoodOption[] = [
  {
    id: 'lelah',
    emoji: '😭',
    label: 'Lelah banget',
    description: 'Beneran menguras tenaga dan pikiran sampai titik akhir',
    badgeBg: 'bg-amber-100/70 border-amber-300',
    badgeText: 'text-amber-800',
  },
  {
    id: 'rollercoaster',
    emoji: '🎢',
    label: 'Naik-turun seru',
    description: 'Campur aduk, kadang panik kadang bahagia, tapi banyak cerita',
    badgeBg: 'bg-orange-100/70 border-orange-300',
    badgeText: 'text-orange-800',
  },
  {
    id: 'bersyukur',
    emoji: '🤍',
    label: 'Bersyukur & bangga',
    description: 'Penuh rasa haru dan bangga bisa lalui ini bareng teman-teman',
    badgeBg: 'bg-rose-100/70 border-rose-300',
    badgeText: 'text-rose-800',
  },
  {
    id: 'sabar',
    emoji: '😤',
    label: 'Banyak nahan sabar',
    description: 'Ujian mental dan ego, banyak dinamika yang harus diredam',
    badgeBg: 'bg-stone-200/70 border-stone-400',
    badgeText: 'text-stone-800',
  },
];
