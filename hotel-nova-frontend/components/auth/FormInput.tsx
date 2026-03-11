'use client';

import { type InputHTMLAttributes } from 'react';
import type { FieldError } from 'react-hook-form';

interface FormInputProps extends InputHTMLAttributes<HTMLInputElement> {
  id: string;
  label: string;
  error?: FieldError;
  labelSuffix?: React.ReactNode;
}

/**
 * Reusable labelled text / email input field.
 * Forwards all native <input> attributes via spread.
 */
export function FormInput({
  id,
  label,
  error,
  labelSuffix,
  className,
  ...inputProps
}: FormInputProps) {
  const errorId = `${id}-error`;

  return (
    <div className="form-field">
      <div className="field-label-row">
        <label htmlFor={id} className="field-label">
          {label}
        </label>
        {labelSuffix}
      </div>

      <input
        id={id}
        aria-describedby={error ? errorId : undefined}
        aria-invalid={!!error}
        className={`field-input ${error ? 'field-input-error' : 'field-input-valid'} ${className ?? ''}`}
        {...inputProps}
      />

      {error && (
        <p id={errorId} role="alert" className="field-error-text">
          {error.message}
        </p>
      )}
    </div>
  );
}
