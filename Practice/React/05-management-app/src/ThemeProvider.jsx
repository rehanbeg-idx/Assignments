import { usePortalConfigStore } from "./store/portalConfigStore";
import { lighten } from "./utils/themeColors";

export function ThemeProvider({ children }) {
  const primaryColour =
    usePortalConfigStore((state) => state.portal.primaryColour) || "#0C2D68";
  const secondaryColour = lighten(primaryColour, 45);

  const style = {
    "--color-primary": primaryColour,
    "--color-secondary": secondaryColour,
  };

  return <div style={style} className="min-h-screen">{children}</div>;
}

