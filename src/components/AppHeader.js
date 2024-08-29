import React, { useEffect, useState, useRef } from 'react';
import { NavLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  CContainer,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CHeader,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
  useColorModes,
} from '@coreui/react';
import CIcon from '@coreui/icons-react';
import { cilBell, cilContrast, cilEnvelopeOpen, cilList, cilMenu, cilMoon, cilSun } from '@coreui/icons';
import { AppBreadcrumb } from './index';
import { AppHeaderDropdown } from './header/index';
import axios from 'axios';

const AppHeader = () => {
  const [notificaciones, setNotificaciones] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const headerRef = useRef();
  const { colorMode, setColorMode } = useColorModes('coreui-free-react-admin-template-theme');

  const dispatch = useDispatch();
  const sidebarShow = useSelector((state) => state.sidebarShow);

  useEffect(() => {
    document.addEventListener('scroll', () => {
      headerRef.current &&
        headerRef.current.classList.toggle('shadow-sm', document.documentElement.scrollTop > 0);
    });

    const obtenerNotificaciones = async () => {
      try {
        // Obtener notificaciones de cumpleaños
        const { data: empleados } = await axios.get('http://localhost:4000/personal');
        const hoy = new Date();
        const cumpleañosHoy = empleados.filter(empleado => {
          const cumple = new Date(empleado.cumpleanos);
          return cumple.getDate() === hoy.getDate() && cumple.getMonth() === hoy.getMonth();
        });

        // Obtener notificaciones de automóviles
        const { data: automoviles } = await axios.get('http://localhost:4000/automoviles');
        
        const dosDiasDespues = new Date(hoy);
        dosDiasDespues.setDate(hoy.getDate() + 2);

        const unDiaDespues = new Date(hoy);
        unDiaDespues.setDate(hoy.getDate() + 1);

        const notificacionesAutomoviles = automoviles.flatMap(automovil => {
          const notificaciones = [];

          const fechasImportantes = [
            { tipo: 'Mantenimiento', fecha: new Date(automovil.servicio) },
            { tipo: 'Tenencia', fecha: new Date(automovil.tenencia) },
            { tipo: 'Seguro', fecha: new Date(automovil.seguro) },
            { tipo: 'Verificación', fecha: new Date(automovil.verificacion) }
          ];

          fechasImportantes.forEach(({ tipo, fecha }) => {
            if (fecha.getDate() === dosDiasDespues.getDate() && fecha.getMonth() === dosDiasDespues.getMonth() && fecha.getFullYear() === dosDiasDespues.getFullYear()) {
              notificaciones.push(`La fecha límite para la ${tipo} del automóvil con matrícula ${automovil.matricula} es en dos días.`);
            } 
            
            else if (fecha.getDate() === unDiaDespues.getDate() && fecha.getMonth() === unDiaDespues.getMonth() && fecha.getFullYear() === unDiaDespues.getFullYear()) {
              notificaciones.push(`La fecha límite para la ${tipo} del automóvil con matrícula ${automovil.matricula} es mañana.`);
            } 
            
            else if (fecha.getDate() === hoy.getDate() && fecha.getMonth() === hoy.getMonth() && fecha.getFullYear() === hoy.getFullYear()) {
              notificaciones.push(`La fecha límite para la ${tipo} del automóvil con matrícula ${automovil.matricula} es hoy.`);
            }
          });

          return notificaciones;
        });

        const todasLasNotificaciones = [
          ...notificacionesAutomoviles,
          ...cumpleañosHoy.map(empleado => `¡Hoy es el cumpleaños de ${empleado.nombre} ${empleado.apePaterno}!`)          
        ];

        setNotificaciones(todasLasNotificaciones);
        setUnreadCount(todasLasNotificaciones.length);

      } catch (error) {
        console.error('Error al obtener notificaciones:', error);
      }
    };


    obtenerNotificaciones();
  }, []);

  const handleNotificationClick = () => {
    setUnreadCount(0); 
  };

  return (
    <CHeader position="sticky" className="mb-4 p-0" ref={headerRef}>
      <CContainer className="border-bottom px-4" fluid>
        <CHeaderToggler
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
          style={{ marginInlineStart: '-14px' }}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderNav className="d-none d-md-flex">
          <CNavItem>
            <CNavLink to="/dashboard" as={NavLink}>
              Panel Principal
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-auto">
          <CNavItem>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle
                caret={false}
                onClick={handleNotificationClick}
                className="position-relative d-flex align-items-center"
              >
                <CIcon icon={cilBell} size="lg" />
                {unreadCount > 0 && (
                  <span className="badge badge-danger position-absolute">
                    {unreadCount}
                  </span>
                )}
              </CDropdownToggle>

              <CDropdownMenu className="pt-0" placement="bottom-end">
                {notificaciones.length > 0 ? (
                  notificaciones.map((notificacion, index) => (
                    <CDropdownItem to="" key={index}>
                      {notificacion}
                    </CDropdownItem>
                  ))
                ) : (
                  <CDropdownItem to="">No hay notificaciones</CDropdownItem>
                )}
              </CDropdownMenu>

            </CDropdown>
          </CNavItem>
          <CHeaderNav>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <CDropdown variant="nav-item" placement="bottom-end">
              <CDropdownToggle caret={false}>
                {colorMode === 'dark' ? (
                  <CIcon icon={cilMoon} size="lg" />
                ) : colorMode === 'auto' ? (
                  <CIcon icon={cilContrast} size="lg" />
                ) : (
                  <CIcon icon={cilSun} size="lg" />
                )}
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem
                  active={colorMode === 'light'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('light')}
                >
                  <CIcon className="me-2" icon={cilSun} size="lg" /> Light
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'dark'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('dark')}
                >
                  <CIcon className="me-2" icon={cilMoon} size="lg" /> Dark
                </CDropdownItem>
                <CDropdownItem
                  active={colorMode === 'auto'}
                  className="d-flex align-items-center"
                  as="button"
                  type="button"
                  onClick={() => setColorMode('auto')}
                >
                  <CIcon className="me-2" icon={cilContrast} size="lg" /> Auto
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
            <li className="nav-item py-1">
              <div className="vr h-100 mx-2 text-body text-opacity-75"></div>
            </li>
            <AppHeaderDropdown />
          </CHeaderNav>
        </CHeaderNav>
      </CContainer>
      <CContainer className="px-4" fluid>
        <AppBreadcrumb />
      </CContainer>
      <style jsx>{`
        .position-relative {
          position: relative;
        }

        .badge {
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 0.75rem;
          font-weight: bold;
          width: 1.2rem;
          height: 1.2rem;
          border-radius: 50%;
          background-color: #dc3545;
          color: white;
          position: fixed;
          top: -0.rem;
          right: -0.1rem;
          transform: translate(50%, -50%);
        }

        .badge-danger {
          background-color: #dc3545;
        }
      `}</style>
    </CHeader>
  );
};

export default AppHeader;
