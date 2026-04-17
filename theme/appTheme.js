import { MD3LightTheme, configureFonts } from 'react-native-paper';

export const palette = {
  primary: '#1E5D68',
  primarySoft: '#D8ECEC',
  secondary: '#C47A3C',
  background: '#F4F1EA',
  surface: '#FFFDFC',
  surfaceVariant: '#E8E2D7',
  outline: '#C9BFB2',
  text: '#1E2A2F',
  textMuted: '#5F6D72',
  success: '#2F7D4A',
  danger: '#B6493A',
  white: '#FFFFFF',
};

const fontConfig = {
  displayLarge: {
    fontFamily: 'System',
    fontSize: 34,
    fontWeight: '700',
    letterSpacing: 0.1,
    lineHeight: 40,
  },
  displayMedium: {
    fontFamily: 'System',
    fontSize: 30,
    fontWeight: '700',
    letterSpacing: 0.1,
    lineHeight: 36,
  },
  headlineMedium: {
    fontFamily: 'System',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 0.1,
    lineHeight: 34,
  },
  headlineSmall: {
    fontFamily: 'System',
    fontSize: 24,
    fontWeight: '700',
    lineHeight: 30,
  },
  titleLarge: {
    fontFamily: 'System',
    fontSize: 22,
    fontWeight: '700',
    lineHeight: 28,
  },
  titleMedium: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '600',
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: 'System',
    fontSize: 18,
    fontWeight: '400',
    lineHeight: 26,
  },
  bodyMedium: {
    fontFamily: 'System',
    fontSize: 16,
    fontWeight: '400',
    lineHeight: 24,
  },
  labelLarge: {
    fontFamily: 'System',
    fontSize: 17,
    fontWeight: '700',
    lineHeight: 22,
  },
};

export const appTheme = {
  ...MD3LightTheme,
  roundness: 7,
  colors: {
    ...MD3LightTheme.colors,
    primary: palette.primary,
    onPrimary: palette.white,
    primaryContainer: palette.primarySoft,
    onPrimaryContainer: palette.primary,
    secondary: palette.secondary,
    onSecondary: palette.white,
    secondaryContainer: '#F5E3D1',
    onSecondaryContainer: '#6A3D12',
    background: palette.background,
    onBackground: palette.text,
    surface: palette.surface,
    onSurface: palette.text,
    surfaceVariant: palette.surfaceVariant,
    onSurfaceVariant: palette.textMuted,
    outline: palette.outline,
    error: palette.danger,
  },
  fonts: configureFonts({ config: fontConfig }),
};

export const elevation = {
  card: {
    shadowColor: '#1C413E',
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
  },
};