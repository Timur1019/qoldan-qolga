import { isClothingTree } from './routes'
import { isTransportTree } from './transport'
import { isRealEstateTree } from './realEstate'

const SERVICES_ROOT = 'Xizmatlar'
const ELECTRONICS_ROOT = 'Elektronika'
const APPLIANCES_ROOT = 'Bytovaya_tekhnika'
const ANIMALS_ROOT = 'Zhivotnye'

function inTree(categoryCode, breadcrumb, roots) {
  if (!categoryCode) return false
  if (roots.includes(categoryCode)) return true
  return Array.isArray(breadcrumb) && breadcrumb.some((c) => roots.includes(c.code))
}

export function categoryFilterFlags(categoryCode, breadcrumb = []) {
  const services = inTree(categoryCode, breadcrumb, [SERVICES_ROOT])
  const transport = isTransportTree(categoryCode, breadcrumb)
  const realEstate = isRealEstateTree(categoryCode, breadcrumb)
  const clothing = isClothingTree(categoryCode, breadcrumb)
  const electronics = inTree(categoryCode, breadcrumb, [ELECTRONICS_ROOT])
  const appliances = inTree(categoryCode, breadcrumb, [APPLIANCES_ROOT])
  const animals = inTree(categoryCode, breadcrumb, [ANIMALS_ROOT])
  const handmade = !services && !transport && !realEstate && !electronics && !appliances && !animals

  return {
    services,
    clothing,
    condition: !services && !realEstate,
    handmade,
    canRent: clothing,
    license: services,
    contract: services,
    giveAway: !services && !transport && !realEstate,
    canDeliver: !services && !realEstate,
    sellerType: true,
    onlineShowing: realEstate,
    price: true,
    urgentBargain: !services,
  }
}
