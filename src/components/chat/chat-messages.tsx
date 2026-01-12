import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { users } from '@/lib/data';
import Image from 'next/image';

interface ChatMessagesProps {
  messages: Message[];
}

export function ChatMessages({ messages }: ChatMessagesProps) {
  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-6">
        {messages.map((message) => {
          const isUser = message.author.id === users['user-1'].id;
          return (
            <div
              key={message.id}
              className={cn(
                'flex items-start gap-4',
                isUser ? 'justify-end' : 'justify-start'
              )}
            >
              {!isUser && (
                <Avatar className="h-10 w-10 border">
                    <Image src={message.author.avatarUrl} alt={message.author.name} width={40} height={40} className="p-1"/>
                </Avatar>
              )}
              <div
                className={cn(
                  'max-w-[75%] rounded-lg p-3 text-sm',
                  isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-card'
                )}
              >
                <p className="whitespace-pre-wrap">{message.content}</p>
              </div>
              {isUser && (
                <Avatar className="h-10 w-10 border">
                  <AvatarImage src={message.author.avatarUrl} alt={message.author.name} />
                  <AvatarFallback>{message.author.initials}</AvatarFallback>
                </Avatar>
              )}
            </div>
          );
        })}
      </div>
    </ScrollArea>
  );
}
