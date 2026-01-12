'use client';

import { useState } from 'react';
import type { Message } from '@/lib/types';
import { initialMessages, users } from '@/lib/data';
import { ChatMessages } from './chat-messages';
import { ChatInput } from './chat-input';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { query as localBrainQuery } from '@/ai/local-brain';

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const { toast } = useToast();


  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      author: users['user-1'],
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);

    // Get AI response from local brain
    const aiResponseData = await localBrainQuery({ query: content });

    const aiResponse: Message = {
      id: `msg-${Date.now() + 1}`,
      author: users['ai-1'],
      content: aiResponseData.answer,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiResponse]);
    
    // Trigger save to memory prompt
    setTimeout(() => setShowSaveDialog(true), 1500);
  };
  
  const handleSaveMemory = (save: boolean) => {
    setShowSaveDialog(false);
    toast({
        title: save ? "Memory Saved" : "Memory Discarded",
        description: save ? "The conversation has been saved to your memory." : "The conversation was not saved.",
        variant: save ? "default" : "destructive",
    });
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ChatMessages messages={messages} />
      <ChatInput onSendMessage={handleSendMessage} />

      <AlertDialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Save to Memory?</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to allow Ani AI to remember this part of our conversation? This helps me learn and provide better assistance in the future.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => handleSaveMemory(false)}>Discard</AlertDialogCancel>
            <AlertDialogAction onClick={() => handleSaveMemory(true)}>Approve & Save</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
