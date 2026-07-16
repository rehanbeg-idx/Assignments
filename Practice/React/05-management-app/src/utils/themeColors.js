function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex) {
  if (!hex) return { r: 12, g: 45, b: 104 };
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const int = parseInt(normalized, 16);
  if (Number.isNaN(int)) return { r: 12, g: 45, b: 104 };
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) =>
    clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function lighten(hex, percentage) {
  const { r, g, b } = hexToRgb(hex);
  const factor = (100 + percentage) / 100;
  return rgbToHex({
    r: r * factor,
    g: g * factor,
    b: b * factor,
  });
}
