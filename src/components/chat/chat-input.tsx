'use client';

import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Mic, Send, Languages, MicOff, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ChatInputProps {
  onSendMessage: (content: string, language: string) => void;
  language: string;
  setLanguage: (language: string) => void;
}

// Extend the Window interface to include webkitSpeechRecognition
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export function ChatInput({ onSendMessage, language, setLanguage }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (SpeechRecognition) {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = language;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          onSendMessage(transcript, language);
          stopRecording();
        };

        recognition.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
           toast({
            title: 'Voice Recognition Error',
            description: `An error occurred: ${event.error}`,
            variant: 'destructive',
          });
          stopRecording();
        };
        
        recognition.onend = () => {
            setIsRecording(false);
        };

        recognitionRef.current = recognition;
      }
    }
  }, [language, onSendMessage, toast]);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSendClick = () => {
    onSendMessage(text, language);
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const startRecording = () => {
     if (!recognitionRef.current) {
      toast({
        title: 'Unsupported Browser',
        description: 'Voice recording is not supported in your browser.',
        variant: 'destructive',
      });
      return;
    }
    try {
      recognitionRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: 'Could not start recording',
        description: 'Please ensure microphone access is allowed and try again.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (recognitionRef.current && isRecording) {
      recognitionRef.current.stop();
      setIsRecording(false);
    }
  };

  const handleMicClick = () => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  };


  return (
    <div className="border-t bg-card p-4">
      <div className="relative">
        <Textarea
          placeholder="Type your message or use the mic..."
          className="pr-20"
          value={text}
          onChange={handleTextChange}
          onKeyDown={handleKeyPress}
        />
        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-2">
            <Button
            size="icon"
            variant="ghost"
            onClick={text ? handleSendClick : handleMicClick}
            >
            {text ? <Send className="h-5 w-5" /> : (isRecording ? <MicOff className="h-5 w-5 text-destructive" /> : <Mic className="h-5 w-5" />)}
            </Button>
        </div>
      </div>
      <div className="mt-2 flex items-center justify-between">
        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-auto bg-transparent border-0 text-muted-foreground shadow-none hover:text-foreground">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en-US">English</SelectItem>
            <SelectItem value="hi-IN">Hindi</SelectItem>
          </SelectContent>
        </Select>
        <TooltipProvider>
            <Tooltip>
                <TooltipTrigger asChild>
                    <p className="text-xs text-muted-foreground flex items-center gap-1"><AlertCircle className="h-3 w-3" /> AI may make mistakes. Consider checking important information.</p>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Ani AI is an experimental technology.</p>
                </TooltipContent>
            </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
}
