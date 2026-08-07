// PiggyMath Corporate Brand Identity & Design System Tokens

export const BRAND_COLORS = {
  navy: {
    id: 'navy',
    name: 'Corporate Navy (Dark Mode)',
    bg: '#0F172A',
    cardBg: '#1E293B',
    textPrimary: '#FFFFFF',
    textSecondary: '#94A3B8',
    accent: '#FF5271',
    accentText: '#FFFFFF',
    badgeBg: 'rgba(255, 82, 113, 0.15)',
    badgeBorder: '#FF5271',
    badgeText: '#FF758F',
    border: 'rgba(255, 255, 255, 0.1)',
    ctaBg: '#FF5271',
    ctaText: '#FFFFFF'
  },
  pink: {
    id: 'pink',
    name: 'Piggy Pink (Signature)',
    bg: '#FFF0F3',
    cardBg: '#FFFFFF',
    textPrimary: '#1E293B',
    textSecondary: '#64748B',
    accent: '#FF4757',
    accentText: '#FFFFFF',
    badgeBg: '#FFE4E6',
    badgeBorder: '#FF4757',
    badgeText: '#E11D48',
    border: '#FECDD3',
    ctaBg: '#0F172A',
    ctaText: '#FFFFFF'
  },
  light: {
    id: 'light',
    name: 'Studio White (Clean Light)',
    bg: '#F8FAFC',
    cardBg: '#FFFFFF',
    textPrimary: '#0F172A',
    textSecondary: '#475569',
    accent: '#2563EB',
    accentText: '#FFFFFF',
    badgeBg: '#EFF6FF',
    badgeBorder: '#3B82F6',
    badgeText: '#1D4ED8',
    border: '#E2E8F0',
    ctaBg: '#FF5271',
    ctaText: '#FFFFFF'
  },
  mint: {
    id: 'mint',
    name: 'Wealth Mint (Green Accent)',
    bg: '#ECFDF5',
    cardBg: '#FFFFFF',
    textPrimary: '#064E3B',
    textSecondary: '#047857',
    accent: '#10B981',
    accentText: '#FFFFFF',
    badgeBg: '#D1FAE5',
    badgeBorder: '#10B981',
    badgeText: '#047857',
    border: '#A7F3D0',
    ctaBg: '#064E3B',
    ctaText: '#FFFFFF'
  }
};

export const ASPECT_RATIOS = {
  'ig-square': {
    id: 'ig-square',
    name: 'Instagram Post (1:1)',
    platform: 'Instagram',
    width: 1080,
    height: 1080,
    aspectRatio: '1/1',
    icon: 'Square'
  },
  'ig-portrait': {
    id: 'ig-portrait',
    name: 'Instagram Portrait (4:5)',
    platform: 'Instagram',
    width: 1080,
    height: 1350,
    aspectRatio: '4/5',
    icon: 'RectangleVertical'
  },
  'ig-story': {
    id: 'ig-story',
    name: 'Instagram Story (9:16)',
    platform: 'Instagram',
    width: 1080,
    height: 1920,
    aspectRatio: '9/16',
    icon: 'Smartphone'
  },
  'pinterest-std': {
    id: 'pinterest-std',
    name: 'Pinterest Standard (2:3)',
    platform: 'Pinterest',
    width: 1000,
    height: 1500,
    aspectRatio: '2/3',
    icon: 'Pin'
  },
  'pinterest-tall': {
    id: 'pinterest-tall',
    name: 'Pinterest Tall Pin (9:16)',
    platform: 'Pinterest',
    width: 1000,
    height: 1778,
    aspectRatio: '9/16',
    icon: 'PinVertical'
  }
};

export const PIGGY_LOGO_SVG = `
<svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="36" height="36" rx="10" fill="#FF5271"/>
  <path d="M11 15C11 11.6863 13.6863 9 17 9H19C22.3137 9 25 11.6863 25 15V19C25 22.3137 22.3137 25 19 25H17C13.6863 25 11 22.3137 11 19V15Z" fill="white"/>
  <circle cx="15" cy="14" r="1.5" fill="#FF5271"/>
  <circle cx="21" cy="14" r="1.5" fill="#FF5271"/>
  <rect x="15" y="18" width="6" height="3" rx="1.5" fill="#FF5271"/>
  <path d="M9 13L11 10M27 13L25 10" stroke="white" stroke-width="2" stroke-linecap="round"/>
</svg>
`;
