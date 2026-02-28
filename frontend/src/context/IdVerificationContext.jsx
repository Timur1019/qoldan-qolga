import { createContext, useContext, useState } from 'react'
import IdVerificationModal from '../components/IdVerificationModal/IdVerificationModal'

const IdVerificationContext = createContext(null)

export function IdVerificationProvider({ children }) {
  const [open, setOpen] = useState(false)
  const value = { openIdVerificationModal: () => setOpen(true) }
  return (
    <IdVerificationContext.Provider value={value}>
      {children}
      <IdVerificationModal open={open} onClose={() => setOpen(false)} />
    </IdVerificationContext.Provider>
  )
}

export function useIdVerificationModal() {
  const ctx = useContext(IdVerificationContext)
  return ctx?.openIdVerificationModal ?? (() => {})
}
