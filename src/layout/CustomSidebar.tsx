import React, { useState, useEffect } from 'react';
import MobileMenu  from './MobileMenu';
import DesktopMenu from './DesktopMenu';
import './customSidebar.css';

interface CustomSidebarProps {
  children: React.ReactNode;
}

export const CustomSidebar: React.FC<CustomSidebarProps> = ({ children }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setMobileMenuOpen(false); 
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (
    <>
      {!isMobile && (
        <DesktopMenu
          collapsed={collapsed}
          toggleCollapse={toggleCollapse}
        />
      )}

      {isMobile && (
        <MobileMenu />
      )}

      <div className={`content-wrapper ${collapsed ? 'sidebar-collapsed' : ''} ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        {children}
      </div>
    </>
  );
};

export default CustomSidebar;