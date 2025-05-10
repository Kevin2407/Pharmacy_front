
import { useRef } from 'react';
import { Button } from 'primereact/button';
import { TieredMenu } from 'primereact/tieredmenu';
import { menuItems } from '../config';


export default function MobileMenu() {
  const menu = useRef<TieredMenu>(null);

  return (
    <div className="card flex justify-content-left">
      <TieredMenu model={menuItems} popup ref={menu} breakpoint="767px" />
      <Button icon="pi pi-bars" onClick={(e) => menu.current?.toggle(e)} />
    </div>
  )
}
