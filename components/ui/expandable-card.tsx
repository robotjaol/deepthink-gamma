import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useOutsideClick } from '../../hooks/use-outside-click';
import { X } from 'lucide-react';

interface ExpandableCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  imageSrc: string;
}

export const ExpandableCard: React.FC<ExpandableCardProps> = ({ icon, title, description, imageSrc }) => {
  const [isActive, setIsActive] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useOutsideClick(cardRef, () => {
      if (isActive) {
          setIsActive(false);
      }
  });

  const handleClose = () => setIsActive(false);

  return (
    <div ref={cardRef} className="w-full h-full">
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={handleClose}
          >
            <motion.div
              layoutId={`card-${title}`}
              className="w-full max-w-2xl bg-light-primary dark:bg-dark-secondary rounded-2xl overflow-hidden shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative">
                <img src={imageSrc} alt={title} className="w-full h-64 object-cover" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                <div className="absolute bottom-0 left-0 p-6 text-white">
                   <div className="mb-2 text-dark-gold">{icon}</div>
                   <h3 className="text-3xl font-bold">{title}</h3>
                </div>
                 <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-black/30 rounded-full hover:bg-black/50 transition-colors text-white">
                    <X size={24} />
                </button>
              </div>
              <div className="p-6">
                <p className="text-gray-600 dark:text-gray-300">{description}</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        layoutId={`card-${title}`}
        onClick={() => setIsActive(true)}
        className="p-8 bg-light-primary dark:bg-dark-primary rounded-xl shadow-md text-left transition-transform duration-300 hover:-translate-y-2 hover:shadow-lg dark:hover:shadow-glow cursor-pointer h-full"
      >
        <div className="text-light-text dark:text-dark-gold mb-4">{icon}</div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-500 dark:text-gray-400 line-clamp-3">{description}</p>
      </motion.div>
    </div>
  );
};