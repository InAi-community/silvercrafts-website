import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  onNavigate: (page: 'home' | 'quote') => void;
  label?: string;
}

export default function BackButton({ onNavigate, label = 'Back to Home' }: BackButtonProps) {
  return (
    <button
      onClick={() => onNavigate('home')}
      className="fixed top-10 md:top-10 left-4 md:left-6 z-[70] flex items-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-white/90 backdrop-blur-sm border border-[#C06014]/30 rounded-full text-[#1a1a1a] font-medium hover:bg-[#C06014] hover:text-white hover:border-[#C06014] transition-all duration-300 shadow-lg hover:shadow-xl group"
      aria-label="Go back to home page"
    >
      <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 group-hover:-translate-x-1" />
      <span className="text-sm md:text-base">{label}</span>
    </button>
  );
}

