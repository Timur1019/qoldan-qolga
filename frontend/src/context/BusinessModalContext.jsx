import { createContext, useContext } from 'react'

const BusinessModalContext = createContext({
  openModal: () => {},
})

export function BusinessModalProvider({ openModal, children }) {
  return (
    <BusinessModalContext.Provider value={{ openModal }}>
      {children}
    </BusinessModalContext.Provider>
  )
}

export function useBusinessModal() {
  return useContext(BusinessModalContext)
}
