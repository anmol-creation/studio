import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import type { Message } from '@/lib/types';
import { cn } from '@/lib/utils';
import { users } from '@/lib/data';
import Image from 'next/image';
import { Volume2, VolumeX, Search } from 'lucide-react';

interface ChatMessagesProps {
  messages: Message[];
  isTtsEnabled: boolean;
  onToggleTts: () => void;
  isSearching: boolean;
}

export function ChatMessages({ messages, isTtsEnabled, onToggleTts, isSearching }: ChatMessagesProps) {
  return (
    <div className="flex-1 relative">
      <ScrollArea className="h-full p-4">
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
          {isSearching && (
             <div className="flex items-center gap-4 justify-start">
                <Avatar className="h-10 w-10 border">
                    <Image src={users['ai-1'].avatarUrl} alt={users['ai-1'].name} width={40} height={40} className="p-1"/>
                </Avatar>
                 <div className="bg-card max-w-[75%] rounded-lg p-3 text-sm flex items-center gap-2 text-muted-foreground">
                    <Search className="h-4 w-4 animate-pulse" />
                    <span>Searching the internet...</span>
                 </div>
             </div>
          )}
        </div>
      </ScrollArea>
      <div className="absolute top-4 right-4">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" onClick={onToggleTts}>
                {isTtsEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5 text-muted-foreground" />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isTtsEnabled ? 'Disable' : 'Enable'} Voice Output</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
