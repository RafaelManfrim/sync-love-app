export function formatCurrencyMask(value: string) {
  const numericValue = value.replace(/\D/g, '')
  const float = parseFloat(numericValue) / 100
  if (isNaN(float)) return ''
  return float.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}
