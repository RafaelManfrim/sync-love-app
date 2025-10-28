import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GluestackInput,
  InputField,
  InputSlot,
  Pressable,
} from '@gluestack-ui/themed'
import { useTheme } from '@hooks/useTheme'
import { Eye, EyeOff } from 'lucide-react-native'
import {
  ComponentProps,
  forwardRef,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'
import { TextInput } from 'react-native'

type PasswordInputProps = ComponentProps<typeof InputField> & {
  errorMessage?: string | null
  isInvalid?: boolean
  isReadOnly?: boolean
}

export const PasswordInput = forwardRef<TextInput, PasswordInputProps>(
  (
    { isReadOnly = false, errorMessage = null, isInvalid = false, ...rest },
    ref,
  ) => {
    const [showPassword, setShowPassword] = useState(false)
    const invalid = !!errorMessage || isInvalid

    const innerRef = useRef<TextInput>(null)
    const { colors } = useTheme()

    useImperativeHandle(ref, () => innerRef.current as TextInput)

    const togglePasswordVisibility = () => {
      setShowPassword((prev) => !prev)
    }

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
            secureTextEntry={!showPassword}
            {...rest}
          />
          <InputSlot pr="$3" onPress={togglePasswordVisibility}>
            <Pressable onPress={togglePasswordVisibility}>
              {showPassword ? (
                <EyeOff size={20} color={colors.textInactive} />
              ) : (
                <Eye size={20} color={colors.textInactive} />
              )}
            </Pressable>
          </InputSlot>
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

PasswordInput.displayName = 'PasswordInput'
