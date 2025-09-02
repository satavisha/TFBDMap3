"use client";

import { createContext, useContext, useState, ReactNode } from 'react';

type Language = 'en' | 'ru';

interface LanguageContextType {
  language: Language;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

// Translation object
const translations = {
  en: {
    'upcoming_events': 'Upcoming Events',
    'past_events': 'Past Events',
    'event_name': 'Event Name',
    'type': 'Type',
    'location': 'Location',
    'start_date': 'Start Date',
    'end_date': 'End Date',
    'teachers': 'Teachers',
    'website': 'Website',
    'visit': 'Visit',
    'no_events': 'No events match your filters.',
    'search_placeholder': 'Search all fields...',
    'clear': 'Clear',
    'filters': 'Filters',
    'clear_all': 'Clear All',
    'hide_past_events': 'Hide Past Events ⬆️',
    'show_past_events': 'Show Past Events ⬇️'
  },
  ru: {
    'upcoming_events': 'Предстоящие События',
    'past_events': 'Прошедшие События',
    'event_name': 'Название События',
    'type': 'Тип',
    'location': 'Местоположение',
    'start_date': 'Дата Начала',
    'end_date': 'Дата Окончания',
    'teachers': 'Преподаватели',
    'website': 'Веб-сайт',
    'visit': 'Посетить',
    'no_events': 'Нет событий, соответствующих вашим фильтрам.',
    'search_placeholder': 'Поиск по всем полям...',
    'clear': 'Очистить',
    'filters': 'Фильтры',
    'clear_all': 'Очистить Все',
    'hide_past_events': 'Скрыть Прошедшие События ⬆️',
    'show_past_events': 'Показать Прошедшие События ⬇️'
  }
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('en');

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'ru' : 'en');
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
