import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import Winnie from './Winnie'

const queryClient = new QueryClient()

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Winnie />
    </QueryClientProvider>
  )
}
