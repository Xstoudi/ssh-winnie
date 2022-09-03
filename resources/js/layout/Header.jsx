import { Link } from 'react-router-dom'
import logo from '../../images/logo.png'
import github from '../../images/github.png'
import HostDropdown from '../components/HostDropdown'

export default function Header() {
  return (
    <header className="bg-gray-900 mb-8">
      <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 md:flex md:items-center md:gap-12">
            <a className="block text-teal-300" href="/">
              <span className="sr-only">Home</span>
              <img src={logo} className="w-16 h-16" />
            </a>
          </div>

          <div className="md:flex md:items-center md:gap-12">
            <nav className="hidden md:block" aria-labelledby="header-navigation">
              <h2 className="sr-only" id="header-navigation">
                Header navigation
              </h2>

              <ul className="flex items-center gap-6 text-sm">
                <li>
                  <Link to={'/'} className="text-white transition hover:text-white/75">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link to={'/countries'} className="text-white transition hover:text-white/75">
                    Map
                  </Link>
                </li>
                <li>
                  <Link to={'/usernames'} className="text-white transition hover:text-white/75">
                    Usernames
                  </Link>
                </li>
                <li>
                  <Link to={'/passwords'} className="text-white transition hover:text-white/75">
                    Passwords
                  </Link>
                </li>
                <li>
                  <Link to={'/as'} className="text-white transition hover:text-white/75">
                    AS
                  </Link>
                </li>
                <li>
                  <Link to={'/identities'} className="text-white transition hover:text-white/75">
                    Identities
                  </Link>
                </li>
                <li>
                  <Link to={'/reports'} className="text-white transition hover:text-white/75">
                    Reports
                  </Link>
                </li>
              </ul>
            </nav>

            <div className="flex items-center gap-4">
              <div className="sm:gap-4 sm:flex">
                <HostDropdown />

                <div className="hidden sm:flex">
                  <a
                    target="_blank"
                    href="https://github.com/Xstoudi/ssh-winnie"
                    className="my-auto"
                  >
                    <img src={github} className="w-6h-6" />
                  </a>
                </div>
              </div>
              <div className="block md:hidden">
                <button className="p-2 text-white transition bg-gray-800 rounded hover:text-white/75">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
