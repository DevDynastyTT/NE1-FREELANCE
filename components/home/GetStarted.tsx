'use client'

import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function GetStarted() {
    const router = useRouter()

    return (
        <section className="py-20 px-6">
            <div className="max-w-5xl mx-auto bg-gray-900 rounded-3xl overflow-hidden flex flex-col md:flex-row items-center">

                {/* Text */}
                <div className="flex-1 px-10 py-12">
                    <p className="text-[#fd8700] text-sm font-semibold uppercase tracking-wider mb-3">Get started today</p>
                    <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight mb-6">
                        Unlock your business&apos;s potential<br />
                        <span className="italic text-gray-300">with the right talent.</span>
                    </h2>
                    <p className="text-gray-400 text-base mb-8 max-w-sm">
                        Join hundreds of businesses already growing with NE1 Freelance.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={() => router.push('/auth/signup')}
                            className="bg-[#fd8700] hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                        >
                            Create Free Account
                        </button>
                        <button
                            onClick={() => router.push('/jobs')}
                            className="border border-white/20 text-white hover:bg-white/10 font-semibold px-8 py-3 rounded-full transition-colors text-sm"
                        >
                            Browse Jobs
                        </button>
                    </div>
                </div>

                {/* Image */}
                <div className="flex-shrink-0 w-full md:w-80 h-64 md:h-auto relative">
                    <Image
                        src="/images/man.png"
                        alt="Excited freelancer"
                        width={320}
                        height={400}
                        className="w-full h-full object-contain object-bottom"
                    />
                </div>
            </div>
        </section>
    )
}
