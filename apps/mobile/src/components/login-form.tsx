import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import type { SubmitHandler } from 'react-hook-form';
import { Controller, useForm } from 'react-hook-form';
import { KeyboardAvoidingView, View } from 'react-native';
import * as z from 'zod';

import { Button, Input, Label, Text } from './ui';

const schema = z.object({
  email: z
    .string({
      required_error: 'Email is required',
    })
    .email('Invalid email format'),
});

export type FormType = z.infer<typeof schema>;

export type LoginFormProps = {
  onSubmit?: SubmitHandler<FormType>;
  isLoading?: boolean;
};

export const LoginForm = ({
  onSubmit = () => {},
  isLoading = false,
}: LoginFormProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior="padding"
      keyboardVerticalOffset={10}
    >
      <View className="flex-1 justify-center p-4">
        <View className="items-center justify-center">
          <Text
            testID="form-title"
            className="pb-6 text-center text-4xl font-bold"
          >
            Sign In
          </Text>

          <Text className="mb-6 max-w-xs text-center text-muted-foreground">
            Welcome! 👋 Enter your email address and we'll send you a magic link
            to sign in.
          </Text>
        </View>

        <View className="mb-6">
          <Label nativeID="email" className="mb-2">
            Email
          </Label>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                testID="email-input"
                placeholder="Enter your email"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            )}
          />
          {errors.email && (
            <Text className="mt-1 text-sm text-destructive">
              {errors.email.message}
            </Text>
          )}
        </View>

        <Button
          testID="login-button"
          onPress={handleSubmit(onSubmit)}
          disabled={isLoading}
        >
          <Text className="font-semibold text-primary-foreground">
            {isLoading ? 'Sending...' : 'Send Magic Link'}
          </Text>
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
};
