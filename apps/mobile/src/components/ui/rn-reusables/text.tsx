import * as React from 'react';
import { Text as RNText, type TextProps as RNTextProps } from 'react-native';

import { translate, type TxKeyPath } from '@/lib/i18n';
import { cn } from '@/lib/utils';

const TextClassContext = React.createContext<string | undefined>(undefined);

type TextProps = RNTextProps & {
  asChild?: boolean;
  className?: string;
  tx?: TxKeyPath;
  txOptions?: Record<string, any>;
};

const Text = React.forwardRef<React.ElementRef<typeof RNText>, TextProps>(
  ({ className, asChild = false, tx, txOptions, children, ...props }, ref) => {
    const textClass = React.useContext(TextClassContext);

    const content = tx ? translate(tx, txOptions) : children;

    return (
      <RNText
        className={cn(
          'text-base text-foreground web:select-text',
          textClass,
          className
        )}
        ref={ref}
        {...props}
      >
        {content}
      </RNText>
    );
  }
);
Text.displayName = 'Text';

export { Text, TextClassContext };
