import * as React from 'react';
import { TextInput, type TextInputProps } from 'react-native';

import { cn } from '@/lib/utils';

export interface InputProps extends TextInputProps {
  className?: string;
}

const Input = React.forwardRef<React.ElementRef<typeof TextInput>, InputProps>(
  ({ className, placeholderTextColor, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        className={cn(
          'web:flex h-10 native:h-12 web:w-full rounded-md border border-input bg-background px-3 web:py-2 text-base lg:text-sm native:text-lg native:leading-[1.25] text-foreground placeholder:text-muted-foreground web:ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium web:focus-visible:outline-none web:focus-visible:ring-2 web:focus-visible:ring-ring web:focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
          className
        )}
        placeholderTextColor={placeholderTextColor ?? '#888888'}
        {...props}
      />
    );
  }
);

Input.displayName = 'Input';

export { Input };
