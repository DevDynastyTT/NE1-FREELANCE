// 'use client'

import '@styles/nav/navbar.css'
import Link from 'next/link'
import { useState } from 'react';
import { GrMenu } from 'react-icons/gr';

export default function Navbar() {
  const [isMenuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!isMenuOpen);
  };
  return (
      <nav className="home-navbar">

        <button className="sandwich-button" onClick={toggleMenu}>
          <GrMenu /> {/* Sandwich icon */}
        </button>
        
        <ul className={`menu ${isMenuOpen ? 'open' : ''}`}>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                href="/jobs">Jobs</Link>
            </li>

            <li className="nav-item">
              <Link 
                className="nav-link" 
                href="/about">About</Link>
            </li>

            <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/contact">Contact</Link>
            </li>

                <li className="nav-item">
                <Link 
                  className="nav-link" 
                  href="/login">Login/Signup</Link>
                </li>
        </ul>
      </nav>
)}
