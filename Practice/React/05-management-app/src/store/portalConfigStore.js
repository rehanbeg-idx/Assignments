import { create } from "zustand";
import { persist } from "zustand/middleware";

export const usePortalConfigStore = create(
  persist(
    (set) => ({
      portal: {
        primaryColour: "#0C2D68",
      },
      setPrimaryColour: (primaryColour) =>
        set((state) => ({
          portal: {
            ...state.portal,
            primaryColour,
          },
        })),
    }),
    {
      name: "portal-config",
      partialize: (state) => ({
        portal: {
          primaryColour: state.portal.primaryColour,
        },
      }),
    }
  )
);

