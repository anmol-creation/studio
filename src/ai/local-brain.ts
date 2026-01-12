'use server';

/**
 * @fileOverview A placeholder for a local AI engine.
 */

// A simple placeholder for user input.
export type LocalBrainInput = {
  query: string;
};

// A simple placeholder for the AI's response.
export type LocalBrainOutput = {
  answer: string;
};

/**
 * A placeholder function that simulates an AI responding to a user query.
 * @param input The user's query.
 * @returns A mock response.
 */
export async function query(input: LocalBrainInput): Promise<LocalBrainOutput> {
  // In the future, this will be replaced with a call to a private AI engine.
  // For now, it returns a canned response.

  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay

  return {
    answer: `This is a mock response to your query: "${input.query}". The real AI is not yet connected.`
  };
}

/**
 * A placeholder function to summarize a conversation.
 * @returns A mock summary.
 */
export async function summarizeConversation(): Promise<string> {
  return "This is a mock summary of the conversation.";
}
