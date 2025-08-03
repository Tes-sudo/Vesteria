import { useAuthActions } from '@convex-dev/auth/react';
import React, { useState } from 'react';
import { showMessage } from 'react-native-flash-message';

import type { LoginFormProps } from '@/components/login-form';
import { LoginForm } from '@/components/login-form';
import { FocusAwareStatusBar } from '@/components/ui';

export default function Login() {
  const { signIn } = useAuthActions();
  const [isLoading, setIsLoading] = useState(false);

  const onSubmit: LoginFormProps['onSubmit'] = async (data) => {
    setIsLoading(true);
    try {
      // Send magic link
      await signIn('resend', {
        email: data.email,
      });

      showMessage({
        message: 'Magic link sent!',
        description: 'Check your email for the login link',
        type: 'success',
      });
      // The actual redirect will happen when the user clicks the magic link
    } catch (error) {
      console.error('Login error:', error);
      showMessage({
        message: 'Login error',
        description: 'An unexpected error occurred',
        type: 'danger',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <FocusAwareStatusBar />
      <LoginForm onSubmit={onSubmit} isLoading={isLoading} />
    </>
  );
}
