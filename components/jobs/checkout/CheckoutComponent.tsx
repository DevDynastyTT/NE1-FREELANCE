'use client'

import { useState, useEffect, FormEvent, ChangeEvent } from 'react';
import { useParams, useRouter } from 'next/navigation';
import GlobalNavbar from '@/components/GlobalNavbar';
import { getUserSession } from '@/utils/reuseableCode';
import { jobDetails } from '@/utils/APIRoutes';
import { SessionType, JobDetails } from '@/utils/types';
import axios from 'axios';
import Link from 'next/link';
import ThumbnailImage from '@/components/ThumbnailImage';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';

function cardType(num: string): string {
    const cleaned = num.replace(/\D/g, '');
    if (/^4/.test(cleaned)) return 'Visa';
    if (/^5[1-5]/.test(cleaned) || /^2[2-7]/.test(cleaned)) return 'Mastercard';
    if (/^3[47]/.test(cleaned)) return 'Amex';
    if (/^6(?:011|5)/.test(cleaned)) return 'Discover';
    return '';
}

function formatCardNumber(value: string): string {
    return value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
}

function formatExpiry(value: string): string {
    const digits = value.replace(/\D/g, '').slice(0, 4);
    if (digits.length >= 3) return digits.slice(0, 2) + '/' + digits.slice(2);
    return digits;
}

function validateExpiry(value: string): boolean {
    const match = value.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;
    const month = parseInt(match[1], 10);
    const year = 2000 + parseInt(match[2], 10);
    if (month < 1 || month > 12) return false;
    const now = new Date();
    return year > now.getFullYear() || (year === now.getFullYear() && month >= now.getMonth() + 1);
}

const SERVICE_FEE = 2.50;

type FieldErrors = Record<string, string>;

