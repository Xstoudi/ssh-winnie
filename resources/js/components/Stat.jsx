export default function Stat({ name, value }) {
  return (
    <div className="flex flex-col px-4 py-8 text-center border border-gray-100 rounded-lg">
      <dt className="order-last text-lg font-medium text-gray-500">{name}</dt>
      <dd className="text-4xl font-extrabold text-blue-600 md:text-5xl">{value}</dd>
    </div>
  )
}
