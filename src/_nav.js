import React from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilDescription,
  cilAddressBook,
  cilScreenSmartphone,
  cilUser,
  cilFile,
  cilSpeedometer
} from '@coreui/icons'
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

const _nav = [
  {
    component: CNavItem,
    name: 'Dashboard',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Areas',
    to: '/views/areas',
    icon: <CIcon icon={cilAddressBook} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Celulares',
    to: '/views/celulares',
    icon: <CIcon icon={cilScreenSmartphone} customClassName="nav-icon" />,
  },

  {
    component: CNavTitle,
    name: 'Personal',
  },
  {
    component: CNavItem,
    name: 'Elementos',
    to: '/theme/colors', // This is the path to the table elements
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Expedientes',
    to: '/theme/typography',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavItem,
    name: 'Docs',
    href: 'https://coreui.io/react/docs/templates/installation/',
    icon: <CIcon icon={cilDescription} customClassName="nav-icon" />,
  },
]

export default _nav
