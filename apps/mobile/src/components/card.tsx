import { Link } from 'expo-router';
import React from 'react';
import { Pressable } from 'react-native';

import type { Post } from '@/api';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Image,
  Text,
} from '@/components/ui';

type Props = Post;

const images = [
  'https://images.unsplash.com/photo-1489749798305-4fea3ae63d43?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1564507004663-b6dfb3c824d5?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1515386474292-47555758ef2e?auto=format&fit=crop&w=800&q=80',
  'https://plus.unsplash.com/premium_photo-1666815503002-5f07a44ac8fb?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1587974928442-77dc3e0dba72?auto=format&fit=crop&w=800&q=80',
];

export const PostCard = ({ title, body, id }: Props) => {
  return (
    <Link href={`/feed/${id}`} asChild>
      <Pressable>
        <Card className="m-2 overflow-hidden">
          <Image
            className="h-56 w-full"
            contentFit="cover"
            source={{
              uri: images[Math.floor(Math.random() * images.length)],
            }}
          />
          <CardHeader>
            <CardTitle>
              <Text className="text-2xl font-bold">{title}</Text>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CardDescription>
              <Text numberOfLines={3} className="leading-snug">
                {body}
              </Text>
            </CardDescription>
          </CardContent>
        </Card>
      </Pressable>
    </Link>
  );
};
