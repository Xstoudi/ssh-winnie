import clsx from 'clsx'
import { useCallback, useState } from 'react'
import useHost from '../hooks/useHost'

export default function HostDropdown() {
  const [isOpen, setIsOpen] = useState(false)

  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen])

  const [host, setHost, availableHosts] = useHost()

  const select = useCallback(
    (identifier) => () => {
      setIsOpen(false)
      setHost(availableHosts.find((host) => host.id === identifier))
    },
    [setIsOpen, setHost, availableHosts.length]
  )

  return (
    <div className="inline-flex items-stretch bg-white border rounded-md w-36" onClick={toggle}>
      <p className="px-4 py-2 text-sm text-gray-600 hover:text-gray-700 hover:bg-gray-50 rounded-l-md cursor-pointer flex-1">
        {host.name}
      </p>

      <div className="relative">
        <button
          type="button"
          className="inline-flex items-center justify-center h-full px-2 text-gray-600 border-l border-gray-100 hover:text-gray-700 rounded-r-md hover:bg-gray-50"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={clsx('w-4 h-4', isOpen && 'rotate-180')}
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>

        <div
          className={clsx(
            'absolute right-0 z-10 w-56 mt-4 origin-top-right bg-white border border-gray-100 rounded-md shadow-lg',
            isOpen || 'hidden'
          )}
          role="menu"
        >
          <div className="p-2">
            {availableHosts.map((host) => (
              <p
                className="block px-4 py-2 text-sm text-gray-500 rounded-lg hover:bg-gray-50 hover:text-gray-700 cursor-pointer"
                role="menuitem"
                onClick={select(host.id)}
                key={host.id}
              >
                {host.name}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
