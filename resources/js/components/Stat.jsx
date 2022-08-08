export default function Stat({ name, value }) {
  return (
    <div class="flex flex-col px-4 py-8 text-center border border-gray-100 rounded-lg">
      <dt class="order-last text-lg font-medium text-gray-500">{name}</dt>
      <dd class="text-4xl font-extrabold text-blue-600 md:text-5xl">{value}</dd>
    </div>
  )
}
