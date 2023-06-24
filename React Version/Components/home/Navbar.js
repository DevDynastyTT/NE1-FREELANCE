import '../../static/css/navbar.css'
import { Link } from 'react-router-dom';

export default function Navbar() {

  return (
      <nav className="logged_out-navbar">
        <ul>
            <li className="nav-item">
              <Link className="nav-link" to="/jobs/search">Jobs</Link>
            </li>

            <li className="nav-item">
              <Link className="nav-link" to="/about">About</Link>
            </li>

            <li className="nav-item">
                <Link className="nav-link" to="/contact">Contact</Link>
            </li>

                <li className="nav-item">
                <Link className="nav-link" to="/members/login">Login/Signup</Link>
                </li>
        </ul>
      </nav>
)}
