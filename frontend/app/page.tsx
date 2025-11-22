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
        <main className="min-h-screen w-full bg-[#FAFAFB] flex items-center justify-center px-4 py-12">
            <div className="w-full max-w-[528px] flex flex-col items-center gap-8">
                {/* Title Section */}
                <div className="w-full text-center">
                    <h1 className="text-[32px] font-light leading-tight tracking-[-0.25%] text-[#222222]">
                        How can I help you?
                    </h1>
                </div>

                {/* Chat Input Section */}
                <form onSubmit={handleSubmit} className="w-full">
                    <div className="w-full flex flex-col gap-1 shadow-[0px_0px_10px_0px_rgba(34,34,34,0.04),0px_4px_6px_-2px_rgba(34,34,34,0.04),0px_6px_12px_-2px_rgba(34,34,34,0.06)]">
                        <div className="w-full bg-white border border-[#EBEBEB] rounded-2xl flex flex-col">
                            {/* Input Area */}
                            <div className="px-3 pt-3">
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="w-full bg-transparent text-sm font-light text-[#222222] placeholder:text-[#888888] focus:outline-none pb-2"
                                    placeholder="Enter a description..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            
                            {/* Buttons Row */}
                            <div className="px-3 pb-3 pt-1 flex items-center justify-between bg-gradient-to-b from-[rgba(254,254,254,0.4)] to-[rgba(254,254,254,1)]">
                                <button
                                    type="button"
                                    className="flex items-center gap-1 px-[10px] py-1.5 bg-white border border-[#EBEBEB] rounded-lg shadow-[0px_1px_2px_0px_rgba(34,34,34,0.05)] text-sm font-light text-[#505050] hover:bg-gray-50 transition"
                                >
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M7 13.5V6.75C7 5.23122 8.23122 4 9.75 4V4C11.2688 4 12.5 5.23122 12.5 6.75V14.25C12.5 15.7688 11.2688 17 9.75 17V17C8.23122 17 7 15.7688 7 14.25V9.5" stroke="#505050" strokeWidth="1.5" strokeLinecap="round"/>
                                        <path d="M12.5 10.25V6.75C12.5 5.23122 13.7312 4 15.25 4V4C16.7688 4 18 5.23122 18 6.75V13.5C18 16.5376 15.5376 19 12.5 19V19C9.46243 19 7 16.5376 7 13.5V11.5" stroke="#505050" strokeWidth="1.5" strokeLinecap="round"/>
                                    </svg>
                                    <span>Attach</span>
                                </button>

                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="flex items-center justify-center w-6 h-6 p-1.5 bg-[#FAF7F7] border border-[#FAF7F7] rounded-lg text-[#D0B5BC] disabled:opacity-50 disabled:cursor-not-allowed hover:bg-[#F5F0F0] transition"
                                >
                                    <svg width="13" height="16" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 3.33333V16.6667M10 3.33333L4.16667 9.16667M10 3.33333L15.8333 9.16667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Preset Messages */}
                {results.length === 0 && !loading && (
                    <div className="w-full max-w-[576px] flex flex-wrap justify-center gap-2">
                        {presetQueries.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => handlePresetClick(preset)}
                                className="px-2.5 py-0.5 bg-[#EAEBF0] rounded-2xl text-sm font-light text-[#182039] shadow-[0px_1px_2px_0px_rgba(34,34,34,0.05)] hover:bg-[#E0E1E6] transition"
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
