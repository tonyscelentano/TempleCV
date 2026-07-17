import { useEffect, useRef } from "react";

export function PanelHeader({
  title,
  actionLabel,
  onAction
}: {
  title: string;
  actionLabel?: string;
  onAction?: () => void;
}) {
  return (
    <div className="panel-heading">
      <h2>{title}</h2>
      {actionLabel && onAction ? (
        <button type="button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}

export function EmptyState({
  actionLabel,
  detail,
  onAction,
  title
}: {
  actionLabel: string;
  detail: string;
  onAction: () => void;
  title: string;
}) {
  return (
    <div className="empty-state">
      <strong>{title}</strong>
      <p>{detail}</p>
      <button type="button" onClick={onAction}>
        {actionLabel}
      </button>
    </div>
  );
}

export function CardHeader({ 
  title, 
  onRemove,
  dragHandleProps 
}: { 
  title: string; 
  onRemove: () => void;
  dragHandleProps?: any;
}) {
  return (
    <div className="card-heading">
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflow: 'hidden' }}>
        {dragHandleProps && (
          <div {...dragHandleProps} style={{ cursor: 'grab', color: '#666', padding: '0 4px', userSelect: 'none' }}>
            ⋮⋮
          </div>
        )}
        <h3>{title}</h3>
      </div>
      <button type="button" onClick={onRemove}>
        Remove
      </button>
    </div>
  );
}

export function TextField({
  label,
  value,
  disabled,
  onChange
}: {
  label: string;
  value: string;
  disabled?: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <input disabled={disabled} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function TextAreaField({
  label,
  value,
  rows,
  onChange
}: {
  label: string;
  value: string;
  rows: number;
  onChange: (value: string) => void;
}) {
  return (
    <label>
      {label}
      <textarea rows={rows} value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function ListField({ label, value, onChange }: { label: string; value: string[]; onChange: (value: string[]) => void }) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Sync the raw textarea contents when the external value changes from outside
  // (e.g. a file is loaded, or a new card is added). We compare parsed values to
  // avoid overwriting a trailing newline the user just typed.
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    const currentParsed = el.value
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    if (JSON.stringify(currentParsed) !== JSON.stringify(value)) {
      el.value = value.join("\n");
    }
  }, [value]);

  return (
    <label>
      {label}
      {/* Uncontrolled textarea so React never resets the cursor position mid-edit.
          The useEffect above handles external value changes. */}
      <textarea
        ref={textareaRef}
        rows={Math.max(3, value.length + 1)}
        defaultValue={value.join("\n")}
        onChange={(event) =>
          onChange(
            event.target.value
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean)
          )
        }
      />
    </label>
  );
}
