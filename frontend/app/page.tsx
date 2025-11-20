"use client";

import { useState } from 'react';
import SupplierCard from '../components/SupplierCard';

interface Supplier {
    id?: number;
    name: string;
    website: string;
    relevance_score: number;
    notes: string;
}

const presetQueries = [
    "Show me the list of my repair capabilities.",
    "I'd like to request a part.",
    "I want to update my inventory records.",
    "I'd like to start an exchange process.",
    "Show me the current status of my orders."
];

export default function Home() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<Supplier[]>([]);
    const [loading, setLoading] = useState(false);
    const [saved, setSaved] = useState<string | null>(null);

    const handleSearch = async (searchQuery?: string) => {
        const queryToUse = searchQuery || query;
        if (!queryToUse.trim()) return;

        setLoading(true);
        setResults([]);
        setSaved(null);

        try {
            const res = await fetch('http://localhost:8000/search', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ query: queryToUse }),
            });
            const data = await res.json();
            setResults(data);
        } catch (error) {
            console.error("Search failed:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        await handleSearch();
    };

    const handlePresetClick = (presetQuery: string) => {
        setQuery(presetQuery);
        handleSearch(presetQuery);
    };

    const handleSave = async (supplier: Supplier) => {
        try {
            const res = await fetch('http://localhost:8000/suppliers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(supplier),
            });
            if (res.ok) {
                setSaved(`Saved ${supplier.name}!`);
                setTimeout(() => setSaved(null), 3000);
            }
        } catch (error) {
            console.error("Save failed:", error);
        }
    };

    return (
        <main className="relative min-h-screen w-full overflow-hidden bg-linear-to-b from-[#F9FAFB] to-[#F2F4F7] px-4 py-12">
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                <div className="h-[420px] w-[420px] rounded-full bg-white blur-3xl opacity-50" />
            </div>

            <div className="relative mx-auto flex w-full max-w-3xl flex-col items-center gap-10 text-center">
                <div>
                    <p className="text-sm uppercase tracking-[0.35em] text-[#A0AEC0]">Support assistant</p>
                    <h1 className="mt-4 text-4xl font-light tracking-tight text-[#1C1E26] md:text-[48px]">
                        How can I help you?
                    </h1>
                </div>

                <form onSubmit={handleSubmit} className="w-full">
                    <div className="rounded-[32px] border border-[#E5E7EB] bg-white/90 p-6 shadow-[0_30px_60px_rgba(15,23,42,0.08)] backdrop-blur">
                        <label htmlFor="search" className="mb-3 block text-left text-sm font-medium text-[#8A8F9C]">
                            Enter a description
                        </label>
                        <div className="flex items-center gap-3 rounded-[24px] border border-transparent bg-[#F7F8FC] px-4 py-3 transition focus-within:border-[#C4B5FD]">
                            <button
                                type="button"
                                className="flex items-center gap-2 rounded-full bg-white/80 px-3 py-2 text-sm text-[#5C6475] shadow-[0_8px_20px_rgba(44,52,74,0.08)] transition hover:bg-white"
                            >
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M7 13.5V6.75C7 5.23122 8.23122 4 9.75 4V4C11.2688 4 12.5 5.23122 12.5 6.75V14.25C12.5 15.7688 11.2688 17 9.75 17V17C8.23122 17 7 15.7688 7 14.25V9.5" stroke="#5C6475" strokeWidth="1.5" strokeLinecap="round"/>
                                    <path d="M12.5 10.25V6.75C12.5 5.23122 13.7312 4 15.25 4V4C16.7688 4 18 5.23122 18 6.75V13.5C18 16.5376 15.5376 19 12.5 19V19C9.46243 19 7 16.5376 7 13.5V11.5" stroke="#5C6475" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Attach
                            </button>

                            <input
                                type="text"
                                name="search"
                                id="search"
                                className="flex-1 bg-transparent text-base text-[#1E2029] placeholder:text-[#A0A5B4] focus:outline-none"
                                placeholder="Describe what you need help with..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                            />

                            <button
                                type="submit"
                                disabled={loading || !query.trim()}
                                className="flex h-12 w-12 items-center justify-center rounded-[16px] bg-[#F1EBFF] text-[#6C4CF5] shadow-[0_8px_24px_rgba(108,76,245,0.25)] transition hover:bg-[#E6DEFF] disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10 3.33333V16.6667M10 3.33333L4.16667 9.16667M10 3.33333L15.8333 9.16667" stroke="#6C4CF5" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                            </button>
                        </div>
                    </div>
                </form>

                {results.length === 0 && !loading && (
                    <div className="flex flex-wrap justify-center gap-3">
                        {presetQueries.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => handlePresetClick(preset)}
                                className="rounded-full bg-white px-4 py-2 text-sm text-[#586380] shadow-[0_8px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-0.5"
                            >
                                {preset}
                            </button>
                        ))}
                    </div>
                )}

                {saved && (
                    <div className="w-full rounded-2xl border border-green-100 bg-green-50/90 px-4 py-3 text-sm text-green-700 shadow-inner">
                        {saved}
                    </div>
                )}

                <div className="w-full space-y-6">
                    {results.map((supplier, index) => (
                        <SupplierCard key={index} supplier={supplier} onSave={handleSave} />
                    ))}

                    {results.length === 0 && !loading && query && (
                        <p className="text-center text-gray-500">No results found. Try a different query.</p>
                    )}

                    {loading && (
                        <p className="text-center text-gray-500">Searching...</p>
                    )}
                </div>
            </div>
        </main>
    );
}
