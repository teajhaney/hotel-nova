'use client';

import { useState, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import type { FieldError } from 'react-hook-form';

interface PasswordInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  id: string;
  label: string;
  error?: FieldError;
  labelSuffix?: React.ReactNode;
}

/**
 * Reusable password input with show/hide toggle.
 * Uses Lucide Eye / EyeOff icons.
 */
export function PasswordInput({
  id,
  label,
  error,
  labelSuffix,
  ...inputProps
}: PasswordInputProps) {
  const [show, setShow] = useState(false);
  const errorId = `${id}-error`;

  return (
    <div className="form-field">
      <div className="field-label-row">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {labelSuffix}
      </div>

      <div className="relative">
        <input
          id={id}
          type={show ? 'text' : 'password'}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          className={`field-input pr-12 ${error ? 'field-input-error' : 'field-input-valid'}`}
          {...inputProps}
        />

        <button
          type="button"
          aria-label={show ? 'Hide password' : 'Show password'}
          onClick={() => setShow(v => !v)}
          className="password-toggle-btn"
        >
          {show ? (
            <EyeOff size={18} aria-hidden="true" />
          ) : (
            <Eye size={18} aria-hidden="true" />
          )}
        </button>
      </div>

      {error && (
        <p id={errorId} role="alert" className="field-error-text">
          {error.message}
        </p>
      )}
    </div>
  );
}
