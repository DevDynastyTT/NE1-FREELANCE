'use client'

import GlobalNavbar from "@/components/GlobalNavbar";
import GlobalFooter from "@/components/GlobalFooter";
import axios from "axios";
import Link from "next/link";
import { FormEvent, useState, useEffect } from "react";
import { sendEmailRoute } from "@/utils/APIRoutes";
import { SessionType } from "@/utils/types";
import { getUserSession } from "@/utils/reuseableCode";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactComponent() {
    const [name, setName] = useState<string>();
    const [userEmail, setUserEmail] = useState<string>();
    const [message, setMessage] = useState<string>();
    const [status, setStatus] = useState<string>();
    const [isLoading, setIsLoading] = useState(false)
    const [session, setSession] = useState<SessionType>()

    async function handleContact(event: FormEvent) {
        event.preventDefault();
        setIsLoading(true)
        try {
            const response = await axios.post(sendEmailRoute, { name, userEmail, message })
            const data = response.data
            if (data.error) { setStatus(data.error); return; }
            setStatus(data.message)
        } catch (error) {
            console.log(error)
            setStatus('Failed to send message. Please try again.')
        } finally {
            setIsLoading(false)
        }
    };

    useEffect(() => {
        const isAuthenticated = getUserSession()
        if (isAuthenticated) setSession(isAuthenticated)
    }, []);

    return (
        <div className="flex flex-col flex-1">
            <GlobalNavbar session={session} />

            <main className="flex-1">
                {/* Hero */}
                <section className="bg-gray-900 text-white py-16 px-6 text-center">
                    <h1 className="text-4xl font-bold mb-3">Get in Touch</h1>
                    <p className="text-gray-400 text-lg max-w-xl mx-auto">
                        Have a question or want to work with us? We&apos;d love to hear from you.
                    </p>
                </section>

                <section className="max-w-5xl mx-auto px-6 py-16">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">

                        {/* Contact Info */}
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 mb-6">Contact Information</h2>
                            <div className="space-y-5">
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Location</p>
                                        <p className="text-gray-500 text-sm">Port of Spain, Trinidad</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Phone</p>
                                        <p className="text-gray-500 text-sm">(868) 738-8075</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 text-primary">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-medium text-gray-900">Email</p>
                                        <Link href="mailto:868drgnstudio@gmail.com" className="text-primary text-sm hover:underline">
                                            868drgnstudio@gmail.com
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Form */}
                        <Card className="shadow-sm">
                            <CardContent className="pt-6">
                                {status && (
                                    <div className="mb-4 p-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
                                        {status}
                                    </div>
                                )}
                                <form onSubmit={handleContact} className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" type="text" placeholder="Your name" required onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input id="email" type="email" placeholder="your@email.com" required onChange={(e) => setUserEmail(e.target.value)} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="message">Message</Label>
                                        <Textarea id="message" rows={5} placeholder="Write your message here..." required onChange={(e) => setMessage(e.target.value)} />
                                    </div>
                                    <Button type="submit" className="w-full" disabled={isLoading}>
                                        {isLoading ? "Sending..." : "Send Message"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </div>
                </section>
            </main>
            <GlobalFooter />
        </div>
    );
}
