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
    "Find suppliers for industrial components",
    "Search for manufacturing partners",
    "Locate raw material suppliers",
    "Find quality certified vendors",
    "Search for international suppliers"
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
        <main className="min-h-screen bg-[#FAFAFB] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="w-full max-w-[528px] flex flex-col items-center gap-8">
                {/* Title */}
                <div className="text-center">
                    <h1 className="text-[32px] font-light leading-[1.25] tracking-[-0.25%] text-[#222222]">
                        Cagdas <span className="text-indigo-600">Supplier Scout</span>
                    </h1>
                </div>

                {/* Input Container */}
                <div className="w-full flex flex-col gap-1">
                    <form onSubmit={handleSubmit} className="relative">
                        <div className="bg-white border border-[#EBEBEB] rounded-2xl shadow-[0px_0px_10px_0px_rgba(34,34,34,0.04),0px_4px_6px_-2px_rgba(34,34,34,0.04),0px_6px_12px_-2px_rgba(34,34,34,0.06)]">
                            {/* Input Field */}
                            <div className="pt-3 px-3">
                                <input
                                    type="text"
                                    name="search"
                                    id="search"
                                    className="w-full bg-transparent border-none outline-none text-sm leading-[1.43] text-[#222222] placeholder:text-[#888888] py-2"
                                    placeholder="Enter a description..."
                                    value={query}
                                    onChange={(e) => setQuery(e.target.value)}
                                />
                            </div>
                            
                            {/* Buttons Row */}
                            <div className="flex justify-between items-center gap-2 px-3 pb-3 pt-1 bg-gradient-to-b from-[rgba(254,254,254,0.4)] to-[rgba(254,254,254,1)]">
                                {/* Attach Button */}
                                <button
                                    type="button"
                                    className="flex items-center gap-1 px-[10px] py-1.5 bg-white border border-[#EBEBEB] rounded-lg shadow-[0px_1px_2px_0px_rgba(34,34,34,0.05)] hover:bg-gray-50 transition-colors"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M12.5 5.83333V13.3333C12.5 14.7142 11.3808 15.8333 10 15.8333C8.61917 15.8333 7.5 14.7142 7.5 13.3333V5C7.5 3.61917 8.61917 2.5 10 2.5C11.3808 2.5 12.5 3.61917 12.5 5V11.6667" stroke="#505050" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                    <span className="text-sm leading-[1.43] text-[#505050] font-light">Attach</span>
                                </button>

                                {/* Send Button */}
                                <button
                                    type="submit"
                                    disabled={loading || !query.trim()}
                                    className="p-1.5 bg-white border border-[#EBEBEB] rounded-lg shadow-[0px_1px_2px_0px_rgba(34,34,34,0.05)] hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M10 3.33333V16.6667M10 3.33333L4.16667 9.16667M10 3.33333L15.8333 9.16667" stroke={query.trim() ? "#505050" : "#D0B5BC"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                {/* Preset Messages */}
                {results.length === 0 && !loading && (
                    <div className="w-full flex flex-wrap justify-center gap-2">
                        {presetQueries.map((preset, index) => (
                            <button
                                key={index}
                                onClick={() => handlePresetClick(preset)}
                                className="px-[10px] py-0.5 bg-[#EAEBF0] rounded-2xl shadow-[0px_1px_2px_0px_rgba(34,34,34,0.05)] hover:bg-[#D5D6DB] transition-colors"
                            >
                                <span className="text-sm leading-[1.43] text-[#182039] font-light">
                                    {preset}
                                </span>
                            </button>
                        ))}
                    </div>
                )}

                {/* Success Message */}
                {saved && (
                    <div className="w-full p-4 bg-green-100 text-green-700 rounded-md text-center">
                        {saved}
                    </div>
                )}

                {/* Results */}
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
