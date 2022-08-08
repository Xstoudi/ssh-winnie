import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './layout/Header'
import AS from './pages/AS'
import Countries from './pages/Countries'
import Dashboard from './pages/Dashboard'
import Identities from './pages/Identities'
import Passwords from './pages/Passwords'
import Usernames from './pages/Usernames'

export default function Winnie() {
  return (
    <BrowserRouter>
      <div>
        <Header />
        <div className="w-3/4 mx-auto">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/countries" element={<Countries />} />
            <Route path="/usernames" element={<Usernames />} />
            <Route path="/passwords" element={<Passwords />} />
            <Route path="/as" element={<AS />} />
            <Route path="/identities" element={<Identities />} />
          </Routes>
        </div>
      </div>
    </BrowserRouter>
  )
}
