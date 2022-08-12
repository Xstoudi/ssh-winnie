import { useQuery } from '@tanstack/react-query'
import { useMemo, useState } from 'react'
import { DateTime } from 'luxon'

import { getReports } from '../services/reports'
import { Link, useParams, Navigate } from 'react-router-dom'
import clsx from 'clsx'
import trimLabel from '../utils/trimLabel'

const paginateSize = 5

export default function Reports() {
  const params = useParams()

  const page = parseInt(params.page || '1', 10)

  const [address, setAddress] = useState('')
  const [identity, setIdentity] = useState('')
  const [country, setCountry] = useState('')
  const [asName, setASName] = useState('')
  const [asn, setASN] = useState(0)
  const [host, setHost] = useState('')

  const fetchReports = (page = 1) => getReports(page, address, identity, country, asName, asn, host)

  const { isLoading, data } = useQuery(
    ['reports', page, address, identity, country, asName, asn, host],
    () => fetchReports(page),
    { keepPreviousData: true }
  )

  const downloadUrl = useMemo(() => {
    const url = new URL(window.location.href)

    url.pathname = '/stats/reports/export'

    if (address !== '') url.searchParams.set('address', address)
    if (identity !== '') url.searchParams.set('identity', identity)
    if (country !== '') url.searchParams.set('country', country)
    if (asName !== '') url.searchParams.set('asName', asName)
    if (Number(asn) !== 0) url.searchParams.set('asn', asn)
    if (host !== '') url.searchParams.set('host', host)

    return url.href
  }, [address, identity, country, asName, asn, host])

  if (!isLoading && data?.meta.last_page < page) {
    return <Navigate to={`/reports/${data.meta.last_page}`} />
  }

  return (
    <div className="flex flex-row">
      <div>
        <div className="flex justify-between flex-col p-1 shadow-xl bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 rounded-2xl">
          <div className="block p-6 bg-white sm:p-8 rounded-xl">
            <h1 className="text-2xl mb-4">Filter</h1>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500" htmlFor="address">
                Address
              </label>
              <input
                className="w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded"
                id="address"
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500" htmlFor="identity">
                Identity
              </label>
              <input
                className="w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded"
                id="identity"
                type="text"
                value={identity}
                onChange={(e) => setIdentity(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500" htmlFor="country">
                Country
              </label>
              <input
                className="w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded"
                id="country"
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500" htmlFor="as-name">
                Autonomous System Name
              </label>
              <input
                className="w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded"
                id="as-name"
                type="text"
                value={asName}
                onChange={(e) => setASName(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500" htmlFor="asn">
                ASN
              </label>

              <input
                className="w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded"
                id="asn"
                type="number"
                min="0"
                max="4294967295"
                step="1"
                value={asn}
                onChange={(e) => setASN(Number(e.target.value))}
              />
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500" htmlFor="host">
                Host
              </label>
              <input
                className="w-full p-3 mt-1 text-sm border-2 border-gray-200 rounded"
                id="host"
                type="text"
                value={host}
                onChange={(e) => setHost(e.target.value)}
              />
            </div>
            <div className="mb-4">
              <a
                href={downloadUrl}
                className="w-full text-center inline-block px-12 py-3 text-sm font-medium text-white bg-green-600 border border-green-600 rounded active:text-greeb-500 hover:bg-transparent hover:text-green-600 focus:outline-none focus:ring"
              >
                Download
              </a>
            </div>
          </div>
        </div>
      </div>
      <div className="flex-1 ml-8 mt-2 w-full">
        <div className="overflow-hidden overflow-x-auto border border-gray-100 rounded">
          <table className="min-w-full text-sm divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  #
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Username
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Password
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Remote address
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Remote identity
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Country
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  AS Name
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  AS Number
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Host
                </th>
                <th className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap">
                  Datetime
                </th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-100">
              {data?.data.map((report) => (
                <tr key={report.id}>
                  <td className="px-4 py-2 font-medium text-gray-900 whitespace-nowrap">
                    {report.id}
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {trimLabel(report.username)}
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{report.password}</td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {report.remote_addr}
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {trimLabel(report.remote_identity)}
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {report.as_country_code}
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {trimLabel(report.as_name)}
                  </td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{report.asn}</td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">{report.host}</td>
                  <td className="px-4 py-2 text-gray-700 whitespace-nowrap">
                    {DateTime.fromISO(report.created_at).toLocaleString(
                      DateTime.DATETIME_SHORT_WITH_SECONDS
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ol className="flex justify-center space-x-1 text-xs font-medium mt-4">
          {data?.data?.length > 0 && (
            <>
              <li>
                <Link
                  to={page === 1 ? '#' : '/reports/1'}
                  className={clsx(
                    'inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded',
                    page === 1 ? 'cursor-default' : 'cursor-pointer'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  to={page === 1 ? '#' : `/reports/${page - 1}`}
                  className={clsx(
                    'inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded',
                    page === 1 ? 'cursor-default' : 'cursor-pointer'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>

              {[...Array(data.meta.last_page < paginateSize ? data.meta.last_page : paginateSize)]
                .map(
                  (_, i) =>
                    i +
                    (page < Math.round(paginateSize / 2)
                      ? 1 - page
                      : page > data.meta.last_page - Math.round(paginateSize / 2)
                      ? 1 + data.meta.last_page - paginateSize - page
                      : -Math.floor(paginateSize / 2))
                )
                .map((x) => (
                  <li key={x}>
                    <Link
                      to={`/reports/${page + x}`}
                      className={clsx(
                        'block w-8 h-8 leading-8 text-center border rounded',
                        page === page + x
                          ? 'bg-blue-600 border-blue-600 text-white'
                          : 'border-gray-100'
                      )}
                    >
                      {page + x}
                    </Link>
                  </li>
                ))}

              <li>
                <Link
                  to={page === data.meta.last_page ? '#' : `/reports/${page + 1}`}
                  className={clsx(
                    'inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded',
                    page === data.meta.last_page ? 'cursor-default' : 'cursor-pointer'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>
              <li>
                <Link
                  to={page === data.meta.last_page ? '#' : `/reports/${data.meta.last_page}`}
                  className={clsx(
                    'inline-flex items-center justify-center w-8 h-8 border border-gray-100 rounded',
                    page === data.meta.last_page ? 'cursor-default' : 'cursor-pointer'
                  )}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-3 h-3"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </Link>
              </li>
            </>
          )}
        </ol>
      </div>
    </div>
  )
}
