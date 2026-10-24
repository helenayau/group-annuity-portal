// TanStack Form errors from a Zod schema are issue objects; Carbon inputs
// want a single string for invalidText.
export function fieldError(errors: unknown[]) {
  return errors
    .map((error) =>
      typeof error === 'string' ? error : (error as { message?: string } | undefined)?.message
    )
    .filter(Boolean)
    .join(', ');
}
