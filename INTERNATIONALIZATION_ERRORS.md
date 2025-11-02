# Sistema de Internacionalização de Erros da API

Este documento explica como funciona o sistema de internacionalização de mensagens de erro entre o backend e o frontend.

## Backend (API)

### Estrutura de Erros

Todos os erros customizados do backend agora estendem a classe `AppError` que inclui um código de erro único:

```typescript
import { AppError } from './app-error'

export class InvalidCredentialsError extends AppError {
  constructor() {
    super('As credenciais fornecidas são inválidas.', 'INVALID_CREDENTIALS')
  }
}
```

### Error Handler

O error handler global do Fastify foi atualizado para retornar o código do erro junto com a mensagem:

```typescript
app.setErrorHandler((error, _, reply) => {
  if (error instanceof AppError) {
    return reply.status(400).send({
      message: error.message,
      code: error.code, // ← código do erro para internacionalização
    })
  }

  return reply.status(500).send({
    message: 'Internal server error.',
    code: 'INTERNAL_SERVER_ERROR',
  })
})
```

### Códigos de Erro Disponíveis

| Código | Descrição |
|--------|-----------|
| `INVALID_CREDENTIALS` | Credenciais inválidas (login) |
| `RESOURCE_NOT_FOUND` | Recurso não encontrado |
| `USER_ALREADY_EXISTS` | Email já cadastrado |
| `UNAUTHORIZED` | Sem permissão para a ação |
| `USER_NOT_FOUND` | Usuário não encontrado |
| `INVITATION_NOT_FOUND` | Convite não encontrado |
| `INVITATION_ALREADY_EXISTS` | Convite já enviado |
| `INVITATION_ALREADY_ACCEPTED` | Convite já aceito |
| `INVITATION_ALREADY_REJECTED` | Convite já rejeitado |
| `INVITER_NOT_FOUND` | Remetente do convite não encontrado |
| `SHOPPING_LIST_ALREADY_CLOSED` | Lista de compras já fechada |
| `TASK_ALREADY_COMPLETED` | Tarefa já concluída |
| `TASK_EXCEPTION_ALREADY_EXISTS` | Exceção de tarefa já existe |
| `CALENDAR_EXCEPTION_ALREADY_EXISTS` | Exceção de evento já existe |
| `REFRESH_TOKEN_NOT_FOUND` | Token de refresh não encontrado |
| `REFRESH_TOKEN_EXPIRED` | Token de refresh expirado |
| `INTERNAL_SERVER_ERROR` | Erro interno do servidor |

## Frontend (App)

### Traduções

As mensagens de erro estão mapeadas nos arquivos de locale (`pt-BR.json`, `en-US.json`, `es-ES.json`) na seção `errors`:

```json
{
  "errors": {
    "INVALID_CREDENTIALS": "As credenciais fornecidas são inválidas.",
    "USER_ALREADY_EXISTS": "Esse e-mail já está em uso.",
    // ... outros erros
  }
}
```

### Utilitário de Tradução

Use a função `translateApiError` para traduzir automaticamente os erros da API:

```typescript
import { translateApiError } from '@utils/translateApiError'

try {
  await api.post('/endpoint', data)
} catch (error) {
  // Erro da API com formato: { code: 'ERROR_CODE', message: '...' }
  const errorMessage = translateApiError(error.response?.data)
  
  toast.show({
    render: ({ id }) => (
      <ToastMessage
        id={id}
        action="error"
        title={errorMessage} // ← mensagem traduzida automaticamente
        onClose={() => toast.close(id)}
      />
    ),
  })
}
```

### Como Funciona

1. **Backend retorna erro com código:**
   ```json
   {
     "message": "As credenciais fornecidas são inválidas.",
     "code": "INVALID_CREDENTIALS"
   }
   ```

2. **Frontend usa `translateApiError`:**
   ```typescript
   const errorMessage = translateApiError(error.response?.data)
   // Retorna: "As credenciais fornecidas são inválidas." (pt-BR)
   // ou: "The provided credentials are invalid." (en-US)
   // ou: "Las credenciales proporcionadas son inválidas." (es-ES)
   ```

3. **Fallback inteligente:**
   - Se houver `code`, busca a tradução
   - Se não houver tradução para o code, usa o `message` original
   - Se não houver nem code nem message, usa "UNKNOWN_ERROR"

### Exemplo de Uso Completo

```typescript
import { translateApiError } from '@utils/translateApiError'
import { useToast } from '@gluestack-ui/themed'
import { ToastMessage } from '@components/ToastMessage'

async function handleLogin({ email, password }: FormData) {
  try {
    setIsLoading(true)
    await api.post('/users/login', { email, password })
  } catch (error: any) {
    const errorMessage = translateApiError(error.response?.data)

    toast.show({
      placement: 'top',
      render: ({ id }) => (
        <ToastMessage
          id={id}
          action="error"
          title={errorMessage}
          onClose={() => toast.close(id)}
        />
      ),
    })
  } finally {
    setIsLoading(false)
  }
}
```

### Adicionando Novos Erros

1. **No Backend:**
   - Crie a classe de erro estendendo `AppError`
   - Defina um código único (SNAKE_CASE)
   - Adicione a mensagem padrão em português

2. **No Frontend:**
   - Adicione o código e tradução em `pt-BR.json`
   - Adicione a tradução em inglês em `en-US.json`
   - Adicione a tradução em espanhol em `es-ES.json`

3. **Use `translateApiError` no tratamento de erros**

## Benefícios

✅ Erros sempre traduzidos no idioma do usuário
✅ Manutenção centralizada das mensagens
✅ Fallback inteligente (usa message original se não houver tradução)
✅ Type-safe (TypeScript)
✅ Fácil de adicionar novos erros
