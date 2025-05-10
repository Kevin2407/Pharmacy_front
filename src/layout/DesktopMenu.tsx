import { Button } from 'primereact/button';
import { menuItems } from '../config';
import './customSidebar.css';


export default function DesktopMenu({ collapsed, toggleCollapse }: { collapsed: boolean; toggleCollapse: () => void }) {

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
                  <Button
                    label={collapsed ? "" : item.label}
                    icon={item.icon}
                    iconPos={collapsed ? "right" : "left"}
                    onClick={() => item.url && (window.location.href = item.url)}
                    className='justify-content-center py-1.5'
                  />
                </li>
              ))
            }
          </ul>
        </div>
      </div>
    </>
  );
};
