export function formatCurrencyMask(
  value: string,
  locale: string = 'en-US',
  currency: string = 'USD',
) {
  const numericValue = value.replace(/\D/g, '')
  const float = parseFloat(numericValue) / 100
  if (isNaN(float)) return ''
  return float.toLocaleString(locale, { style: 'currency', currency })
}
