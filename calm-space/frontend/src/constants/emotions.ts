export interface EmotionConfig {
  id: string;
  label: string;
  emoji: string;
  color: string;
  bg: string;
}

export const EMOTIONS_CONFIG: EmotionConfig[] = [
  { id: 'happy',   label: 'Heureux',  emoji: '😊', color: 'from-yellow-400 to-orange-400',  bg: 'bg-yellow-50 border-yellow-200' },
  { id: 'calm',    label: 'Calme',    emoji: '😌', color: 'from-blue-400 to-cyan-400',      bg: 'bg-blue-50 border-blue-200' },
  { id: 'neutral', label: 'Neutre',   emoji: '😐', color: 'from-gray-400 to-slate-400',     bg: 'bg-gray-50 border-gray-200' },
  { id: 'anxious', label: 'Anxieux',  emoji: '😰', color: 'from-purple-400 to-pink-400',    bg: 'bg-purple-50 border-purple-200' },
  { id: 'sad',     label: 'Triste',   emoji: '😢', color: 'from-indigo-400 to-blue-500',    bg: 'bg-indigo-50 border-indigo-200' },
  { id: 'loved',   label: 'Aimé',     emoji: '🥰', color: 'from-pink-400 to-rose-400',      bg: 'bg-pink-50 border-pink-200' },
  { id: 'angry',   label: 'En colère',emoji: '😤', color: 'from-red-400 to-orange-500',     bg: 'bg-red-50 border-red-200' },
  { id: 'tired',   label: 'Fatigué',  emoji: '😴', color: 'from-slate-400 to-gray-500',     bg: 'bg-slate-50 border-slate-200' },
];
