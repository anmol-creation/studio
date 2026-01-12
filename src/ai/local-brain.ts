'use server';

import { saveMemory } from "@/core/memory/memoryEngine";
import { searchWeb } from "@/core/internet/searchEngine";

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
  isSearchingInternet?: boolean;
};

const internetKeywords = [
  "news", "price", "current status", "today", "latest", "weather", "update", "what is", "who is", "define"
];

function needsInternet(query: string): boolean {
    const lowerCaseQuery = query.toLowerCase();
    return internetKeywords.some(keyword => lowerCaseQuery.includes(keyword));
}

/**
 * A placeholder function that simulates an AI responding to a user query.
 * @param input The user's query.
 * @returns A mock response.
 */
export async function query(input: LocalBrainInput): Promise<LocalBrainOutput> {
  const { query } = input;

  if (query.toLowerCase().includes("yaad rakh")) {
    await saveMemory("Personal_Life", 1, 1, {
      title: "Current Life Status",
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      content: [query],
      importance: "High",
      ownerApproved: true
    });

    return { answer: "Ye baat yaad rakh li hai." };
  }

  if (needsInternet(query)) {
    const searchResults = await searchWeb(query);
    const context = searchResults.length > 0 
        ? `Here is some information from the internet: ${searchResults.map(r => r.snippet).join(' ')}`
        : "I couldn't find anything on the internet about that.";
    
    const finalAnswer = `${context}\n\nBased on this, here is my reasoning: [AI reasoning based on internet results for '${query}']`;

    return { answer: finalAnswer, isSearchingInternet: false };
  }

  return { answer: "Main ready hoon. Tum kya baat karna chahte ho?" };
}

/**
 * A placeholder function to summarize a conversation.
 * @returns A mock summary.
 */
export async function summarizeConversation(): Promise<string> {
  return "This is a mock summary of the conversation.";
}
