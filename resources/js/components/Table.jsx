import clsx from 'clsx'

export default function Table({ columns, datas }) {
  return (
    <div className="overflow-hidden overflow-x-auto border border-gray-100 rounded w-full">
      <table className="min-w-full text-sm divide-y divide-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map(({ label, key }) => (
              <th
                key={key}
                className="px-4 py-2 font-medium text-left text-gray-900 whitespace-nowrap"
              >
                {label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody className="divide-y divide-gray-100">
          {datas.map((data, index) => (
            <tr key={index}>
              {columns.map(({ key, align = 'left', format = (x) => x }) => (
                <td
                  className={clsx(
                    'px-4 py-2 font-medium whitespace-nowrap',
                    align === 'right' ? 'text-right' : 'text-left'
                  )}
                  key={key}
                  title={data[key]}
                >
                  {format(data[key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
