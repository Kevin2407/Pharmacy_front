import { Menubar } from 'primereact/menubar';
import { MenuItem } from 'primereact/menuitem';

export default function Header() {
  const items: MenuItem[] = [
    {
      label: 'Inicio',
      icon: 'pi pi-home',
      url: '/'
    },
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
  ];

  return (
    <div className="card">
      <Menubar model={items} />
    </div>
  )
}
