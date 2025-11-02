import i18n from '../locales/i18n'

interface ApiError {
  code?: string
  message?: string
}

/**
 * Traduz um erro da API usando o código de erro
 * @param error - Objeto de erro da API contendo code e message
 * @returns Mensagem de erro traduzida
 */
export function translateApiError(error: ApiError): string {
  // Se temos um código de erro, tentamos traduzir
  if (error.code) {
    const translationKey = `errors.${error.code}`
    const translation = i18n.t(translationKey)

    // Se a tradução existe (não retornou a própria key), retornamos ela
    if (translation !== translationKey) {
      return translation
    }
  }

  // Se não temos código ou não há tradução, usamos a mensagem original
  if (error.message) {
    return error.message
  }

  // Fallback para erro desconhecido
  return i18n.t('errors.UNKNOWN_ERROR')
}
