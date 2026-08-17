import { Outlet } from 'react-router-dom'
import { BusinessModalProvider } from '../../context/BusinessModalContext'
import { AuthModal } from '../../features/auth'
import CategoriesOverlay from '../CategoriesModal/CategoriesOverlay'
import BusinessModal from '../BusinessModal/BusinessModal'
import Footer from '../Footer/Footer'
import { ROUTES } from '../../constants/routes'
import useDesktopLayout from './useDesktopLayout'
import DesktopHeader from './DesktopHeader'
import styles from './Layout.module.css'

export default function DesktopLayout() {
  const layout = useDesktopLayout()

  return (
    <div
      className={styles.layout}
      style={{ '--layout-header-height': `${layout.headerOffset}px` }}
    >
      <BusinessModalProvider openModal={() => layout.setBusinessModalOpen(true)}>
        <>
          <DesktopHeader layout={layout} />
          <CategoriesOverlay
            open={layout.categoriesOpen}
            onClose={layout.closeCategories}
            headerOffset={layout.headerOffset}
          />
          <main className={styles.main}>
            <Outlet />
          </main>
          <Footer />
          <AuthModal
            open={layout.authOpen}
            onClose={() => {}}
          />
          <BusinessModal
            open={layout.businessModalOpen}
            onClose={() => layout.setBusinessModalOpen(false)}
            onProceed={() => {
              layout.setBusinessModalOpen(false)
              layout.navigate(ROUTES.BUSINESS)
            }}
          />
        </>
      </BusinessModalProvider>
    </div>
  )
}
