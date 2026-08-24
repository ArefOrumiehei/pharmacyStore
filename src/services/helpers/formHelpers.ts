export const toFormData = (entries: object): FormData => {
  const form = new FormData();
  for (const [key, value] of Object.entries(entries)) {
    if (value !== undefined && value !== null) {
      form.append(key, value as string | File);
    }
  }
  return form;
};