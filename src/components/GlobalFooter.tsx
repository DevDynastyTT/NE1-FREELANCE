import Link from 'next/link';
import Image from 'next/image';

export default function GlobalFooter() {
    return (
        <footer className="bg-gray-900 text-gray-400">
            <div className="max-w-7xl mx-auto px-6 py-14">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">

                    {/* Brand */}
                    <div className="md:col-span-2">
                        <Image
                            src="/images/logo2.png"
                            alt="NE1 Freelance"
                            width={1560}
                            height={160}
                            className="h-10 w-auto object-contain mb-4 brightness-0 invert"
                        />
                        <p className="text-sm leading-relaxed max-w-xs">
                            NE1 Freelance connects local businesses with trusted freelancers across transportation, cleaning, esthetics, and administration. Project-based pricing, zero surprises.
                        </p>
                    </div>

                    {/* Services */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Services</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/jobs" className="hover:text-white transition-colors">Transportation</Link></li>
                            <li><Link href="/jobs" className="hover:text-white transition-colors">Cleaning</Link></li>
                            <li><Link href="/jobs" className="hover:text-white transition-colors">Esthetics</Link></li>
                            <li><Link href="/jobs" className="hover:text-white transition-colors">Administration</Link></li>
                        </ul>
                    </div>

                    {/* Company */}
                    <div>
                        <h4 className="text-white font-semibold text-sm mb-4 uppercase tracking-wider">Company</h4>
                        <ul className="space-y-3 text-sm">
                            <li><Link href="/about" className="hover:text-white transition-colors">About Us</Link></li>
                            <li><Link href="/contact" className="hover:text-white transition-colors">Contact</Link></li>
                            <li><Link href="/auth/login" className="hover:text-white transition-colors">Login</Link></li>
                            <li><Link href="/auth/signup" className="hover:text-white transition-colors">Sign Up</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
                    <p>&copy; {new Date().getFullYear()} NE1 Freelance. All rights reserved.</p>
                    <div className="flex gap-6">
                        <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
                        <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
