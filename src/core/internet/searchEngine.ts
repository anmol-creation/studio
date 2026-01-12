'use server';

import * as cheerio from 'cheerio';

type SearchResult = {
    title: string;
    link: string;
    snippet: string;
};

export async function searchWeb(query: string): Promise<SearchResult[]> {
    console.log(`Searching web for: ${query}`);
    try {
        const response = await fetch(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            console.error(`DuckDuckGo search failed with status: ${response.status}`);
            return [];
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        const results: SearchResult[] = [];
        $('.result').each((i, el) => {
            if (results.length >= 5) return; // Limit to 5 results

            const title = $(el).find('.result__title a').text().trim();
            const link = $(el).find('.result__url').text().trim();
            const snippet = $(el).find('.result__snippet').text().trim();
            
            if (title && link && snippet) {
                results.push({ title, link, snippet });
            }
        });
        
        console.log(`Found ${results.length} results.`);
        return results;

    } catch (error) {
        console.error('Error during web search:', error);
        return [];
    }
}
