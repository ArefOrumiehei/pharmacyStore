export const formatNumberToFa = (n: number | string) => new Intl.NumberFormat("fa-IR").format(Number(n));

export const toPersianNums = (str: string | number): string =>
  String(str).replace(/[0-9]/g, (d) => "۰۱۲۳۴۵۶۷۸۹"[+d]);