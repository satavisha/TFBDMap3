"use client";

import { useLanguage } from './language-context';

export function LanguageSwitcher() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="fixed top-4 right-4 z-50 bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-lg hover:bg-gray-50 transition-colors"
      aria-label="Toggle language"
    >
      {language === 'en' ? '🇷🇺 RU' : '🇺🇸 EN'}
    </button>
  );
}
