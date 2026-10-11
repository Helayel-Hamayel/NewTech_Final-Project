import { useEffect, useMemo, useRef, useState } from "react";
import type { ChangeEvent } from "react";
import { Camera, ImagePlus, X } from "lucide-react";

const MAX_PHOTO_SIZE = 5 * 1024 * 1024;

type AppealPhotoPickerProps = {
  file: File | null;
  disabled?: boolean;
  onChange: (file: File | null) => void;
};

export default function AppealPhotoPicker({ file, disabled = false, onChange }: AppealPhotoPickerProps) {
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const browseInputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState("");
  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : ""), [file]);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  function handleSelect(event: ChangeEvent<HTMLInputElement>) {
    const selected = event.target.files?.[0] ?? null;

    event.target.value = "";

    if (!selected) return;

    if (selected.size > MAX_PHOTO_SIZE) {
      setError("The photo must be 5 MB or smaller.");
      return;
    }

    setError("");
    onChange(selected);
  }

  return (
    <section className="appeal-photo" aria-label="Supporting photo">
      <header className="appeal-photo-heading">
        <span>Supporting photo</span>
        <small>Optional · JPEG, PNG or WebP · up to 5 MB</small>
      </header>

      {file ? (
        <section className="appeal-photo-preview">
          <img src={previewUrl} alt="Selected supporting photo preview" />
          <section>
            <strong>{file.name}</strong>
            <small>{(file.size / 1024 / 1024).toFixed(2)} MB</small>
          </section>
          <button
            className="appeal-photo-remove"
            type="button"
            aria-label="Remove photo"
            disabled={disabled}
            onClick={() => onChange(null)}>
            <X size={16} aria-hidden="true" />
          </button>
        </section>
      ) : (
        <section className="appeal-photo-actions">
          <button className="appeal-photo-btn" type="button" disabled={disabled} onClick={() => cameraInputRef.current?.click()}>
            <Camera size={20} aria-hidden="true" />
            Take photo
          </button>
          <button className="appeal-photo-btn" type="button" disabled={disabled} onClick={() => browseInputRef.current?.click()}>
            <ImagePlus size={20} aria-hidden="true" />
            Choose from device
          </button>
        </section>
      )}

      <input
        ref={cameraInputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        capture="environment"
        tabIndex={-1}
        onChange={handleSelect}
      />
      <input
        ref={browseInputRef}
        className="sr-only"
        type="file"
        accept="image/jpeg,image/png,image/webp"
        tabIndex={-1}
        onChange={handleSelect}
      />

      {error ? (
        <p className="appeal-photo-error" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}
