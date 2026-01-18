type SearchResult = {
    title: string;
    link: string;
    snippet: string;
};

export async function searchWeb(query: string): Promise<SearchResult[]> {
    console.log(`Web search for "${query}" is disabled in static export mode.`);
    return [];
}
