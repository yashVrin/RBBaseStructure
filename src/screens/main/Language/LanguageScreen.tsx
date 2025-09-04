import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, I18nManager } from 'react-native';
import { useI18n, SupportedLang } from '../../../i18n/i18n';
import Colors from '@assets/Colors';
import Fonts from '@assets/Fonts';

const LanguageScreen: React.FC = () => {
  const { lang, t, setLanguage } = useI18n();

  const Item = ({ code, label }: { code: SupportedLang; label: string }) => (
    <TouchableOpacity style={[styles.row, lang === code && styles.active]} onPress={() => setLanguage(code)}>
      <Text style={styles.text}>{label}</Text>
      <Text style={styles.small}>{code.toUpperCase()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{t('language')}</Text>
      <Item code="en" label={t('english')} />
      <Item code="fr" label={t('french')} />
      <Item code="ar" label={t('arabic')} />
      {I18nManager.isRTL && (
        <Text style={styles.note}>RTL enabled</Text>
      )}
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.WHITE, padding: 16 },
  title: { fontFamily: Fonts.MEDIUM, fontSize: 18, marginBottom: 12, color: Colors.BLACK },
  row: {
    backgroundColor: Colors.BACKGROUND,
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  active: { borderWidth: 1, borderColor: Colors.PRIMARY },
  text: { fontFamily: Fonts.MEDIUM, color: Colors.BLACK, fontSize: 16 },
  small: { color: Colors.GRAY },
  note: { marginTop: 10, color: Colors.GRAY },
});