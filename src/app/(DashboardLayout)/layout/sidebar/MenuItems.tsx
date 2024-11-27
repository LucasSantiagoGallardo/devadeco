import {
  IconAperture,
  IconCopy,
  IconLayoutDashboard,
  IconLogin,
  IconMoodHappy,
  IconTypography,
  IconUserPlus,
  IconBuilding,
} from "@tabler/icons-react";

import { uniqueId } from "lodash";

const Menuitems = [
  {
    navlabel: true,
    subheader: "Inicio",
  },
  {
    id: uniqueId(),
    title: "Panel de Control",
    icon: IconLayoutDashboard,
    href: "/",
  },
  {
    navlabel: true,
    subheader: "Gestión de Accesos",
  },
  {
    id: uniqueId(),
    title: "Gestión de Usuarios",
    icon: IconUserPlus,
    href: "/gestion-usuarios",
  },
  {
    id: uniqueId(),
    title: "Control de Dispositivos",
    icon: IconLayoutDashboard,
    href: "/control-dispositivos",
  },
  {
    id: uniqueId(),
    title: "Registro de Incidencias",
    icon: IconCopy,
    href: "/registro-incidencias",
  },
  {
    navlabel: true,
    subheader: "Empresas",
  },
  {
    id: uniqueId(),
    title: "Gestion Proveedores",
    icon: IconBuilding,
    href: "/proveedores",
  },
  {
    navlabel: true,
    subheader: "Utilidades",
  },
  {
    id: uniqueId(),
    title: "Tipografía",
    icon: IconTypography,
    href: "/utilidades/tipografia",
  },
  {
    id: uniqueId(),
    title: "Configuración",
    icon: IconTypography,
    href: "/configuracion",
  },
  {
    navlabel: true,
    subheader: "Autenticación",
  },
  {
    id: uniqueId(),
    title: "Registro",
    icon: IconUserPlus,
    href: "/autenticacion/registro",
  },
  {
    navlabel: true,
    subheader: "Reportes",
  },
  {
    id: uniqueId(),
    title: "Reportes",
    icon: IconMoodHappy,
    href: "/reportes",
  },
  {
    navlabel: true,
    subheader: "Ayuda",
  },
  {
    id: uniqueId(),
    title: "Ayuda y Documentación",
    icon: IconAperture,
    href: "/ayuda",
  },
];

export default Menuitems;
