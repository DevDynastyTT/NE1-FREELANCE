'use client'

import ThumbnailImage from '@/components/ThumbnailImage';
import { useRouter } from 'next/navigation';

const SERVICES = [
    {
        label: 'Transportation',
        tagline: 'Efficient car solutions',
        image: '/images/transportation.jpeg',
    },
    {
        label: 'Cleaning',
        tagline: 'Get your space spotless',
        image: '/images/cleaning.jpeg',
    },
    {
        label: 'Esthetics',
        tagline: 'Enhance your appearance',
        image: '/images/esthetics.jpeg',
    },
    {
        label: 'Administration',
        tagline: 'Streamline your operations',
        image: '/images/administration.jpeg',
    },
]

export default function ServicesBanner() {
    const router = useRouter();

    return (
        <section className="py-16 px-6 max-w-7xl mx-auto">
            <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900">Top Services</h2>
                <p className="text-gray-500 mt-2">Browse our most popular categories</p>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {SERVICES.map((service) => (
                    <div
                        key={service.label}
                        onClick={() => router.push(`/jobs?category=${encodeURIComponent(service.label)}`)}
                        className="group relative rounded-2xl overflow-hidden cursor-pointer aspect-[3/4] shadow-md hover:shadow-xl transition-shadow"
                    >
                        <ThumbnailImage
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            src={service.image}
                            alt={`${service.label} services`}
                            fill
                            sizes="(max-width: 768px) 50vw, 25vw"
                        />
                        {/* Gradient overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

                        {/* Text */}
                        <div className="absolute bottom-0 left-0 right-0 p-4">
                            <p className="text-white/80 text-xs font-medium mb-1">{service.tagline}</p>
                            <p className="text-white text-lg font-bold">{service.label}</p>
                        </div>

                        {/* Hover badge */}
                        <div className="absolute top-3 right-3 bg-[#fd8700] text-white text-xs font-semibold px-3 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                            Browse →
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
