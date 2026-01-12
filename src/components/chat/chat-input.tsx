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
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface ChatInputProps {
  onSendMessage: (content: string) => void;
}

export function ChatInput({ onSendMessage }: ChatInputProps) {
  const [text, setText] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isRecordingSupported, setIsRecordingSupported] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    if (typeof window !== 'undefined' && navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        setIsRecordingSupported(true);
    }
  }, []);

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(e.target.value);
  };

  const handleSendClick = () => {
    onSendMessage(text);
    setText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendClick();
    }
  };

  const startRecording = async () => {
    if (!isRecordingSupported) {
        toast({
            title: 'Unsupported Browser',
            description: 'Voice recording is not supported in your browser.',
            variant: 'destructive',
        });
        return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        // Here you would typically send the audioBlob to a speech-to-text service
        console.log('Audio recorded:', audioBlob);
        onSendMessage('[Simulated voice message: User spoke]');
        
        // Stop all audio tracks to turn off the mic indicator
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Error starting recording:', err);
      toast({
        title: 'Microphone Access Denied',
        description: 'Please allow microphone access to use voice chat.',
        variant: 'destructive',
      });
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
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
        <Select defaultValue="en">
          <SelectTrigger className="w-auto bg-transparent border-0 text-muted-foreground shadow-none hover:text-foreground">
            <div className="flex items-center gap-2">
              <Languages className="h-4 w-4" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="en">English</SelectItem>
            <SelectItem value="hi">Hindi</SelectItem>
            <SelectItem value="hien">Hinglish</SelectItem>
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
