import { 
  FormControl,
  FormErrorMessage, 
  FormLabel, 
  Input, 
  InputProps, 
  Textarea, 
  TextareaProps
} from '@chakra-ui/react';
import { useField } from 'formik';
import React from 'react'

type InputOrTextareaProps = 
  {
    textarea?: false  
  } & InputProps | {   
    textarea: true;
  } & TextareaProps;

type InputFieldProps = 
  {
    label: string;
    name: string;
  } & InputOrTextareaProps;

const TextComponent: React.FC<InputOrTextareaProps> = (props) => {
  if (props.textarea) return <Textarea {...props} />
  return <Input {...props} />
} 

export const InputField: React.FC<InputFieldProps> = ({ 
  label,
  name,
  ...props
  }) => {
    const [field, { error, touched }] = useField(name);
        return (
            <FormControl isInvalid={Boolean(error)}>
              <FormLabel htmlFor={name} >{label}</FormLabel>
              <TextComponent 
                {...field} 
                {...props}
                id={name}
              />
              {touched && error ? <FormErrorMessage>{error}</FormErrorMessage> : null}
            </FormControl>
        );
}