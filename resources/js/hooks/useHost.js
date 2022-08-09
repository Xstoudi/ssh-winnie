import { useContext } from 'react'
import { HostContext } from '../Winnie'

export default function useHost() {
  return useContext(HostContext)
}
