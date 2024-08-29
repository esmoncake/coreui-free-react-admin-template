import React from 'react'

const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Colors = React.lazy(() => import('./views/theme/colors/Colors'))
const Typography = React.lazy(() => import('./views/theme/typography/Typography'))

//Vistas de nuestro proyecto
const Areas = React.lazy(() => import('./views/areas/Areas'))
const Celulares = React.lazy(() => import('./views/celulares/Celulares'))
const Automoviles = React.lazy(() => import('./views/automoviles/Automoviles'))
const Expedientes = React.lazy(() => import('./views/expediente/Expediente'))
const Usuarios = React.lazy(() => import('./views/usuarios/Usuarios'))
const Personal = React.lazy(() => import('./views/personal/Personal'))
const Provedores = React.lazy(() => import('./views/provedores/Provedores'))
const Libros = React.lazy(() => import('./views/libros/Libros'))
const Papeleria = React.lazy(() => import('./views/papeleria/Papeleria'))
const Monitores = React.lazy(() => import('./views/monitores/Monitores'))
const Electronicos = React.lazy(() => import('./views/electronicos/Electronicos'))
const Menaje = React.lazy(() => import('./views/menaje/Menaje'))
const Radios = React.lazy(() => import('./views/radios/Radios'))
const Mobiliario = React.lazy(() => import('./views/mobiliario/Mobiliario'))
const Equipo = React.lazy(() => import('./views/equipo/Equipo'))
const Llantas = React.lazy(() => import('./views/llantas/Llantas'))
const Computo = React.lazy(() => import('./views/computo/Computo'))
const Accesorios = React.lazy(() => import('./views/accesorios/Accesorios'))

// Base
const Cards = React.lazy(() => import('./views/base/cards/Cards'))

// Icons
const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'))
const Flags = React.lazy(() => import('./views/icons/flags/Flags'))
const Brands = React.lazy(() => import('./views/icons/brands/Brands'))

// Notifications
const Alerts = React.lazy(() => import('./views/notifications/alerts/Alerts'))
const Badges = React.lazy(() => import('./views/notifications/badges/Badges'))
const Modals = React.lazy(() => import('./views/notifications/modals/Modals'))
const Toasts = React.lazy(() => import('./views/notifications/toasts/Toasts'))

const Widgets = React.lazy(() => import('./views/widgets/Widgets'))

const routes = [  
  { path: '/', exact: true, name: 'SIR' },
  { path: '/dashboard', name: 'Dashboard', element: Dashboard },
  
  //Aqui van nuestras vistas//////////////////////////////////////////////////////////
  { path: '/views/areas', name: 'Areas', element: Areas },
  { path: '/views/celulares', name: 'Celulares', element: Celulares},
  { path: '/views/automoviles', name: 'Automoviles', element: Automoviles},
  { path: '/views/expedientes', name: 'Expedientes', element: Expedientes},
  { path: '/views/usuarios', name: 'Usuarios', element: Usuarios},
  { path: '/views/personal', name: 'Capital Humano', element: Personal},
  { path: '/views/provedores', name: 'Provedores', element: Provedores},
  { path: '/base/cards', name: 'Cards', element: Cards },
  { path: '/views/libros', name: 'Libros', element: Libros },
  { path: '/views/papeleria', name: 'Papeleria', element: Papeleria },
  { path: '/views/monitores', name: 'Monitores', element: Monitores},
  { path: '/views/electronicos', name: 'Electronicos', element: Electronicos},
  { path: '/views/menaje', name: 'Menaje', element: Menaje},
  { path: '/views/radios', name: 'Radios', element: Radios},
  { path: '/views/mobiliario', name: 'Mobiliario', element: Mobiliario},
  { path: '/views/equipo', name: 'Equipamiento', element: Equipo},
  { path: '/views/llantas', name: 'Llantas', element: Llantas},
  { path: '/views/computo', name: 'Computo', element: Computo},
  { path: '/views/accesorios', name: 'Accesorios', element: Accesorios},
  ////////////////////////////////////////////////////////////////////////////////////


  { path: '/theme', name: 'Theme', element: Colors, exact: true },
  { path: '/theme/colors', name: 'Colors', element: Colors },
  { path: '/theme/typography', name: 'Typography', element: Typography },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/icons/coreui-icons', name: 'CoreUI Icons', element: CoreUIIcons },
  { path: '/icons/flags', name: 'Flags', element: Flags },
  { path: '/icons/brands', name: 'Brands', element: Brands },
  { path: '/notifications', name: 'Notifications', element: Alerts, exact: true },
  { path: '/notifications/alerts', name: 'Alerts', element: Alerts },
  { path: '/notifications/badges', name: 'Badges', element: Badges },
  { path: '/notifications/modals', name: 'Modals', element: Modals },
  { path: '/notifications/toasts', name: 'Toasts', element: Toasts },
  { path: '/widgets', name: 'Widgets', element: Widgets },
]

export default routes
