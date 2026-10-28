export const color = {
  yellow: "#F5CB58",
  red: "#E95322",
  // Brand red is 3.5:1 on surface; small text uses this deeper step (≥4.5:1).
  redText: "#C23D16",
  // Text that sits on the yellow band.
  redDeep: "#9A2E0E",
  cream: "#F3E9B5",
  blush: "#FFDECF",
  surface: "#F8F8F8",
  white: "#FFFFFF",
  ink: "#391713",
  inkSoft: "#6B4A45",
  line: "#FFD8C7",
  track: "#E3DCD6",
} as const;

export const font = {
  regular: "LeagueSpartan_400Regular",
  medium: "LeagueSpartan_500Medium",
  semibold: "LeagueSpartan_600SemiBold",
  bold: "LeagueSpartan_700Bold",
} as const;

export const radius = { sm: 8, md: 14, lg: 20, sheet: 30, pill: 999 } as const;

export const ease = { outQuint: [0.22, 1, 0.36, 1] } as const;
