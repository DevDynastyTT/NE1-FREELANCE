import '../../styles/nav/navbar.css'
import Link from 'next/link'

export default function Navbar() {

  return (
      <nav className="logged_out-navbar">
        <ul>
            <li className="nav-item">
              <Link 
                className="nav-link" 
                href="/jobs/search">Jobs</Link>
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
                  href="/members/login">Login/Signup</Link>
                </li>
        </ul>
      </nav>
)}
