import { Link } from 'react-router-dom'
import logo from '../../images/logo.png'

export default function Header() {
  return (
    <header className="bg-gray-900 mb-8">
      <div className="max-w-screen-xl px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="md:flex md:flex-1 md:items-center md:gap-12">
            <a className="block text-teal-300" href="/">
              <span className="sr-only">Home</span>
              <img src={logo} />
            </a>
          </div>

          <div className="hidden md:block">
            <nav aria-labelledby="header-navigation">
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
              </ul>
            </nav>
          </div>

          <div className="flex items-center gap-4">
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
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
