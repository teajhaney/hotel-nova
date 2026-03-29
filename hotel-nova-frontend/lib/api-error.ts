import { isAxiosError } from 'axios';

// The backend HttpExceptionFilter wraps every error in:
//   { error: { code: "CONFLICT", message: "Email already in use." } }
//
// This helper extracts that nested message so we don't repeat the
// extraction logic (and risk using the wrong path) in every catch block.
interface BackendErrorShape {
  error?: { code?: string; message?: string };
  message?: string; // fallback for raw NestJS errors
}

export function extractApiError(
  err: unknown,
  fallback = 'Something went wrong. Please try again.',
): string {
  if (!isAxiosError(err)) return fallback;

  const data = err.response?.data as BackendErrorShape | undefined;
  if (!data) return fallback;

  // Prefer the structured error format from our HttpExceptionFilter
  if (typeof data.error?.message === 'string') return data.error.message;

  // Fallback: raw NestJS errors (e.g. validation pipe) use top-level `message`
  if (typeof data.message === 'string') return data.message;

  return fallback;
}
