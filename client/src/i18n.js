import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translationEN from './locales/en/translation.json'
import translationGE from './locales/ge/translation.json'
import translationRU from './locales/ru/translation.json'
import Backend from 'i18next-http-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


const resources = {
  en : {
    translation: translationEN
  },
  ge: {
    translation: translationGE
  },
  ru: {
    translation: translationRU
  }
}
i18n 
  .use(Backend) 
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'ge', 
    lng: ['ge','en','ru'],
    debug: true, 
    interpolation: {
      escapeValue: false,  
    },
    react: {
      useSuspense: false
    }
  });


export default i18n;