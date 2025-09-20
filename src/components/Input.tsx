import {
  FormControl,
  FormControlError,
  FormControlErrorText,
  Input as GluestackInput,
  InputField,
} from '@gluestack-ui/themed'
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

    useImperativeHandle(ref, () => innerRef.current as TextInput)

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
            ref={innerRef as unknown as null}
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
  },
)

Input.displayName = 'Input'

// export function Input({
//   isReadOnly = false,
//   errorMessage = null,
//   isInvalid = false,
//   ...rest
// }: InputProps) {
//   const invalid = !!errorMessage || isInvalid

//   return (
//     <FormControl isInvalid={invalid} w="$full">
//       <GluestackInput
//         h="$12"
//         borderWidth="$1"
//         borderColor="$trueGray200"
//         borderRadius="$md"
//         $focus={{
//           borderColor: invalid ? '$error500' : '$red500',
//         }}
//         $invalid={{
//           borderColor: '$error500',
//         }}
//         isReadOnly={isReadOnly}
//         opacity={isReadOnly ? 0.5 : 1}
//       >
//         <InputField
//           bg="$trueGray100"
//           px="$4"
//           color="$trueGray700"
//           fontFamily="$body"
//           placeholderTextColor="$trueGray400"
//           {...rest}
//         />
//       </GluestackInput>
//       <FormControlError>
//         <FormControlErrorText color="$error500">
//           {errorMessage}
//         </FormControlErrorText>
//       </FormControlError>
//     </FormControl>
//   )
// }
