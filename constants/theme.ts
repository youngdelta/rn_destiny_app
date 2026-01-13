/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { Platform } from 'react-native';

const tintColorLight = '#6B4EE6';
const tintColorDark = '#A78BFA';

export const Colors = {
  light: {
    text: '#1F1F2E',
    background: '#FEFEFE',
    tint: tintColorLight,
    icon: '#6B4EE6',
    tabIconDefault: '#9CA3AF',
    tabIconSelected: tintColorLight,
    card: '#FFFFFF',
    cardBorder: '#E5E7EB',
    accent: '#F59E0B',
    success: '#10B981',
    warning: '#F59E0B',
    danger: '#EF4444',
    muted: '#6B7280',
    purple: '#6B4EE6',
    gold: '#D4AF37',
  },
  dark: {
    text: '#F9FAFB',
    background: '#0F0F1A',
    tint: tintColorDark,
    icon: '#A78BFA',
    tabIconDefault: '#6B7280',
    tabIconSelected: tintColorDark,
    card: '#1F1F2E',
    cardBorder: '#374151',
    accent: '#FBBF24',
    success: '#34D399',
    warning: '#FBBF24',
    danger: '#F87171',
    muted: '#9CA3AF',
    purple: '#A78BFA',
    gold: '#FFD700',
  },
};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded: "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
