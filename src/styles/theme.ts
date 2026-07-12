// Central design tokens shared between CSS and the antd ConfigProvider.
// Keep this in sync with src/styles/global.css :root values.
export const colors = {
  bg: "#0d1117",
  surface: "#161b22",
  surface2: "#1c232d",
  surface3: "#222b36",
  border: "#2a3340",
  text: "#e6edf3",
  muted: "#8b949e",
  accent: "#f0b429",
  accentDim: "#7a5c15",
  mint: "#3fb68c",
  mintDim: "#1b4a3c",
  coral: "#f0654a",
  coralDim: "#5a2a20",
  sky: "#58a6ff",
  rose: "#f0836b",
};

export const antdTheme = {
  token: {
    colorPrimary: colors.accent,
    colorBgBase: colors.bg,
    colorBgContainer: colors.surface,
    colorBgElevated: colors.surface2,
    colorBorder: colors.border,
    colorText: colors.text,
    colorTextSecondary: colors.muted,
    colorLink: colors.sky,
    colorSuccess: colors.mint,
    colorError: colors.coral,
    colorWarning: colors.accent,
    borderRadius: 10,
    fontFamily: "'Inter', 'Hind Siliguri', sans-serif",
    fontFamilyCode: "'JetBrains Mono', monospace",
  },
  components: {
    Layout: {
      bodyBg: colors.bg,
      headerBg: colors.surface,
      siderBg: colors.surface,
    },
    Menu: {
      itemBg: "transparent",
      darkItemBg: "transparent",
    },
    Card: {
      colorBgContainer: colors.surface,
    },
    Table: {
      colorBgContainer: colors.surface,
      headerBg: colors.surface2,
    },
    Modal: {
      contentBg: colors.surface,
      headerBg: colors.surface,
    },
    Input: {
      colorBgContainer: colors.surface2,
    },
  },
};
