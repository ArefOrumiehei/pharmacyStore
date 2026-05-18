export const formatNumberToFa = (n: number | string) => {
  const str = String(n);

  // Normalize Persian/Arabic digits to English
  const normalized = str
    .replace(/[۰-۹]/g, d => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(d)))
    .replace(/[٠-٩]/g, d => String('٠١٢٣٤٥٦٧٨٩'.indexOf(d)));

  // Split by comma, but only when NOT a thousands separator
  // A thousands separator comma has exactly 3 digits after it
  const parts = normalized.split(/,(?!\d{3}(?:,|$))/);

  return parts
    .map(part => {
      // Remove existing thousands commas before parsing
      const clean = part.replace(/,/g, '');
      return new Intl.NumberFormat('fa-IR').format(Number(clean.trim()));
    })
    .join(',');
};

export const toPersianNums = (str: string | number): string =>
  String(str).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);