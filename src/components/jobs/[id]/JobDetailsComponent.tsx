'use client'

import ReportForm from '@/components/jobs/ReportForm';
import RatingForm from '@/components/RatingsForm';
import GlobalNavbar from "@/components/GlobalNavbar";
import { AllRatings, Ratings, JobDetails, SessionType } from '@/utils/types';
import { jobDetails, getRatings, getAllRatings, getFreelancerRatings, getFreelancerRatingsProgress } from '@/utils/APIRoutes'
import axios from 'axios';
import Link from 'next/link';
import ThumbnailImage from '@/components/ThumbnailImage'
import { useEffect, useState } from 'react'
import { getUserSession } from '@/utils/reuseableCode';
import { useRouter, useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function formatDate(dateStr: string) {
    if (!dateStr) return '';
    return new Intl.DateTimeFormat('en-US', { year: 'numeric', month: 'short', day: 'numeric' }).format(new Date(dateStr));
}

function StarDisplay({ rating, size = 16 }: { rating: number; size?: number }) {
    return (
        <div className="flex items-center gap-0.5">
            {[1, 2, 3, 4, 5].map(star => {
                const filled = star <= Math.floor(rating);
                const partial = !filled && star === Math.ceil(rating) && rating % 1 > 0;
                const pct = partial ? Math.round((rating % 1) * 100) : 0;
                return (
                    <svg key={star} width={size} height={size} viewBox="0 0 24 24" className="flex-shrink-0">
                        <defs>
                            <linearGradient id={`grad-${star}-${size}`}>
                                <stop offset={`${pct}%`} stopColor="#fd8700" />
                                <stop offset={`${pct}%`} stopColor="#e5e7eb" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"
                            fill={filled ? '#fd8700' : partial ? `url(#grad-${star}-${size})` : '#e5e7eb'}
                            stroke="none"
                        />
                    </svg>
                );
            })}
        </div>
    );
}

export default function JobDetailsComponent() {
    const router = useRouter()
    const { id } = useParams()
    const [session, setSession] = useState<SessionType>()
    const [jobs, setJobs] = useState<JobDetails[]>([])
    const [jobFee, setJobFee] = useState<number>(0)
    const [totalFee, setTotalFee] = useState<number>(0)
    const serviceFee: number = 2.50

    const [averageRating, setAverageRating] = useState<number>(0)
    const [userRatings, setUserRatings] = useState<Ratings[]>([])
    const [allRatings, setAllRatings] = useState<AllRatings[]>([])
    const [freeLancerRatings, setFreeLancerRatings] = useState<number>(0)
    const [freeLancerRatingsProgress, setFreeLancerRatingsProgress] = useState<Record<string, number>>({})
    const [reportForm, setReportForm] = useState<boolean>(false)
    const [formType, setFormType] = useState<string>('insert')

    const ratingCounts = { 5: freeLancerRatingsProgress['5'] || 0, 4: freeLancerRatingsProgress['4'] || 0, 3: freeLancerRatingsProgress['3'] || 0, 2: freeLancerRatingsProgress['2'] || 0, 1: freeLancerRatingsProgress['1'] || 0 };
    const totalRatings = Object.values(ratingCounts).reduce((sum, count) => sum + count, 0);

    function fetchRatings() {
        axios.post(getRatings, { jobID: jobs[0]?._id, freeLancerID: jobs[0]?.freeLancerID, userID: session?._id })
            .then(res => setUserRatings(res.data.rating ? [res.data.rating] : []))
            .catch(console.log);
    }

    function fetchFreelancerRatingsProgress() {
        axios.post(getFreelancerRatingsProgress, { jobID: jobs[0]?._id, freeLancerID: jobs[0]?.freeLancerID })
            .then(res => {
                const map: Record<string, number> = {};
                (res.data as { _id: number; count: number }[]).forEach(item => {
                    map[String(item._id)] = item.count;
                });
                setFreeLancerRatingsProgress(map);
            })
            .catch(console.log);
    }

    function fetchAllRatings() {
        axios.post(getAllRatings, { jobID: jobs[0]?._id, freeLancerID: jobs[0]?.freeLancerID })
            .then(res => setAllRatings(Array.isArray(res.data) ? res.data : []))
            .catch(console.log);
    }

    function fetchFreelancerRatings() {
        axios.post(getFreelancerRatings, { jobID: jobs[0]?._id, freeLancerID: jobs[0]?.freeLancerID })
            .then(res => {
                const { totalRating, count } = res.data as { totalRating: number; count: number };
                setFreeLancerRatings(count ?? 0);
                setAverageRating(count > 0 ? Math.min(totalRating / count, 5) : 0);
            })
            .catch(console.log);
    }

    function fetchJobDetails() {
        axios.get(`${jobDetails}/${id}`)
            .then(res => {
                const data = res.data;
                if (data.error) return;
                setJobs(data.jobDetails);
                setJobFee(data.jobDetails[0].price);
                setTotalFee(serviceFee + data.jobDetails[0].price);
            })
            .catch(console.log);
    }

    useEffect(() => {
        const userSession = getUserSession();
        setSession(userSession);
        fetchJobDetails();
    }, []);

    useEffect(() => {
        if (jobs?.length > 0) {
            fetchRatings();
            fetchAllRatings();
            fetchFreelancerRatings();
            fetchFreelancerRatingsProgress();
        }
    }, [jobs]);

    if (!jobs?.length) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const job = jobs[0];

    const reportInfo = [{
        _id: job._id,
        jobTitle: job.title,
        userID: session?._id ?? '',
        freeLancerID: job.freeLancerID,
    }];

    return (
        <>
            <GlobalNavbar session={session} />

            <main className="min-h-screen bg-gray-50 py-8 px-4">
                <div className="max-w-6xl mx-auto">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
                        <Link href="/jobs" className="hover:text-gray-900 transition-colors">Jobs</Link>
                        <span>/</span>
                        <span className="text-gray-500">{job.category}</span>
                        <span>/</span>
                        <span className="text-gray-900 font-medium line-clamp-1 max-w-xs">{job.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                        {/* Left: Job info */}
                        <div className="lg:col-span-2 space-y-6">
                            <div>
                                <div className="flex items-center gap-2 mb-2">
                                    <Badge variant="secondary">{job.category}</Badge>
                                </div>
                                <h1 className="text-2xl font-bold text-gray-900 mb-4">{job.title}</h1>

                                {/* Freelancer card */}
                                <Card className="bg-gray-50 border-gray-200">
                                    <CardContent className="pt-4 pb-4">
                                        <div className="flex items-start gap-4">
                                            <Avatar className="w-14 h-14 flex-shrink-0">
                                                <AvatarImage src={job.profilePicture ?? '/images/default.png'} alt={job.username} />
                                                <AvatarFallback className="text-lg">{job.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                            </Avatar>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-gray-900">{job.username}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <StarDisplay rating={averageRating} size={16} />
                                                    <span className="text-xs text-muted-foreground">
                                                        {averageRating > 0 ? averageRating.toFixed(1) : 'No ratings'} &bull; {freeLancerRatings} {freeLancerRatings === 1 ? 'review' : 'reviews'}
                                                    </span>
                                                </div>
                                                {job.userBio && (
                                                    <p className="text-sm text-gray-600 mt-2 leading-relaxed">{job.userBio}</p>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Thumbnail */}
                            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-white">
                                <ThumbnailImage src={job.thumbnail} alt="Job thumbnail" className="w-full object-cover max-h-[28rem]" fallbackClassName="min-h-56" />
                            </div>

                            {/* Description */}
                            {job.description && (
                                <Card>
                                    <CardHeader>
                                        <CardTitle className="text-base">About this service</CardTitle>
                                    </CardHeader>
                                    <CardContent>
                                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">{job.description}</p>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Rating summary + bars */}
                            {totalRatings > 0 && (
                                <Card>
                                    <CardContent className="pt-6">
                                        <div className="flex items-start gap-6 mb-5">
                                            <div className="text-center">
                                                <p className="text-5xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                                                <StarDisplay rating={averageRating} size={18} />
                                                <p className="text-xs text-muted-foreground mt-1">{totalRatings} review{totalRatings !== 1 ? 's' : ''}</p>
                                            </div>
                                            <div className="flex-1 space-y-2">
                                                {([5, 4, 3, 2, 1] as const).map(star => {
                                                    const pct = totalRatings ? Math.round((ratingCounts[star] / totalRatings) * 100) : 0;
                                                    return (
                                                        <div key={star} className="flex items-center gap-3 text-sm">
                                                            <span className="w-4 text-gray-500 text-xs text-right">{star}</span>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="#fd8700"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                                            <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                                                                <div className="bg-[#fd8700] h-2 rounded-full transition-all" style={{ width: `${pct}%` }} />
                                                            </div>
                                                            <span className="text-muted-foreground w-10 text-right text-xs">{pct}%</span>
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            )}

                            {/* Reviews */}
                            <div>
                                <h2 className="text-lg font-bold text-gray-900 mb-4">
                                    Reviews {allRatings.length > 0 && <span className="text-muted-foreground font-normal text-base">({allRatings.length})</span>}
                                </h2>

                                {/* Leave / edit review */}
                                {session && userRatings.length === 0 && (
                                    <RatingForm jobID={job._id} clientID={session._id} freeLancerID={job.freeLancerID} formType={formType} />
                                )}
                                {userRatings.length > 0 && (
                                    <Card className="mb-4 border-orange-200 bg-orange-50/40">
                                        <CardContent className="pt-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <p className="font-medium text-sm">Your Review</p>
                                                <Button variant="ghost" size="sm" className="text-xs h-7" onClick={() => { setFormType('update'); setUserRatings([]); }}>
                                                    Edit
                                                </Button>
                                            </div>
                                            <StarDisplay rating={userRatings[0]?.ratings ?? 0} size={16} />
                                            <p className="text-sm text-gray-600 mt-2">{userRatings[0]?.feedback}</p>
                                            {userRatings[0]?.date && (
                                                <p className="text-xs text-muted-foreground mt-1">{formatDate(userRatings[0].date)}</p>
                                            )}
                                        </CardContent>
                                    </Card>
                                )}

                                {/* All reviews */}
                                {allRatings.length > 0 ? (
                                    <div className="space-y-3">
                                        {allRatings.map((rating, index) => (
                                            <Card key={index}>
                                                <CardContent className="pt-4">
                                                    <div className="flex items-start gap-3">
                                                        <Avatar className="w-9 h-9 flex-shrink-0">
                                                            <AvatarFallback className="text-xs bg-gray-100">{rating.username?.charAt(0).toUpperCase()}</AvatarFallback>
                                                        </Avatar>
                                                        <div className="flex-1 min-w-0">
                                                            <div className="flex items-center justify-between gap-2 flex-wrap">
                                                                <p className="font-medium text-sm">{rating.username}</p>
                                                                {rating.date && (
                                                                    <p className="text-xs text-muted-foreground">{formatDate(rating.date)}</p>
                                                                )}
                                                            </div>
                                                            <StarDisplay rating={rating.ratings} size={14} />
                                                            {rating.feedback && (
                                                                <p className="text-sm text-gray-600 mt-1.5 leading-relaxed">{rating.feedback}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 border border-dashed border-gray-200 rounded-xl">
                                        <p className="text-muted-foreground text-sm">No reviews yet. Be the first to leave one.</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Right: Order card */}
                        <div className="space-y-4">
                            <Card className="shadow-md sticky top-20">
                                <CardContent className="pt-6 space-y-4">
                                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100">
                                        <ThumbnailImage src={job.thumbnail} alt="" className="w-full h-full object-cover" />
                                    </div>
                                    <p className="font-medium text-sm text-gray-900 leading-snug">{job.title}</p>
                                    <Separator />
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Job price</span>
                                        <span>${jobFee.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-muted-foreground">Service fee</span>
                                        <span>${serviceFee.toFixed(2)}</span>
                                    </div>
                                    <Separator />
                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${totalFee.toFixed(2)}</span>
                                    </div>

                                    {/* Trust signals */}
                                    <div className="space-y-1.5 pt-1">
                                        {['Project-based pricing', 'No hidden fees', 'Secure checkout'].map(signal => (
                                            <p key={signal} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <span className="text-green-500 font-bold">✓</span> {signal}
                                            </p>
                                        ))}
                                    </div>

                                    {job.freeLancerID !== session?._id ? (
                                        session?._id ? (
                                            <div className="space-y-2 pt-2">
                                                <Button className="w-full text-base py-5" onClick={() => router.push(`/jobs/${job._id}/checkout`)}>
                                                    Continue to Checkout →
                                                </Button>
                                                <Button variant="ghost" size="sm" className="w-full text-xs text-muted-foreground hover:text-red-500" onClick={() => setReportForm(true)}>
                                                    Report this listing
                                                </Button>
                                            </div>
                                        ) : (
                                            <Button variant="secondary" className="w-full" asChild>
                                                <Link href="/auth/login">Log in to hire {job.username}</Link>
                                            </Button>
                                        )
                                    ) : (
                                        <p className="text-xs text-muted-foreground text-center pt-2 bg-gray-50 rounded-lg py-3">
                                            This is your listing — you cannot purchase your own service.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>

                <ReportForm showForm={reportForm} setReportForm={setReportForm} jobInfo={reportInfo} />
            </main>
        </>
    )
}
