import React, { Component } from 'react'
import CIcon from '@coreui/icons-react'
import {
  cilScreenSmartphone,
  cilUser,
  cilFile,
  cilSpeedometer,
  cilCarAlt,
  cilBook,
  cilLibrary,
  cilMonitor,
  cilGroup,
  cilHome,
  cilFridge,
  cilRestaurant,
  cilCouch,
  cilShieldAlt,
  cilAlbum,
  cilKeyboard
} from '@coreui/icons'
import { CNav, CNavGroup, CNavItem, CNavTitle } from '@coreui/react'

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
    icon: <CIcon icon={cilHome} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Provedores',
    to: '/views/provedores',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Personal',
  },
  {
    component: CNavItem,
    name: 'Capital Humano',
    to: '/views/personal', // This is the path to the table elements
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Expedientes',
    to: '/views/expedientes',
    icon: <CIcon icon={cilFile} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Equipamiento',
    to: '/views/equipo',
    icon: <CIcon icon={cilShieldAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Celulares',
    to: '/views/celulares',
    icon: <CIcon icon={cilScreenSmartphone} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Automoviles'
  },
  {
    component: CNavItem,
    name: 'Automoviles',
    to: '/views/automoviles',
    icon: <CIcon icon={cilCarAlt} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Llantas',
    to: '/views/llantas',
    icon: <CIcon icon={cilAlbum} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: 'Components',
  },
  {
    component: CNavItem,
    name: 'Libros',
    to: '/views/libros',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Papeleria',
    to: '/views/papeleria',
    icon: <CIcon icon={cilLibrary} customClassName={"nav-icon"}/>,
  },
  {
    component: CNavItem,
    name: 'Monitores',
    to: '/views/monitores',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Radios',
    to: '/views/radios',
    icon: <CIcon icon={cilBook} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Electronicos',
    to: '/views/electronicos',
    icon: <CIcon icon={cilFridge} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Menaje',
    to: '/views/menaje',
    icon: <CIcon icon={cilRestaurant} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Computo',
    to: '/views/computo',
    icon: <CIcon icon={cilMonitor} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Accesorios',
    to: '/views/accesorios',
    icon: <CIcon icon={cilKeyboard} customClassName="nav-icon" />,
  },

  {
    component: CNavItem,
    name: 'Mobiliario',
    to: '/views/mobiliario',
    icon: <CIcon icon={cilCouch} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: 'Usuarios',
    to: '/views/usuarios',
    icon: <CIcon icon={cilUser} customClassName="nav-icon"/>,
  },
]

export default _nav
