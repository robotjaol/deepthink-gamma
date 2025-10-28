import React, { useState, createContext, useContext } from "react";
import { cn } from "../../lib/utils";
import { motion } from "framer-motion";

interface Link {
  label: string;
  href?: string;
  onClick?: () => void;
  icon: React.ReactNode;
}

interface SidebarContextProps {
  open: boolean;
}

const SidebarContext = createContext<SidebarContextProps | undefined>(
  undefined
);

export const useSidebar = () => {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within a Sidebar component");
  }
  return context;
};

export const Sidebar = ({
  children,
  className,
}: React.ComponentProps<"div">) => {
  const [open, setOpen] = useState(false);

  return (
    <SidebarContext.Provider value={{ open }}>
      <motion.div
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        animate={{ width: open ? 240 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn(
          "hidden md:flex flex-col h-screen bg-light-secondary dark:bg-dark-secondary shrink-0 overflow-x-hidden overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]",
          className
        )}
      >
        <div className="flex flex-col justify-between flex-1 p-4">
             {children}
        </div>
      </motion.div>
    </SidebarContext.Provider>
  );
};

export const SidebarLink = ({
  link,
  className,
}: {
  link: Link;
  className?: string;
}) => {
  const { open } = useSidebar();
  return (
    <div
      onClick={() => link.onClick?.()}
      className={cn(
        "flex items-center justify-start gap-4 group/sidebar py-2.5 px-3 rounded-lg cursor-pointer transition-colors duration-200 hover:bg-light-accent/50 dark:hover:bg-dark-accent/20",
        className
      )}
    >
      <div className="shrink-0">{link.icon}</div>

      <motion.span
        animate={{
          opacity: open ? 1 : 0,
          width: open ? 'auto' : 0,
        }}
        transition={{ duration: 0.2, ease: "easeOut", delay: 0.1 }}
        className="text-light-text dark:text-dark-text text-sm font-medium overflow-hidden whitespace-nowrap"
      >
        {link.label}
      </motion.span>
    </div>
  );
};