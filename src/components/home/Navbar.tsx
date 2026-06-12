'use client'

import Link from 'next/link'
import { useState } from 'react';
import { GrMenu } from 'react-icons/gr';
import { IoClose } from 'react-icons/io5';

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="flex items-center">
      <button
        className="lg:hidden p-2 text-white text-2xl"
        onClick={() => setMenuOpen(!isMenuOpen)}
        aria-label="Toggle menu"
      >
        {isMenuOpen ? <IoClose /> : <GrMenu />}
      </button>

      {/* Desktop nav */}
      <ul className="hidden lg:flex items-center gap-8 list-none">
        <li>
          <Link className="text-white/90 hover:text-white text-sm font-medium transition-colors" href="/jobs">Jobs</Link>
        </li>
        <li>
          <Link className="text-white/90 hover:text-white text-sm font-medium transition-colors" href="/about">About</Link>
        </li>
        <li>
          <Link className="text-white/90 hover:text-white text-sm font-medium transition-colors" href="/contact">Contact</Link>
        </li>
        <li>
          <Link
            className="bg-white text-gray-900 px-4 py-2 rounded-full text-sm font-semibold hover:bg-orange-50 transition-colors"
            href="/auth/login"
          >
            Login / Sign up
          </Link>
        </li>
      </ul>

      {/* Mobile dropdown */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-gray-900 border-t border-white/10 z-50 lg:hidden">
          <ul className="flex flex-col list-none px-6 py-4 gap-4">
            <li>
              <Link className="text-white/90 hover:text-white text-base font-medium block py-2" href="/jobs" onClick={() => setMenuOpen(false)}>Jobs</Link>
            </li>
            <li>
              <Link className="text-white/90 hover:text-white text-base font-medium block py-2" href="/about" onClick={() => setMenuOpen(false)}>About</Link>
            </li>
            <li>
              <Link className="text-white/90 hover:text-white text-base font-medium block py-2" href="/contact" onClick={() => setMenuOpen(false)}>Contact</Link>
            </li>
            <li>
              <Link
                className="bg-[#fd8700] text-white px-4 py-2 rounded-full text-sm font-semibold inline-block hover:bg-orange-600 transition-colors"
                href="/auth/login"
                onClick={() => setMenuOpen(false)}
              >
                Login / Sign up
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  )
}
