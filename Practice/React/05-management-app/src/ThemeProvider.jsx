import { useMemo } from "react";
import { usePortalConfigStore } from "./store/portalConfigStore";

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

function hexToRgb(hex) {
  if (!hex) return { r: 12, g: 45, b: 104 }; // fallback to #0C2D68
  let normalized = hex.replace("#", "");
  if (normalized.length === 3) {
    normalized = normalized
      .split("")
      .map((ch) => ch + ch)
      .join("");
  }
  const int = parseInt(normalized, 16);
  if (Number.isNaN(int)) {
    return { r: 12, g: 45, b: 104 };
  }
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255,
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (v) => clamp(Math.round(v), 0, 255).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function adjustBrightness(hex, percentage) {
  const { r, g, b } = hexToRgb(hex);
  const factor = (100 + percentage) / 100;
  return rgbToHex({
    r: r * factor,
    g: g * factor,
    b: b * factor,
  });
}

function generateColorVariants(primaryColor) {
  const primary = primaryColor || "#0C2D68";
  const primaryDark = adjustBrightness(primary, -20);
  const primaryLight = adjustBrightness(primary, 20);
  const primaryLighter = adjustBrightness(primary, 35);
  const primaryLightest = adjustBrightness(primary, 50);

  return {
    primary,
    primaryDark,
    primaryLight,
    primaryLighter,
    primaryLightest,
    sidebarPrimary: primaryDark,
  };
}

export function ThemeProvider({ children }) {
  const primaryColour =
    usePortalConfigStore((state) => state.portal.primaryColour) || "#0C2D68";

  const variants = useMemo(
    () => generateColorVariants(primaryColour),
    [primaryColour]
  );

  const style = {
    "--color-primary": variants.primary,
    "--color-primary-dark": variants.primaryDark,
    "--color-primary-light": variants.primaryLight,
    "--color-primary-lighter": variants.primaryLighter,
    "--color-primary-lightest": variants.primaryLightest,
    "--primary": variants.primary,
    "--sidebar-primary": variants.sidebarPrimary,
  };

  return <div style={style}>{children}</div>;
}

