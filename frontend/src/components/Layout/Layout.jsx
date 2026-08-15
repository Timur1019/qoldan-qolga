import DesktopLayout from './DesktopLayout'
import MobileLayout from '../MobileLayout/MobileLayout'
import { useIsMobile } from '../../hooks/useIsMobile'

export default function Layout() {
  const isMobile = useIsMobile()
  return isMobile ? <MobileLayout /> : <DesktopLayout />
}
