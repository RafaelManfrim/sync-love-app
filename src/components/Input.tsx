import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GluestackInput,
  InputField,
} from '@gluestack-ui/themed'
import { ComponentProps } from 'react'

type InputProps = ComponentProps<typeof InputField> & {
  errorMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export function Input({
  isReadOnly = false,
  errorMessage = null,
  isInvalid = false,
  ...rest
}: InputProps) {
  const invalid = !!errorMessage || isInvalid

  return (
    <FormControl isInvalid={invalid} w="$full">
      <GluestackInput
        h="$12"
        borderWidth="$1"
        borderColor="$trueGray200"
        borderRadius="$md"
        $focus={{
          borderColor: invalid ? '$error500' : '$red500',
        }}
        $invalid={{
          borderColor: '$error500',
        }}
        isReadOnly={isReadOnly}
        opacity={isReadOnly ? 0.5 : 1}
      >
        <InputField
          bg="$trueGray100"
          px="$4"
          color="$trueGray700"
          fontFamily="$body"
          placeholderTextColor="$trueGray400"
          {...rest}
        />
      </GluestackInput>
      <FormControlError>
        <FormControlErrorText color="$error500">
          {errorMessage}
        </FormControlErrorText>
      </FormControlError>
    </FormControl>
  )
}
