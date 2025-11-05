import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { LayoutGrid, BrainCircuit, Trophy, History, Settings, LogOut, Swords, MessageSquarePlus, StickyNote, Medal, ListChecks, Sun, Moon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sidebar, SidebarLink, useSidebar } from '../ui/sidebar';
import { cn } from '../../lib/utils';
import RequestModal from '../dashboard/RequestModal';
import { FloatingDockMobile } from '../ui/floating-dock';

const DashboardLayout: React.FC = () => {
    const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
    const { user, logout } = useAuth();
    const { theme, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Overview', href: '/dashboard/overview', icon: <LayoutGrid size={20} /> },
        { label: 'Scenarios', href: '/dashboard/scenario', icon: <BrainCircuit size={20} /> },
        { label: 'Challenges', href: '/dashboard/challenges', icon: <Swords size={20} /> },
        { label: 'Task Hub', href: '/dashboard/development', icon: <ListChecks size={20} /> },
        { label: 'Leaderboard', href: '/dashboard/leaderboard', icon: <Trophy size={20} /> },
        { label: 'History', href: '/dashboard/history', icon: <History size={20} /> },
        { label: 'Badges', href: '/dashboard/badges', icon: <Medal size={20} /> },
        { label: 'Notes', href: '/dashboard/notes', icon: <StickyNote size={20} /> },
        { label: 'Request', onClick: () => setIsRequestModalOpen(true), icon: <MessageSquarePlus size={20} /> },
    ];
    
    // Mobile items can be a subset or include different actions
    const mobileNavItems = navItems.filter(item => item.href).slice(0, 5).map(item => ({
        ...item,
        title: item.label,
        icon: React.cloneElement(item.icon, { size: 24 }),
    }));
    // FIX: Added missing 'label' property to satisfy the item type.
    mobileNavItems.push({ title: 'Request', label: 'Request', onClick: () => setIsRequestModalOpen(true), icon: <MessageSquarePlus size={24} /> });

    const SidebarContent = () => {
        const { open } = useSidebar();
        return (
            <>
                <div className="flex flex-col flex-1">
                     <Link to="/dashboard/overview" className="flex items-center mb-8 px-3">
                        <img src={theme === 'dark' ? '/dtg-1.png' : '/dt-1.png'} alt="DeepThink" className="h-8 w-auto flex-shrink-0" />
                    </Link>
                    <nav className="flex flex-col gap-1">
                        {navItems.map((link) => (
                            link.href ? (
                                <NavLink to={link.href} key={link.label} className={({ isActive }) =>
                                   ` ${isActive ? 'bg-light-accent/50 dark:bg-dark-accent/20' : ''} rounded-lg`
                                }>
                                   <SidebarLink link={link} />
                                </NavLink>
                            ) : (
                                // FIX: Wrapped SidebarLink in a div to correctly apply the 'key' prop for list rendering, as 'key' is not a valid prop for the SidebarLink component itself.
                                <div key={link.label}>
                                    <SidebarLink link={link} />
                                </div>
                            )
                        ))}
                    </nav>
                </div>
                <div className="flex flex-col gap-1">
                    <SidebarLink 
                        link={{
                            label: 'Theme', 
                            onClick: toggleTheme, 
                            icon: theme === 'light' ? <Moon size={20} /> : <Sun size={20} />
                        }} 
                    />
                     <NavLink to="/dashboard/settings" className={({ isActive }) => ` ${isActive ? 'bg-light-accent/50 dark:bg-dark-accent/20' : ''} rounded-lg`}>
                       <SidebarLink link={{ label: 'Settings', icon: <Settings size={20} /> }} />
                    </NavLink>
                     <SidebarLink link={{ label: 'Logout', onClick: handleLogout, icon: <LogOut size={20} /> }} />
    
                     <div className="border-t border-gray-300 dark:border-gray-700 my-2"></div>
                     
                     <div className={cn(
                        "flex items-center gap-3",
                        open ? "p-3" : "justify-center py-3"
                     )}>
                        <img 
                            src={user?.profilePictureUrl} 
                            alt={user?.name} 
                            className="rounded-full shrink-0 object-cover w-9 h-9"
                        />
                         <motion.div 
                            animate={{
                                opacity: open ? 1 : 0,
                                width: open ? 'auto' : 0,
                            }}
                            transition={{ duration: 0.1 }}
                            className="overflow-hidden flex-shrink-0"
                         >
                            <p className="font-semibold text-sm whitespace-nowrap">{user?.name}</p>
                            <p className="text-xs text-gray-500 whitespace-nowrap">{user?.email}</p>
                        </motion.div>
                     </div>
                </div>
            </>
        )
    };

    return (
        <div className="flex h-screen bg-light-primary dark:bg-dark-primary no-print">
            <Sidebar>
                <SidebarContent />
            </Sidebar>
            
            <div className="flex flex-col flex-1 overflow-hidden">
                <main className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8 pb-28 md:pb-8">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
            
            <div className="fixed bottom-4 right-4 z-50 md:hidden">
                <FloatingDockMobile items={mobileNavItems} />
            </div>

            <RequestModal isOpen={isRequestModalOpen} onClose={() => setIsRequestModalOpen(false)} />
        </div>
    );
};

export default DashboardLayout;
