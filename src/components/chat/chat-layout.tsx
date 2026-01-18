'use client';

import { useState, useEffect } from 'react';
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
import { useFirestore } from '@/firebase/provider';

export function ChatLayout() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [language, setLanguage] = useState('en-US'); // Default to English
  const [isTtsEnabled, setIsTtsEnabled] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const { toast } = useToast();
  const { db } = useFirestore();

  useEffect(() => {
    // Speak the initial AI message if TTS is on
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.author.id === 'ai-1' && isTtsEnabled) {
      speak(lastMessage.content, language);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run only once on mount

  const speak = (text: string, lang: string) => {
    if (typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop any previous speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    window.speechSynthesis.speak(utterance);
  };

  const handleSendMessage = async (content: string, lang: string) => {
    if (!content.trim()) return;

    setLanguage(lang); // Set language from input

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      author: users['user-1'],
      content,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, newMessage]);
    setIsSearching(true);
    
    if (!db) {
        toast({
            title: 'Error',
            description: 'Firestore is not available. Please try again later.',
            variant: 'destructive',
        });
        setIsSearching(false);
        return;
    }

    // Get AI response from local brain
    const aiResponseData = await localBrainQuery(db, { query: content });
    setIsSearching(false);

    const aiResponse: Message = {
      id: `msg-${Date.now() + 1}`,
      author: users['ai-1'],
      content: aiResponseData.answer,
      timestamp: new Date().toISOString(),
    };
    setMessages((prev) => [...prev, aiResponse]);

    if (isTtsEnabled) {
        speak(aiResponse.content, lang);
    }
    
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

  const toggleTts = () => {
    const ttsWasEnabled = isTtsEnabled;
    setIsTtsEnabled((prev) => !prev);
    if (!ttsWasEnabled) {
        const lastMessage = messages[messages.length - 1];
        if (lastMessage && lastMessage.author.id === 'ai-1') {
            speak(lastMessage.content, language);
        }
    } else {
        window.speechSynthesis.cancel();
    }
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      <ChatMessages 
        messages={messages} 
        isTtsEnabled={isTtsEnabled}
        onToggleTts={toggleTts}
        isSearching={isSearching}
      />
      <ChatInput 
        onSendMessage={handleSendMessage} 
        language={language}
        setLanguage={setLanguage}
      />

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
