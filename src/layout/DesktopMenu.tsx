import { Button } from 'primereact/button';
import { menuItems } from '../config';
import './customSidebar.css';
import { TieredMenu } from 'primereact/tieredmenu';
import { useRef, useState } from 'react';
import { MenuItem } from 'primereact/menuitem';
import { IconField } from 'primereact/iconfield';

export default function DesktopMenu({ collapsed, toggleCollapse }: { collapsed: boolean; toggleCollapse: () => void }) {
  const menu = useRef<TieredMenu>(null);
  const [subMenuOpen, setSubMenuOpen] = useState(false);

  return (
    <>
      <div className={`custom-sidebar ${collapsed ? 'collapsed' : ''} `}>
        <div className="sidebar-header">
          {!collapsed && <h3>Mi App</h3>}
          <Button icon={collapsed ? "pi pi-angle-right" : "pi pi-angle-left"} onClick={toggleCollapse} text />
        </div>

        <div className="sidebar-menu">
          <ul>
            {
              menuItems.map((item, index) => (
                <li key={index}>
                  {
                    item.items ? (
                      <>
                        <TieredMenu model={item.items as MenuItem[]} popup ref={menu} breakpoint="767px" />
                        <Button
                          label={collapsed ? "" : item.label}
                          icon={item.icon}
                          iconPos={collapsed ? "right" : "left"}
                          className='justify-content-center py-1.5'
                          onClick={(e) => {
                            menu?.current?.toggle(e)
                            setSubMenuOpen(!subMenuOpen); 
                          }} 
                          >
                          {!collapsed && !subMenuOpen ? <span className="pi pi-chevron-down"></span> : ""}
                          {!collapsed && subMenuOpen ? <span className="pi pi-chevron-up"></span> : "" }
                          </Button>
                      </>
                    ) : (
                      <Button
                        label={collapsed ? "" : item.label}
                        icon={item.icon}
                        iconPos={collapsed ? "right" : "left"}
                        onClick={() => item.url && (window.location.href = item.url)}
                        className='justify-content-center py-1.5'
                      />
                    )
                  }
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </>
  );
};
