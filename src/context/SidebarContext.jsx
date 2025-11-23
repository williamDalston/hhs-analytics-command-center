import React, { createContext, useContext, useState } from 'react';

const SidebarContext = createContext(null);

export const useSidebar = () => {
    const context = useContext(SidebarContext);
    if (!context) {
        throw new Error('useSidebar must be used within a SidebarProvider');
    }
    return context;
};

export const SidebarProvider = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(prev => !prev);
    };

    const collapseSidebar = () => {
        setIsSidebarCollapsed(true);
    };

    const expandSidebar = () => {
        setIsSidebarCollapsed(false);
    };

    return (
        <SidebarContext.Provider value={{ 
            isSidebarCollapsed, 
            toggleSidebar, 
            collapseSidebar, 
            expandSidebar 
        }}>
            {children}
        </SidebarContext.Provider>
    );
};



