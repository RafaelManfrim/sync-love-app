import { z } from 'zod'
import i18n from '../locales/i18n'

type zCurrencyOptions = {
  message?: string
  allowEmpty?: boolean
}

export const zFormattedNumber = (
  opts?: zCurrencyOptions,
): z.ZodType<number | null | string, z.ZodTypeDef, string | number | null> => {
  const {
    message = i18n.t('utils.zFormattedNumber.defaultMessage'),
    allowEmpty = false,
  } = opts ?? {}

  return z.preprocess(
    (val) => {
      if (typeof val !== 'string') return undefined

      // Remove tudo exceto dígitos e vírgula
      const cleaned = val.replace(/[^\d,]/g, '')

      // Substitui vírgula decimal por ponto para parseFloat
      const normalized = cleaned.replace(',', '.')

      const num = parseFloat(normalized)

      return isNaN(num) ? undefined : num
    },
    allowEmpty
      ? z.union([
          z.coerce.number({
            invalid_type_error: message,
            required_error: message,
          }),
          z.literal(''),
        ])
      : z.coerce
          .number({ invalid_type_error: message, required_error: message })
          .min(0.01, message),
  ) as z.ZodType<number | null | string, z.ZodTypeDef, string | number | null>
}
