'use client'

import Navbar from '@/components/home/Navbar'
import Image from 'next/image'
import Link from 'next/link'
import { getCategories } from '@/utils/APIRoutes'
import { fetchCategories } from '@/utils/reuseableCode';
import { useState, useEffect, FormEvent } from 'react'
import { useRouter } from 'next/navigation';
import { JobCategory } from '@/utils/types'

export default function Header() {
    const router = useRouter()

    const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
    const [jobCategory, setJobCategory] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [search, setSearch] = useState<string>('');

    function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSearching(true);
        const params = new URLSearchParams();
        if (jobCategory) params.set('category', jobCategory);
        if (search) params.set('search', search);
        router.push(`/jobs${params.size ? '?' + params.toString() : ''}`);
        setIsSearching(false);
    };

    useEffect(() => {
        fetchCategories(setJobCategories, getCategories)
    }, [])

    return (
        <header className="relative bg-gray-900 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-95" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_rgba(253,135,0,0.15),_transparent_60%)]" />

            {/* Top nav row */}
            <div className="relative z-10 max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                <Link href="/" className="flex-shrink-0">
                    <Image
                        src="/images/logo2.png"
                        alt="NE1 Freelance"
                        priority
                        width={1560}
                        height={160}
                        className="h-10 w-auto object-contain"
                    />
                </Link>
                <Navbar />
            </div>

            {/* Hero */}
            <div className="relative z-10 max-w-4xl mx-auto px-6 pt-14 pb-20 text-center">
                <h1 className="text-4xl md:text-6xl font-bold text-white leading-tight mb-4">
                    Find skilled freelancers<br />
                    <span className="text-[#fd8700]">near you.</span>
                </h1>
                <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10">
                    Connect with trusted local professionals. Project-based pricing, no surprises.
                </p>

                {/* Search bar */}
                <form onSubmit={handleSearchSubmit} className="w-full max-w-2xl mx-auto">
                    <div className="flex items-stretch bg-white rounded-2xl shadow-2xl overflow-hidden ring-1 ring-white/10">
                        {/* Category select */}
                        <div className="relative flex items-center border-r border-gray-200">
                            <select
                                value={jobCategory}
                                onChange={(e) => setJobCategory(e.target.value)}
                                className="h-full appearance-none pl-4 pr-8 text-sm text-gray-700 bg-transparent outline-none font-medium cursor-pointer"
                            >
                                <option value="">All categories</option>
                                {jobCategories.map(cat => (
                                    <option value={cat.name} key={cat._id ?? cat.name}>{cat.name}</option>
                                ))}
                            </select>
                            {/* Chevron */}
                            <svg className="absolute right-2 w-3.5 h-3.5 text-gray-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                            </svg>
                        </div>

                        {/* Text input */}
                        <input
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="What service are you looking for?"
                            className="flex-1 px-5 py-4 text-sm text-gray-800 bg-transparent outline-none placeholder:text-gray-400"
                        />

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSearching}
                            className="flex items-center gap-2 bg-[#fd8700] hover:bg-orange-600 active:bg-orange-700 text-white px-6 py-4 text-sm font-semibold transition-colors disabled:opacity-60 flex-shrink-0"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />
                            </svg>
                            {isSearching ? 'Searching…' : 'Search'}
                        </button>
                    </div>

                    {/* Quick links */}
                    <div className="flex flex-wrap justify-center gap-2 mt-4">
                        <span className="text-gray-500 text-xs pt-0.5">Popular:</span>
                        {['Transportation', 'Cleaning', 'Esthetics', 'Design'].map(tag => (
                            <button
                                key={tag}
                                type="button"
                                onClick={() => { setSearch(tag); }}
                                className="text-xs text-gray-300 hover:text-white border border-gray-600 hover:border-gray-400 rounded-full px-3 py-0.5 transition-colors"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </form>

                {/* Trust badges */}
                <div className="flex flex-wrap justify-center gap-6 text-gray-400 text-sm mt-10">
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-400 inline-block" />
                        500+ active freelancers
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-[#fd8700] inline-block" />
                        Project-based pricing
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                        Secure payments
                    </span>
                </div>
            </div>
        </header>
    )
}
