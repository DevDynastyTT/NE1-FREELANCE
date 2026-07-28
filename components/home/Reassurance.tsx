import Image from "next/image";

const FEATURES = [
    {
        title: 'Best value for every budget',
        body: 'Superior services at every price point. No hourly charges — solely project-based pricing.',
    },
    {
        title: 'Quality work, delivered fast',
        body: 'Find the right freelancer and start your project within minutes.',
    },
    {
        title: 'Secure payments, always',
        body: 'Know exactly what you pay upfront. Funds only release once you approve the work.',
    },
    {
        title: '24/7 support',
        body: 'Our round-the-clock team is on hand to help you, anytime and anywhere.',
    },
]

export default function Reassurance() {
    return (
        <section className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center gap-16">

                {/* Left: image + heading */}
                <div className="flex-1 text-center lg:text-left">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight mb-6">
                        An abundance of freelance talent,<br />
                        <span className="text-[#fd8700]">ready to work for you.</span>
                    </h2>
                    <div className="relative rounded-2xl overflow-hidden shadow-xl max-w-md mx-auto lg:mx-0">
                        <Image
                            src="/images/reassurance.jpg"
                            alt="Freelancer at work"
                            width={600}
                            height={420}
                            className="w-full h-auto object-cover"
                        />
                    </div>
                </div>

                {/* Right: feature list */}
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {FEATURES.map((feature) => (
                        <div key={feature.title} className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                            <div className="w-8 h-8 rounded-full bg-orange-100 flex items-center justify-center mb-4">
                                <svg className="w-4 h-4 text-[#fd8700]" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="currentColor">
                                    <path d="M8 1.75C4.548 1.75 1.75 4.548 1.75 8c0 3.452 2.798 6.25 6.25 6.25 3.452 0 6.25-2.798 6.25-6.25C14.25 4.548 11.452 1.75 8 1.75zM.25 8C.25 3.72 3.72.25 8 .25S15.75 3.72 15.75 8 12.28 15.75 8 15.75.25 12.28.25 8z" />
                                    <path d="M11.53 5.47a.75.75 0 010 1.06l-4 4a.75.75 0 01-1.06 0l-2-2a.75.75 0 011.06-1.06L7 8.94l3.47-3.47a.75.75 0 011.06 0z" />
                                </svg>
                            </div>
                            <h3 className="text-gray-900 font-semibold text-base mb-2">{feature.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{feature.body}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
