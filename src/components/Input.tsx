import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GluestackInput,
  InputField,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { ComponentProps, forwardRef, useImperativeHandle, useRef } from 'react'
import { TextInput } from 'react-native'

type InputProps = ComponentProps<typeof InputField> & {
  errorMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export const Input = forwardRef<TextInput, InputProps>(
  (
    { isReadOnly = false, errorMessage = null, isInvalid = false, ...rest },
    ref,
  ) => {
    const invalid = !!errorMessage || isInvalid

    const innerRef = useRef<TextInput>(null)
    const { colors } = useTheme()

    useImperativeHandle(ref, () => innerRef.current as TextInput)

    return (
      <FormControl isInvalid={invalid} w="$full">
        <GluestackInput
          h="$12"
          borderWidth="$1"
          borderColor={colors.border}
          borderRadius="$md"
          $focus={{
            borderColor: invalid ? '$error500' : colors.primary500,
          }}
          $invalid={{
            borderColor: '$error500',
          }}
          isReadOnly={isReadOnly}
          opacity={isReadOnly ? 0.5 : 1}
        >
          <InputField
            ref={innerRef as unknown as null}
            px="$4"
            bg={colors.card}
            color={colors.text}
            placeholderTextColor={colors.textInactive}
            fontFamily="$body"
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
  },
)

Input.displayName = 'Input'
