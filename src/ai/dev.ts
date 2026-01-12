import { config } from 'dotenv';
config();

import '@/ai/flows/answer-from-web-search.ts';
import '@/ai/flows/summarize-conversation.ts';
import '@/ai/flows/interpret-user-sentiment.ts';