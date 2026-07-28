'use client'

import GlobalFooter from '@/components/GlobalFooter'
import GlobalNavbar from '@/components/GlobalNavbar'
import { SessionType } from "@/utils/types";
import { useEffect, useState } from 'react'
import axios from 'axios'
import { getAboutInfo } from "@/utils/APIRoutes"
import Image from 'next/image';
import { getUserSession } from '@/utils/reuseableCode';
import { Separator } from '@/components/ui/separator';

export default function AboutUsComponent() {
    const [session, setSession] = useState<SessionType>()
    const [information, setInformation] = useState<string>()

    async function about() {
        try {
            const response = await axios.get(getAboutInfo)
            const data = response.data
            if (data.error) { console.log(data.error); return; }
            setInformation(data.information)
        } catch (error) {
            console.log("Error:", error)
        }
    }

    useEffect(() => {
        const isAuthenticated = getUserSession()
        if (isAuthenticated) setSession(isAuthenticated)
        about()
    }, [])

    const aboutText = information || 'NE1 Freelance connects local businesses with skilled freelancers across Trinidad. We believe in fair, project-based pricing and a safe, trusted marketplace for everyone.'

    return (
        <div className="flex flex-col flex-1">
            <GlobalNavbar session={session} />

            <main>
                {/* Hero */}
                <section className="bg-gray-900 text-white py-20 px-6 text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">About NE1 Freelance</h1>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Connecting local talent with businesses that need them.
                    </p>
                </section>

                {/* Content */}
                <section className="max-w-5xl mx-auto px-6 py-16">
                    <div className="flex flex-col md:flex-row items-start gap-12">
                        <div className="flex-shrink-0 mx-auto md:mx-0">
                            <div className="rounded-2xl overflow-hidden shadow-lg w-72 h-72 relative">
                                <Image
                                    src="/images/brandon.jpeg"
                                    alt="Founder"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h2 className="text-2xl font-bold text-gray-900 mb-4">Our Story</h2>
                            <Separator className="mb-6" />
                            <p className="text-gray-600 leading-relaxed text-base">{aboutText}</p>
                        </div>
                    </div>
                </section>

                {/* Values */}
                <section className="bg-gray-50 py-16 px-6">
                    <div className="max-w-5xl mx-auto">
                        <h2 className="text-2xl font-bold text-gray-900 mb-10 text-center">What We Stand For</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            {[
                                { title: 'Local First', body: 'We prioritize connecting businesses with talent in their own community.' },
                                { title: 'Fair Pricing', body: 'Project-based pricing with no hidden fees or hourly surprises.' },
                                { title: 'Trust & Safety', body: 'Verified freelancers, secure payments, and 24/7 support.' },
                            ].map(item => (
                                <div key={item.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center mb-4">
                                        <span className="text-primary text-lg font-bold">✓</span>
                                    </div>
                                    <h3 className="font-semibold text-gray-900 mb-2">{item.title}</h3>
                                    <p className="text-gray-500 text-sm">{item.body}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            </main>

            <GlobalFooter />
        </div>
    )
}
