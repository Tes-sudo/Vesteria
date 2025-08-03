import { zodResolver } from '@hookform/resolvers/zod';
import { Stack } from 'expo-router';
import * as React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { showMessage } from 'react-native-flash-message';
import { z } from 'zod';

import { useCreatePost } from '@/api';
import {
  Button,
  Input,
  Label,
  showErrorMessage,
  Text,
  View,
} from '@/components/ui';

const schema = z.object({
  title: z.string().min(10),
  body: z.string().min(120),
});

type FormType = z.infer<typeof schema>;

export default function AddPost() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormType>({
    resolver: zodResolver(schema),
  });
  const { mutateAsync: createPost } = useCreatePost();
  const [isPending, setIsPending] = React.useState(false);

  const onSubmit = async (data: FormType) => {
    console.log(data);
    setIsPending(true);
    try {
      await createPost({
        title: data.title,
        content: data.body,
      });
      showMessage({
        message: 'Post added successfully',
        type: 'success',
      });
      // here you can navigate to the post list - Convex will automatically update the list
    } catch (error) {
      showErrorMessage('Error adding post');
    } finally {
      setIsPending(false);
    }
  };
  return (
    <>
      <Stack.Screen
        options={{
          title: 'Add Post',
          headerBackTitle: 'Feed',
        }}
      />
      <View className="flex-1 p-4 ">
        <View className="mb-4">
          <Label nativeID="title" className="mb-2">
            Title
          </Label>
          <Controller
            control={control}
            name="title"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                testID="title"
                placeholder="Enter post title"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.title && (
            <Text className="mt-1 text-sm text-destructive">
              {errors.title.message}
            </Text>
          )}
        </View>

        <View className="mb-6">
          <Label nativeID="body" className="mb-2">
            Content
          </Label>
          <Controller
            control={control}
            name="body"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                testID="body-input"
                placeholder="Write your post content..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                multiline
                numberOfLines={8}
                className="h-32 py-3"
                textAlignVertical="top"
              />
            )}
          />
          {errors.body && (
            <Text className="mt-1 text-sm text-destructive">
              {errors.body.message}
            </Text>
          )}
        </View>

        <Button
          onPress={handleSubmit(onSubmit)}
          testID="add-post-button"
          disabled={isPending}
        >
          <Text className="font-semibold text-primary-foreground">
            {isPending ? 'Adding Post...' : 'Add Post'}
          </Text>
        </Button>
      </View>
    </>
  );
}
