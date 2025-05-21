import { MenuItem } from 'primereact/menuitem';

export const menuItems: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      url: '/'
    },
    {
      label: 'Stock',
      icon: 'pi pi-box',
      url: '/productos/stock'
    },
    {
      label: 'Configuración',
      icon: 'pi pi-cog',
      items: [
        {
          label: 'Productos',
          icon: 'pi pi-barcode',
          url: '/productos'
        },
        {
          label: 'Categorias',
          icon: 'pi pi-list',
          url: '/categorias'
        },
        {
          label: 'Usuarios',
          icon: 'pi pi-users',
          url: '/usuarios'
        },
        {
          label: 'Roles',
          icon: 'pi pi-shield',
          url: '/roles'
        }
      ]
    },
  ];