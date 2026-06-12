'use client'

import { SessionType, JobsType, JobCategory } from '@/utils/types'
import GlobalNavbar from '@/components/GlobalNavbar'
import { fetchCategories, getUserSession } from '@/utils/reuseableCode';
import { getAllJobs, getCategories, searchJobs } from '@/utils/APIRoutes'
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import ThumbnailImage from '@/components/ThumbnailImage';
import { FormEvent, useEffect, useState } from 'react'
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Pagination from '@/components/ui/Pagination';

const PAGE_SIZE = 20;
const BATCH_SIZE = 100;
const PAGES_PER_BATCH = BATCH_SIZE / PAGE_SIZE; // 5

function calcBatchSkip(page: number) {
    return Math.floor((page - 1) / PAGES_PER_BATCH) * BATCH_SIZE;
}

function slicePage(batch: JobsType[], page: number): JobsType[] {
    const offset = ((page - 1) % PAGES_PER_BATCH) * PAGE_SIZE;
    return batch.slice(offset, offset + PAGE_SIZE);
}

export default function JobsComponent() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [session, setSession] = useState<SessionType>()
    const [jobBatch, setJobBatch] = useState<JobsType[]>([])
    const [totalJobs, setTotalJobs] = useState(0)
    const [batchSkipLoaded, setBatchSkipLoaded] = useState(-1)
    const [currentPage, setCurrentPage] = useState(1)
    const [jobCategories, setJobCategories] = useState<JobCategory[]>([])
    const [jobCategory, setJobCategory] = useState<string>('')
    const [search, setSearch] = useState<string>('')
    const [message, setMessage] = useState<string>('')
    const [isSearching, setIsSearching] = useState<boolean>(false)
    const [activeCategory, setActiveCategory] = useState<string>('')

    // Derived values
    const displayedJobs = activeCategory
        ? jobBatch.filter(job => job.category === activeCategory)
        : jobBatch;
    const visibleJobs = slicePage(displayedJobs, currentPage);
    const effectiveTotal = activeCategory ? displayedJobs.length : totalJobs;
    const totalPages = Math.ceil(effectiveTotal / PAGE_SIZE);

    async function runSearch(term: string, category: string) {
        setIsSearching(true);
        try {
            const response = await axios.get(`${searchJobs}/${category || 'undefined'}/${encodeURIComponent(term || '.*')}`);
            const data = response.data;
            const results: JobsType[] = data.job_list ?? [];
            setJobBatch(results);
            setTotalJobs(results.length);
            setBatchSkipLoaded(-1);
            setMessage('');
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response?.data?.error) {
                setMessage(error.response.data.error);
                setJobBatch([]);
                setTotalJobs(0);
            }
        } finally {
            setIsSearching(false);
        }
    }

    async function fetchJobs(page = 1) {
        const skip = calcBatchSkip(page);
        if (skip === batchSkipLoaded) return;
        setIsSearching(true);
        try {
            const response = await axios.get(`${getAllJobs}?skip=${skip}&limit=${BATCH_SIZE}`);
            const data = response.data;
            setJobBatch(data.reversedJobList ?? []);
            setTotalJobs(data.total ?? 0);
            setBatchSkipLoaded(skip);
            setMessage('');
        } catch (error: unknown) {
            setMessage('NE1-Freelance is currently under maintenance.');
            if (axios.isAxiosError(error) && error.response?.data?.error === 404) {
                setMessage(error.response.data.error);
            }
        } finally {
            setIsSearching(false);
        }
    }

    function handlePageChange(page: number) {
        setCurrentPage(page);
        fetchJobs(page);
    }

    async function handleSearchSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setActiveCategory('');
        setCurrentPage(1);
        await runSearch(search, jobCategory);
    }

    function filterByCategory(categoryName: string) {
        setActiveCategory(categoryName);
        setJobCategory(categoryName);
        setCurrentPage(1);
        setMessage('');
    }

    useEffect(() => {
        const initCategory = searchParams.get('category') ?? '';
        const initSearch = searchParams.get('search') ?? '';

        setSession(getUserSession() ?? undefined);
        if (initCategory) { setActiveCategory(initCategory); setJobCategory(initCategory); }
        if (initSearch) setSearch(initSearch);

        fetchCategories(setJobCategories, getCategories);

        if (initSearch) {
            runSearch(initSearch, initCategory);
        } else {
            fetchJobs(1);
        }
    }, []);

    return (
        <>
            <GlobalNavbar session={session} />

            <main className="min-h-screen bg-gray-50">
                {/* Search Header */}
                <div className="bg-gray-900 px-6 py-10">
                    <div className="max-w-4xl mx-auto">
                        <h1 className="text-white text-3xl font-bold mb-6">Available Jobs</h1>
                        <form onSubmit={handleSearchSubmit} className="flex flex-col sm:flex-row gap-3">
                            <Input
                                className="bg-white flex-1 h-11"
                                type="text"
                                placeholder="Search for a job..."
                                name="search"
                                value={search}
                                onChange={(event) => setSearch(event.target.value)}
                            />
                            <select
                                className="h-11 px-3 rounded-md border border-input bg-white text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                                name="category"
                                value={jobCategory}
                                onChange={(event) => { setJobCategory(event.target.value); setActiveCategory(event.target.value); }}
                            >
                                <option value="">All categories</option>
                                {jobCategories?.map(category => (
                                    <option value={category.name} key={category._id ?? category.name}>{category.name}</option>
                                ))}
                            </select>
                            <Button type="submit" disabled={isSearching} className="h-11 px-6">
                                {isSearching ? 'Searching...' : 'Search'}
                            </Button>
                        </form>

                        {/* Category filter chips */}
                        {jobCategories.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-4">
                                <button
                                    type="button"
                                    onClick={() => { setActiveCategory(''); setJobCategory(''); setCurrentPage(1); setBatchSkipLoaded(-1); fetchJobs(1); }}
                                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${activeCategory === '' ? 'bg-[#fd8700] text-white border-[#fd8700]' : 'bg-white/10 text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white'}`}
                                >
                                    All
                                </button>
                                {jobCategories.map(cat => (
                                    <button
                                        key={cat._id ?? cat.name}
                                        type="button"
                                        onClick={() => filterByCategory(cat.name)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium transition-colors border ${activeCategory === cat.name ? 'bg-[#fd8700] text-white border-[#fd8700]' : 'bg-white/10 text-gray-300 border-gray-600 hover:border-gray-400 hover:text-white'}`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Job Grid */}
                <div className="max-w-7xl mx-auto px-6 py-10">
                    {visibleJobs.length > 0 ? (
                        <>
                            <p className="text-sm text-muted-foreground mb-5">
                                Showing <span className="font-medium text-gray-900">{effectiveTotal}</span> {effectiveTotal === 1 ? 'job' : 'jobs'}
                                {activeCategory && <> in <span className="font-medium text-gray-900">{activeCategory}</span></>}
                            </p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                                {visibleJobs.map((job) => (
                                    <Card
                                        key={job._id}
                                        className="overflow-hidden cursor-pointer hover:shadow-lg transition-shadow group"
                                        onClick={() => router.push(`/jobs/${job._id}`)}
                                    >
                                        <div className="aspect-video relative overflow-hidden bg-gray-100">
                                            <ThumbnailImage
                                                src={job.thumbnail}
                                                alt="job thumbnail"
                                                fill
                                                className="object-cover transition-transform duration-300 group-hover:scale-105"
                                                unoptimized
                                            />
                                            <div className="absolute top-2 right-2">
                                                <span className="bg-[#fd8700] text-white text-xs font-bold px-2 py-1 rounded-lg shadow">
                                                    ${job.price}
                                                </span>
                                            </div>
                                        </div>
                                        <CardContent className="p-4">
                                            <h3 className="font-semibold text-gray-900 text-sm leading-snug mb-1 line-clamp-2">{job.title}</h3>
                                            {job.description && (
                                                <p className="text-xs text-muted-foreground line-clamp-2 mb-2">{job.description}</p>
                                            )}
                                            <div className="flex items-center justify-between mt-2">
                                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                    {job.username}
                                                </div>
                                                <Badge variant="secondary" className="text-xs">{job.category}</Badge>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>

                            <div className="mt-6">
                                <Pagination
                                    currentPage={currentPage}
                                    totalPages={totalPages}
                                    onPageChange={handlePageChange}
                                    pageSize={PAGE_SIZE}
                                    totalItems={effectiveTotal}
                                />
                            </div>
                        </>
                    ) : (
                        <div className="text-center py-24">
                            {isSearching ? (
                                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                            ) : (
                                <p className="text-gray-500 text-lg">{message || 'No jobs found.'}</p>
                            )}
                        </div>
                    )}
                </div>
            </main>
        </>
    )
}
