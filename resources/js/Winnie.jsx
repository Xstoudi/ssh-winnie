import { createContext, useCallback, useMemo, useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import Header from './layout/Header'
import AS from './pages/AS'
import Countries from './pages/Countries'
import Dashboard from './pages/Dashboard'
import Identities from './pages/Identities'
import Passwords from './pages/Passwords'
import Usernames from './pages/Usernames'
import { getHosts } from './services/stats'
import Reports from './pages/Reports'

const defaultHost = { id: '-1', name: 'All' }

export const HostContext = createContext({ host: defaultHost, availableHosts: [defaultHost] })

export default function Winnie() {
  const [host, setHostData] = useState(defaultHost)
  const availableHosts = useQuery(['availableHosts'], getHosts)
  const queryClient = useQueryClient()

  const availableHostsData = useMemo(
    () => [defaultHost, ...(availableHosts.data || [])],
    [availableHosts.data]
  )

  const setHost = useCallback((newHost, refetch) => {
    setHostData(newHost)
  })

  return (
    <BrowserRouter>
      <HostContext.Provider value={[host, setHost, availableHostsData]}>
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
              <Route path="/reports" element={<Reports />} />
              <Route path="/reports/:page" element={<Reports />} />
            </Routes>
          </div>
        </div>
      </HostContext.Provider>
    </BrowserRouter>
  )
}
