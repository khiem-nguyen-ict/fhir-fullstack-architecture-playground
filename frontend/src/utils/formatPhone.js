export function formatPhone(raw) {
  if (!raw) return null;
  const digits = raw.replace(/[^+\d]/g, "");
  if (!digits) return null;

  const isInternational = digits.startsWith("+");
  const numbers = isInternational
    ? digits.slice(1).replace(/^(\d{1,3})(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3 $4")
    : digits
        .replace(/^(\d{3})(\d{4})$/, "$1 $2")
        .replace(/^(\d{3})(\d{3})(\d{4})$/, "$1 $2 $3");

  return isInternational ? `+${numbers}` : numbers;
}
