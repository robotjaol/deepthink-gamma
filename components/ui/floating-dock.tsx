import { cn } from "../../lib/utils";
import { Menu } from "lucide-react";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import React, { useRef, useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

type DockItem = {
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
};

export const FloatingDockMobile = ({ items }: { items: DockItem[] }) => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const prevLocation = useRef(location);

  useEffect(() => {
    // When the location path changes (e.g., via browser back/forward), close the menu.
    if (prevLocation.current.pathname !== location.pathname) {
      setOpen(false);
    }
    // Update the ref to the current location for the next render.
    prevLocation.current = location;
  }, [location]);

  return (
    <div className="relative">
      <AnimatePresence>
        {open && (
          <motion.div
            layoutId="nav"
            className="absolute inset-x-0 bottom-full mb-2 flex flex-col items-end gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {items.map((item, idx) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                exit={{
                  opacity: 0,
                  y: 10,
                  transition: {
                    delay: idx * 0.05,
                  },
                }}
                transition={{ delay: (items.length - 1 - idx) * 0.05 }}
              >
                {item.onClick ? (
                   <button
                    onClick={() => {
                      // This is for non-navigational actions like opening a modal.
                      item.onClick!();
                      // Use a timeout to allow the modal to start opening before the dock closes.
                      setTimeout(() => setOpen(false), 150);
                    }}
                    className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text", item.className)}
                  >
                      <div className="h-6 w-6">{item.icon}</div>
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      if (item.href) {
                        // Navigate if we are not already on the page.
                        if (location.pathname !== item.href) {
                           navigate(item.href);
                        }
                        // Use a timeout to allow navigation to begin before the menu animates closed,
                        // preventing UI jank or perceived race conditions.
                        setTimeout(() => setOpen(false), 150);
                      }
                    }}
                    className={cn("flex h-12 w-12 items-center justify-center rounded-full bg-light-secondary dark:bg-dark-secondary text-light-text dark:text-dark-text", item.className)}
                  >
                    <div className="h-6 w-6">{item.icon}</div>
                  </button>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <button
        onClick={() => setOpen(!open)}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-light-secondary dark:bg-dark-secondary shadow-lg"
      >
        <Menu className="h-6 w-6 text-light-text dark:text-dark-text" />
      </button>
    </div>
  );
};

interface IconContainerProps {
  mouseX: MotionValue;
  title: string;
  icon: React.ReactNode;
  href?: string;
  onClick?: () => void;
  className?: string;
}

const IconContainer: React.FC<IconContainerProps> = ({
  mouseX,
  title,
  icon,
  href,
  onClick,
  className,
}) => {
  let ref = useRef<HTMLDivElement>(null);

  let distance = useTransform(mouseX, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  let widthTransform = useTransform(distance, [-150, 0, 150], [40, 80, 40]);
  let width = useSpring(widthTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  const innerContent = (
      <motion.div
        ref={ref}
        style={{ width }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className={cn(
            "relative flex aspect-square items-center justify-center rounded-full bg-light-secondary/80 dark:bg-dark-primary/80 text-light-text dark:text-dark-text backdrop-blur-sm",
            className
        )}
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, y: 10, x: "-50%" }}
              animate={{ opacity: 1, y: 0, x: "-50%" }}
              exit={{ opacity: 0, y: 10, x: "-50%" }}
              className="absolute -top-10 left-1/2 w-fit rounded-md border border-gray-300 dark:border-gray-700 bg-light-primary dark:bg-dark-primary px-2 py-1 text-xs whitespace-pre text-light-text dark:text-dark-text"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          className="flex items-center justify-center"
        >
          {icon}
        </motion.div>
      </motion.div>
  );

  if (onClick) {
      return (
        <button onClick={onClick} className="appearance-none bg-transparent border-none cursor-pointer p-0 m-0">
            {innerContent}
        </button>
      )
  }

  return (
    <Link to={href || ''}>
      {innerContent}
    </Link>
  );
}

export const FloatingDockDesktop = ({ items }: { items: DockItem[] }) => {
  let mouseX = useMotionValue(Infinity);
  return (
    <motion.div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className="mx-auto h-16 items-end gap-4 rounded-2xl bg-light-secondary/80 px-4 pb-3 flex dark:bg-dark-secondary/80 backdrop-blur-sm shadow-lg"
    >
      {items.map((item) => (
        <IconContainer
          mouseX={mouseX}
          key={item.title}
          title={item.title}
          icon={item.icon}
          href={item.href}
          onClick={item.onClick}
          className={item.className}
        />
      ))}
    </motion.div>
  );
};