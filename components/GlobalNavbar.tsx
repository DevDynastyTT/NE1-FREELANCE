'use client'

import Image from 'next/image'
import { logoutRoute } from '@/utils/APIRoutes'
import { SessionType } from '@/utils/types'
import Link from 'next/link'
import { useState } from 'react'
import { GrMenu } from 'react-icons/gr';
import { IoClose } from 'react-icons/io5';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCircle } from '@fortawesome/free-regular-svg-icons'
import { usePathname, useRouter } from 'next/navigation';
import axios from 'axios'

export default function GlobalNavbar({ session }: { session: SessionType | undefined }) {
  const router = useRouter()
  const pathname = usePathname()
  const [isMenuOpen, setMenuOpen] = useState(false);
  const [isDropdownOpen, setDropdownOpen] = useState(false);

  async function handleLogOut() {
    try {
      await axios.put(`${logoutRoute}/${session?._id}`, {}, { withCredentials: true });
      sessionStorage.removeItem('user')
      window.location.href = '/jobs'
    } catch (_e) {
      console.log('Error logging out')
    }
  }

  const navLinks = session
    ? [
        { href: '/jobs', label: 'Jobs' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
        { href: '/inbox', label: 'Messages' },
      ]
    : [
        { href: '/', label: 'Home' },
        { href: '/jobs', label: 'Jobs' },
        { href: '/about', label: 'About' },
        { href: '/contact', label: 'Contact' },
      ]

  return (
    <nav className="bg-gray-900 border-b border-white/10 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => router.push('/')} className="flex-shrink-0">
          <Image
            src="/images/logo2.png"
            alt="NE1 Freelance"
            width={1560}
            height={160}
            className="h-9 w-auto object-contain brightness-0 invert"
            priority
          />
        </button>

        {/* Desktop links */}
        <ul className="hidden lg:flex items-center gap-6 list-none">
          {navLinks.map(link => (
            <li key={link.href}>
              <Link
                className={`text-sm font-medium transition-colors ${pathname === link.href ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                href={link.href}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right side */}
        <div className="hidden lg:flex items-center gap-4">
          {session ? (
            <div className="relative">
              <button
                className="flex items-center gap-2 text-sm text-gray-300 hover:text-white transition-colors"
                onClick={() => setDropdownOpen(!isDropdownOpen)}
              >
                <FontAwesomeIcon className="text-green-400 text-xs" icon={faCircle} />
                {session.username}
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 z-50 border border-gray-100">
                  <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="/jobs/create" onClick={() => setDropdownOpen(false)}>Create Job</Link>
                  <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="/auth/profile" onClick={() => setDropdownOpen(false)}>Profile</Link>
                  {session?.isStaff && (
                    <Link className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50" href="/auth/admin" onClick={() => setDropdownOpen(false)}>Admin</Link>
                  )}
                  <hr className="my-1 border-gray-100" />
                  <button className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-gray-50" onClick={handleLogOut}>Logout</button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link className="text-sm text-gray-400 hover:text-white transition-colors" href="/auth/login">Login</Link>
              <Link className="bg-[#fd8700] hover:bg-orange-600 text-white text-sm font-semibold px-5 py-2 rounded-full transition-colors" href="/auth/signup">Sign up</Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="lg:hidden text-gray-400 hover:text-white text-xl p-2 transition-colors"
          onClick={() => setMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          {isMenuOpen ? <IoClose /> : <GrMenu />}
        </button>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-gray-900 border-t border-white/10 px-6 py-4">
          <ul className="flex flex-col gap-2 list-none mb-4">
            {navLinks.map(link => (
              <li key={link.href}>
                <Link
                  className="block py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          {session ? (
            <div className="flex flex-col gap-2 border-t border-white/10 pt-4">
              <Link className="text-sm text-gray-300 py-2" href="/auth/profile" onClick={() => setMenuOpen(false)}>Profile</Link>
              <Link className="text-sm text-gray-300 py-2" href="/jobs/create" onClick={() => setMenuOpen(false)}>Create Job</Link>
              {session?.isStaff && <Link className="text-sm text-gray-300 py-2" href="/auth/admin" onClick={() => setMenuOpen(false)}>Admin</Link>}
              <button className="text-sm text-red-400 text-left py-2" onClick={handleLogOut}>Logout</button>
            </div>
          ) : (
            <div className="flex gap-3 border-t border-white/10 pt-4">
              <Link className="flex-1 text-center text-sm text-gray-300 border border-white/20 py-2 rounded-full hover:bg-white/10 transition-colors" href="/auth/login" onClick={() => setMenuOpen(false)}>Login</Link>
              <Link className="flex-1 text-center text-sm text-white bg-[#fd8700] hover:bg-orange-600 py-2 rounded-full transition-colors font-semibold" href="/auth/signup" onClick={() => setMenuOpen(false)}>Sign up</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}

