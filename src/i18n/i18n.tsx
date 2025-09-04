import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { I18nManager, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import RNRestart from 'react-native-restart';

// Keys for AsyncStorage
const STORAGE_KEY = '@app_language';

export type SupportedLang = 'en' | 'fr' | 'ar';

// Basic dictionaries. Add keys as needed.
const dictionaries: Record<SupportedLang, Record<string, string>> = {
  en: {
    profile: 'Profile',
    loggerFile: 'Logger File',
    login: 'Login',
    logout: 'Log Out',
    changeLanguage: 'Change Language',
    language: 'Language',
    english: 'English',
    french: 'French',
    arabic: 'Arabic',
    applyAndReload: 'Apply and Reload',
    rtlNotice: 'Arabic needs RTL layout. App will reload to apply changes.',
    cancel: 'Cancel',
    home: 'Home',
    search: 'Search',
    settings: 'Settings',
    cameraPermission: 'Camera Permission',
    locationPermission: 'Location Permission',
    storagePermission: 'Storage Permission',
    unknownResult: 'Unknown result',
  },
  fr: {
    profile: 'Profil',
    loggerFile: 'Fichier Journal',
    login: 'Se connecter',
    logout: 'Se déconnecter',
    changeLanguage: 'Changer de langue',
    language: 'Langue',
    english: 'Anglais',
    french: 'Français',
    arabic: 'Arabe',
    applyAndReload: 'Appliquer et recharger',
    rtlNotice: "L'arabe nécessite la disposition RTL. L'application va redémarrer pour appliquer les changements.",
    cancel: 'Annuler',
    home: 'Accueil',
    search: 'Recherche',
    settings: 'Paramètres',
    cameraPermission: 'Permission de la caméra',
    locationPermission: 'Permission de localisation',
    storagePermission: 'Permission de stockage',
    unknownResult: 'Résultat inconnu',
  },
  ar: {
    profile: 'الملف الشخصي',
    loggerFile: 'ملف السجل',
    login: 'تسجيل الدخول',
    logout: 'تسجيل الخروج',
    changeLanguage: 'تغيير اللغة',
    language: 'اللغة',
    english: 'الإنجليزية',
    french: 'الفرنسية',
    arabic: 'العربية',
    applyAndReload: 'تطبيق وإعادة التشغيل',
    rtlNotice: 'اللغة العربية تحتاج تخطيط من اليمين لليسار. سيتم إعادة تشغيل التطبيق لتطبيق التغييرات.',
    cancel: 'إلغاء',
    home: 'الرئيسية',
    search: 'بحث',
    settings: 'الإعدادات',
    cameraPermission: 'إذن الكاميرا',
    locationPermission: 'إذن الموقع',
    storagePermission: 'إذن التخزين',
    unknownResult: 'نتيجة غير معروفة',
  },
};

// Context
interface I18nContextValue {
  lang: SupportedLang;
  t: (key: string) => string;
  setLanguage: (lang: SupportedLang) => Promise<void>;
}

const I18nContext = createContext<I18nContextValue | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<SupportedLang>('en');

  useEffect(() => {
    (async () => {
      const saved = await AsyncStorage.getItem(STORAGE_KEY);
      if (saved === 'en' || saved === 'fr' || saved === 'ar') {
        setLang(saved);
      }
    })();
  }, []);

  const t = useCallback(
    (key: string) => dictionaries[lang][key] ?? key,
    [lang]
  );

  const setLanguage = useCallback(async (nextLang: SupportedLang) => {
    // If selecting the current language, do nothing (no prompt)
    if (nextLang === lang) return;

    // Show confirmation in CURRENT language
    const tCurrent = (key: string) => dictionaries[lang][key] ?? key;
    const willBeRTL = nextLang === 'ar';

    Alert.alert(
      tCurrent('language'),
      willBeRTL ? tCurrent('rtlNotice') : tCurrent('applyAndReload'),
      [
        { text: tCurrent('cancel'), style: 'cancel' },
        {
          text: tCurrent('applyAndReload'),
          onPress: async () => {
            // Persist selection
            await AsyncStorage.setItem(STORAGE_KEY, nextLang);

            // Apply RTL if needed
            const shouldBeRTL = nextLang === 'ar';
            if (I18nManager.isRTL !== shouldBeRTL) {
              I18nManager.allowRTL(shouldBeRTL);
              I18nManager.forceRTL(shouldBeRTL);
            }

            // Restart app to apply language and layout
            RNRestart.Restart();
          },
        },
      ]
    );
  }, [lang]);

  const value = useMemo(() => ({ lang, t, setLanguage }), [lang, t, setLanguage]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
};

export const useI18n = (): I18nContextValue => {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within I18nProvider');
  return ctx;
};