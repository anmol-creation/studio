'use server';

/**
 * @fileOverview Interprets the sentiment of user messages to adapt the AI's tone and responses.
 *
 * - interpretUserSentiment - A function that analyzes user message sentiment.
 * - InterpretUserSentimentInput - The input type for the interpretUserSentiment function.
 * - InterpretUserSentimentOutput - The return type for the interpretUserSentiment function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const InterpretUserSentimentInputSchema = z.object({
  message: z.string().describe('The user message to analyze.'),
});
export type InterpretUserSentimentInput = z.infer<typeof InterpretUserSentimentInputSchema>;

const InterpretUserSentimentOutputSchema = z.object({
  sentiment: z
    .string()
    .describe(
      'The sentiment of the message (e.g., positive, negative, neutral). Provide additional details when possible (e.g. slightly positive, very negative, etc.)'
    ),
  confidence: z
    .number()
    .describe('The confidence level of the sentiment analysis, from 0 to 1.'),
});
export type InterpretUserSentimentOutput = z.infer<typeof InterpretUserSentimentOutputSchema>;

export async function interpretUserSentiment(
  input: InterpretUserSentimentInput
): Promise<InterpretUserSentimentOutput> {
  return interpretUserSentimentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'interpretUserSentimentPrompt',
  input: {schema: InterpretUserSentimentInputSchema},
  output: {schema: InterpretUserSentimentOutputSchema},
  prompt: `You are a sentiment analysis expert.

  Analyze the sentiment of the following user message and provide the sentiment and confidence level.

  Message: {{{message}}}

  Respond in a JSON format.
  `,
});

const interpretUserSentimentFlow = ai.defineFlow(
  {
    name: 'interpretUserSentimentFlow',
    inputSchema: InterpretUserSentimentInputSchema,
    outputSchema: InterpretUserSentimentOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
