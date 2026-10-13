import { useEffect, useRef, useState, type ReactNode } from "react";
import { X } from "lucide-react";
import "../../styles/common/ImagePreview.css";

type ImagePreviewProps = {
  src: string;
  alt: string;
  label: string;
  className?: string;
  children: ReactNode;
};

export default function ImagePreview({ src, alt, label, className, children }: ImagePreviewProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    if (isOpen && !dialogRef.current?.open) {
      dialogRef.current?.showModal();
    }
  }, [isOpen]);

  function closePreview() {
    dialogRef.current?.close();
    setIsOpen(false);
  }

  return (
    <>
      <button
        className={`image-preview-trigger${className ? ` ${className}` : ""}`}
        type="button"
        aria-label={label}
        title={label}
        onClick={() => setIsOpen(true)}>
        {children}
      </button>
      <dialog
        ref={dialogRef}
        className="image-preview-dialog"
        aria-label={alt}
        onClick={(event) => {
          if (event.target === dialogRef.current) closePreview();
        }}
        onClose={() => setIsOpen(false)}>
        <button className="image-preview-close" type="button" aria-label="Close photo preview" onClick={closePreview} autoFocus>
          <X size={20} aria-hidden="true" />
        </button>
        <img src={src} alt={alt} />
      </dialog>
    </>
  );
}