export default function CheckoutComponent() {
    const { id } = useParams();
    const router = useRouter();
    const [session, setSession] = useState<SessionType>();
    const [job, setJob] = useState<JobDetails | null>(null);
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);

    const [cardNumber, setCardNumber] = useState('');
    const [expiry, setExpiry] = useState('');
    const [cvv, setCvv] = useState('');
    const [nameOnCard, setNameOnCard] = useState('');
    const [errors, setErrors] = useState<FieldErrors>({});

    useEffect(() => {
        const userSession = getUserSession();
        if (!userSession) { router.push('/auth/login'); return; }
        setSession(userSession);
        axios.get(`${jobDetails}/${id}`).then(res => {
            const data = res.data;
            if (data.jobDetails?.[0]) setJob(data.jobDetails[0]);
        }).catch(console.log);
    }, []);

    function handleCardChange(event: ChangeEvent<HTMLInputElement>) {
        setCardNumber(formatCardNumber(event.target.value));
    }

    function handleExpiryChange(event: ChangeEvent<HTMLInputElement>) {
        setExpiry(formatExpiry(event.target.value));
    }

    function handleCvvChange(event: ChangeEvent<HTMLInputElement>) {
        const type = cardType(cardNumber);
        const maxLen = type === 'Amex' ? 4 : 3;
        setCvv(event.target.value.replace(/\D/g, '').slice(0, maxLen));
    }

    function validate(): boolean {
        const errs: FieldErrors = {};
        const cleanCard = cardNumber.replace(/\D/g, '');
        if (!nameOnCard.trim()) errs.nameOnCard = 'Name on card is required.';
        if (cleanCard.length < 13 || cleanCard.length > 19) errs.cardNumber = 'Enter a valid card number.';
        if (!validateExpiry(expiry)) errs.expiry = 'Enter a valid expiry date (MM/YY) that is not in the past.';
        const cvvLen = cardType(cardNumber) === 'Amex' ? 4 : 3;
        if (cvv.length !== cvvLen) errs.cvv = `CVV must be ${cvvLen} digits.`;
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();
        if (!validate()) return;
        setLoading(true);
        // Simulate processing delay (no real charge)
        setTimeout(() => {
            setLoading(false);
            setSuccess(true);
        }, 1800);
    }

    if (!job) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
    );

    const total = (job.price ?? 0) + SERVICE_FEE;
    const type = cardType(cardNumber);

    if (success) return (
        <>
            <GlobalNavbar session={session} />
            <main className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-16">
                <Card className="max-w-md w-full shadow-lg text-center">
                    <CardContent className="pt-10 pb-10 space-y-4">
                        <div className="w-16 h-16 mx-auto rounded-full bg-green-100 flex items-center justify-center">
                            <svg className="w-8 h-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-gray-900">Order Placed!</h2>
                            <p className="text-muted-foreground text-sm mt-1">Your order has been received and is being processed.</p>
                        </div>
                        <div className="bg-gray-50 rounded-xl p-4 text-left space-y-2">
                            <p className="text-sm font-medium text-gray-900">{job.title}</p>
                            <p className="text-xs text-muted-foreground">Freelancer: {job.username}</p>
                            <p className="text-sm font-bold text-gray-900">Total charged: ${total.toFixed(2)}</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                            A confirmation message will be sent to your inbox. The freelancer will reach out shortly.
                        </p>
                        <div className="flex gap-3 pt-2">
                            <Button variant="outline" className="flex-1" asChild>
                                <Link href="/jobs">Browse more jobs</Link>
                            </Button>
                            <Button className="flex-1" asChild>
                                <Link href="/inbox">Open Inbox</Link>
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </main>
        </>
    );

    return (
        <>
            <GlobalNavbar session={session} />
            <main className="min-h-screen bg-gray-50 py-10 px-4">
                <div className="max-w-5xl mx-auto">

                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
                        <Link href="/jobs" className="hover:text-gray-900">Jobs</Link>
                        <span>/</span>
                        <Link href={`/jobs/${id}`} className="hover:text-gray-900 line-clamp-1 max-w-xs">{job.title}</Link>
                        <span>/</span>
                        <span className="text-gray-900 font-medium">Checkout</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">

                        {/* Payment form */}
                        <div className="lg:col-span-3">
                            <Card className="shadow-sm">
                                <CardHeader>
                                    <CardTitle className="text-xl">Payment details</CardTitle>
                                    <p className="text-sm text-muted-foreground mt-1">Your card information is never stored.</p>
                                </CardHeader>
                                <CardContent>
                                    <form onSubmit={handleSubmit} noValidate className="space-y-5">

                                        <div className="space-y-2">
                                            <Label htmlFor="nameOnCard">Name on card</Label>
                                            <Input
                                                id="nameOnCard"
                                                type="text"
                                                placeholder="Jordan Blake"
                                                value={nameOnCard}
                                                onChange={event => setNameOnCard(event.target.value)}
                                                autoComplete="cc-name"
                                            />
                                            {errors.nameOnCard && <p className="text-xs text-red-500">{errors.nameOnCard}</p>}
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="cardNumber">Card number</Label>
                                            <div className="relative">
                                                <Input
                                                    id="cardNumber"
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="1234 5678 9012 3456"
                                                    value={cardNumber}
                                                    onChange={handleCardChange}
                                                    autoComplete="cc-number"
                                                    className="pr-20"
                                                />
                                                {type && (
                                                    <Badge variant="secondary" className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold">
                                                        {type}
                                                    </Badge>
                                                )}
                                            </div>
                                            {errors.cardNumber && <p className="text-xs text-red-500">{errors.cardNumber}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="expiry">Expiry date</Label>
                                                <Input
                                                    id="expiry"
                                                    type="text"
                                                    inputMode="numeric"
                                                    placeholder="MM/YY"
                                                    value={expiry}
                                                    onChange={handleExpiryChange}
                                                    autoComplete="cc-exp"
                                                />
                                                {errors.expiry && <p className="text-xs text-red-500">{errors.expiry}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label htmlFor="cvv">CVV</Label>
                                                <Input
                                                    id="cvv"
                                                    type="password"
                                                    inputMode="numeric"
                                                    placeholder={type === 'Amex' ? '4 digits' : '3 digits'}
                                                    value={cvv}
                                                    onChange={handleCvvChange}
                                                    autoComplete="cc-csc"
                                                />
                                                {errors.cvv && <p className="text-xs text-red-500">{errors.cvv}</p>}
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 text-xs text-blue-700">
                                            <svg className="w-4 h-4 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                            </svg>
                                            Payments are encrypted and processed securely. We do not store your card details.
                                        </div>

                                        <Button type="submit" className="w-full text-base py-5" disabled={loading}>
                                            {loading ? (
                                                <span className="flex items-center gap-2">
                                                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                    Processing…
                                                </span>
                                            ) : (
                                                `Pay $${total.toFixed(2)}`
                                            )}
                                        </Button>
                                    </form>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Order summary */}
                        <div className="lg:col-span-2">
                            <Card className="shadow-sm sticky top-20">
                                <CardHeader>
                                    <CardTitle className="text-base">Order summary</CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-start gap-3">
                                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                            <ThumbnailImage src={job.thumbnail} alt="Job thumbnail" className="w-full h-full object-cover" fallbackClassName="w-16 h-16" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium text-sm text-gray-900 line-clamp-2">{job.title}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">by {job.username}</p>
                                            <Badge variant="secondary" className="text-xs mt-1">{job.category}</Badge>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Job price</span>
                                            <span>${(job.price ?? 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-muted-foreground">Service fee</span>
                                            <span>${SERVICE_FEE.toFixed(2)}</span>
                                        </div>
                                    </div>

                                    <Separator />

                                    <div className="flex justify-between font-bold text-lg">
                                        <span>Total</span>
                                        <span>${total.toFixed(2)}</span>
                                    </div>

                                    <div className="space-y-1.5 pt-1">
                                        {['Secure payment', 'Money-back guarantee', 'Cancel anytime'].map(item => (
                                            <p key={item} className="text-xs text-muted-foreground flex items-center gap-1.5">
                                                <span className="text-green-500 font-bold">✓</span> {item}
                                            </p>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                    </div>
                </div>
            </main>
        </>
    );
}
