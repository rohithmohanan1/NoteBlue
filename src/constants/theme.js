import { configureFonts, DefaultTheme } from 'react-native-paper';
import colors from './colors';

const fontConfig = {
  default: {
    regular: {
      fontFamily: 'sans-serif',
      fontWeight: 'normal',
    },
    medium: {
      fontFamily: 'sans-serif-medium',
      fontWeight: 'normal',
    },
    light: {
      fontFamily: 'sans-serif-light',
      fontWeight: 'normal',
    },
    thin: {
      fontFamily: 'sans-serif-thin',
      fontWeight: 'normal',
    },
  },
};

const theme = {
  ...DefaultTheme,
  dark: true,
  mode: 'adaptive',
  roundness: 8,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary,
    accent: colors.accent,
    background: colors.background,
    surface: colors.surface,
    error: colors.error,
    text: colors.textPrimary,
    onSurface: colors.onSurface,
    disabled: colors.textSecondary,
    placeholder: colors.textSecondary,
    backdrop: '#121212E6',
    notification: colors.accent,
  },
  fonts: configureFonts(fontConfig),
};

export default theme;
