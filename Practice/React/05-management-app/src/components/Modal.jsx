import { forwardRef, useImperativeHandle, useRef } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";
import { usePortalConfigStore } from "../store/portalConfigStore";
import { lighten } from "../utils/themeColors";

const Modal = forwardRef(function Modal({ children, buttonCaption }, ref) {
  const dialog = useRef();
  const primaryColour =
    usePortalConfigStore((state) => state.portal.primaryColour) || "#0C2D68";
  const secondaryColour = lighten(primaryColour, 45);

  useImperativeHandle(ref, () => {
    return {
      open() {
        dialog.current.showModal();
      },
    };
  });

  const themeStyle = {
    "--color-primary": primaryColour,
    "--color-secondary": secondaryColour,
  };

  return createPortal(
    <div style={themeStyle}>
      <dialog ref={dialog} className="backdrop:bg-stone-900/90 p-4 rounded-md shadow-md">
        {children}
        <form method="dialog" className="mt-4 text-right">
          <Button>{buttonCaption}</Button>
        </form>
      </dialog>
    </div>,
    document.getElementById("modal-root")
  );
});

export default Modal;
