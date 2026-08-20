import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingButtonProps {
  navItems: { icon: string; label: string; color: string; special?: boolean }[];
  onNavClick: (label: string) => void;
}

const FloatingButton: React.FC<FloatingButtonProps> = ({ navItems, onNavClick }) => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const isDraggingRef = useRef(false);
  const dragOffset = useRef({ x: 0, y: 0 });
  const startPosition = useRef({ x: 0, y: 0 });
  const isPressedRef = useRef(false);
  const buttonSize = 56;
  const collapsedHeight = 84;
  const edgeThreshold = 60;
  const clickThreshold = 5;
  const bottomNavHeight = 64;

  useEffect(() => {
    setPosition({
      x: window.innerWidth - buttonSize - 20,
      y: window.innerHeight - buttonSize - bottomNavHeight - 20,
    });
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (!isDragging) {
        const newX = Math.max(0, Math.min(window.innerWidth - buttonSize - 20, position.x));
        const newY = Math.max(60, Math.min(window.innerHeight - buttonSize - bottomNavHeight - 20, position.y));
        setPosition({ x: newX, y: newY });
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position.x, position.y, isDragging]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return;
    isPressedRef.current = true;
    const currentX = isCollapsed 
      ? (position.x < 0 ? 0 : window.innerWidth - buttonSize)
      : position.x;
    const currentY = isCollapsed 
      ? window.innerHeight - collapsedHeight - bottomNavHeight - 20 
      : position.y;
    dragOffset.current = {
      x: e.clientX - currentX,
      y: e.clientY - currentY,
    };
    startPosition.current = { x: e.clientX, y: e.clientY };
    e.stopPropagation();
  }, [position.x, position.y, isCollapsed]);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    isPressedRef.current = true;
    const currentX = isCollapsed 
      ? (position.x < 0 ? 0 : window.innerWidth - buttonSize)
      : position.x;
    const currentY = isCollapsed 
      ? window.innerHeight - collapsedHeight - bottomNavHeight - 20 
      : position.y;
    dragOffset.current = {
      x: touch.clientX - currentX,
      y: touch.clientY - currentY,
    };
    startPosition.current = { x: touch.clientX, y: touch.clientY };
    e.stopPropagation();
  }, [position.x, position.y, isCollapsed]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isPressedRef.current) return;
    const distance = Math.sqrt(
      Math.pow(e.clientX - startPosition.current.x, 2) + 
      Math.pow(e.clientY - startPosition.current.y, 2)
    );
    if (distance >= clickThreshold && !isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      const startX = isCollapsed 
        ? (position.x < 0 ? 0 : window.innerWidth - buttonSize)
        : position.x;
      const startY = isCollapsed 
        ? window.innerHeight - collapsedHeight - bottomNavHeight - 20 
        : position.y;
      setDragPosition({
        x: startX,
        y: startY,
      });
    }
    if (isDraggingRef.current) {
      const currentHeight = isCollapsed ? collapsedHeight : buttonSize;
      const newX = Math.max(0, Math.min(window.innerWidth - buttonSize, e.clientX - dragOffset.current.x));
      const newY = Math.max(60, Math.min(window.innerHeight - currentHeight - bottomNavHeight, e.clientY - dragOffset.current.y));
      setDragPosition({ x: newX, y: newY });
    }
  }, [position.x, position.y, isCollapsed]);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!isPressedRef.current) return;
    e.preventDefault();
    const touch = e.touches[0];
    const distance = Math.sqrt(
      Math.pow(touch.clientX - startPosition.current.x, 2) + 
      Math.pow(touch.clientY - startPosition.current.y, 2)
    );
    if (distance >= clickThreshold && !isDraggingRef.current) {
      isDraggingRef.current = true;
      setIsDragging(true);
      const startX = isCollapsed 
        ? (position.x < 0 ? 0 : window.innerWidth - buttonSize)
        : position.x;
      const startY = isCollapsed 
        ? window.innerHeight - collapsedHeight - bottomNavHeight - 20 
        : position.y;
      setDragPosition({
        x: startX,
        y: startY,
      });
    }
    if (isDraggingRef.current) {
      const currentHeight = isCollapsed ? collapsedHeight : buttonSize;
      const newX = Math.max(0, Math.min(window.innerWidth - buttonSize, touch.clientX - dragOffset.current.x));
      const newY = Math.max(60, Math.min(window.innerHeight - currentHeight - bottomNavHeight, touch.clientY - dragOffset.current.y));
      setDragPosition({ x: newX, y: newY });
    }
  }, [position.x, position.y, isCollapsed]);

  const handleDragEnd = useCallback((clientX: number, clientY: number) => {
    if (!isPressedRef.current) return;
    isPressedRef.current = false;
    if (isDraggingRef.current) {
      isDraggingRef.current = false;
      setIsDragging(false);
      const finalPosition = dragPosition;
      const isGoingToCollapse = finalPosition.x < edgeThreshold || finalPosition.x > window.innerWidth - edgeThreshold - buttonSize;
      const currentHeight = isGoingToCollapse ? collapsedHeight : buttonSize;
      const boundedY = Math.max(60, Math.min(window.innerHeight - currentHeight - bottomNavHeight, finalPosition.y));
      if (finalPosition.x < edgeThreshold) {
        setIsCollapsed(true);
        setPosition({ x: -10, y: boundedY });
      } else if (finalPosition.x > window.innerWidth - edgeThreshold - buttonSize) {
        setIsCollapsed(true);
        setPosition({ x: window.innerWidth - 10, y: boundedY });
      } else {
        setIsCollapsed(false);
        setPosition({ x: finalPosition.x, y: boundedY });
      }
    }
  }, [dragPosition]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    handleDragEnd(e.clientX, e.clientY);
  }, [handleDragEnd]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (e.changedTouches.length === 0) return;
    const touch = e.changedTouches[0];
    handleDragEnd(touch.clientX, touch.clientY);
  }, [handleDragEnd]);

  useEffect(() => {
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleMouseMove, handleMouseUp, handleTouchMove, handleTouchEnd]);

  const handleClick = useCallback(() => {
    if (isDragging) return;
    if (isCollapsed) {
      setIsCollapsed(false);
      const newX = position.x < window.innerWidth / 2 
        ? buttonSize + 20 
        : window.innerWidth - buttonSize - 20;
      setPosition({ x: newX, y: position.y });
    } else {
      setIsMenuOpen(true);
    }
  }, [isDragging, isCollapsed, position]);

  const handleNavItemClick = useCallback((label: string) => {
    onNavClick(label);
    setIsMenuOpen(false);
  }, [onNavClick]);

  const currentPosition = isDragging ? dragPosition : position;

  return (
    <>
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2998] bg-black/50 backdrop-blur-sm"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="fixed bottom-0 left-0 right-0 z-[2999] bg-white rounded-t-3xl shadow-2xl"
          >
            <div className="px-6 py-5">
              <div className="grid grid-cols-5 grid-rows-2 gap-y-5 gap-x-2">
                {navItems.map((item, idx) => (
                  <motion.button
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    transition={{ delay: idx * 0.04, duration: 0.2 }}
                    onClick={() => handleNavItemClick(item.label)}
                    className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
                  >
                    {item.special ? (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-xl font-bold ${item.color} shadow-sm`}>
                        宏
                      </div>
                    ) : (
                      <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg ${item.color} shadow-sm`}>
                        <i className={`fa-solid ${item.icon}`}></i>
                      </div>
                    )}
                    {item.special ? (
                      <span className="text-[10px] font-medium text-slate-600 text-center leading-tight whitespace-pre-line">
                        {item.label.replace('/', '\n/')}
                      </span>
                    ) : (
                      <span className="text-[10px] font-medium text-slate-600 text-center leading-tight">{item.label}</span>
                    )}
                  </motion.button>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center pb-4 pt-2 border-t border-slate-100">
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: 0.2, duration: 0.2 }}
                onClick={() => setIsMenuOpen(false)}
                className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 active:scale-95 transition-all shadow-md"
              >
                <i className="fa-solid fa-xmark text-xl"></i>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        className={`fixed flex items-center justify-center cursor-pointer z-[3000] select-none ${
          isDragging ? 'cursor-grabbing' : 'cursor-grab'
        }`}
        style={{
          left: currentPosition.x,
          top: currentPosition.y,
          pointerEvents: isMenuOpen ? 'none' : 'auto',
          touchAction: 'none',
        }}
        initial={{ scale: 0 }}
        animate={{ 
          width: isCollapsed ? 20 : buttonSize,
          height: isCollapsed ? collapsedHeight : buttonSize,
          scale: isDragging ? 1 : 1,
          borderRadius: isCollapsed ? 32 : buttonSize / 2,
          x: isCollapsed ? (currentPosition.x < window.innerWidth / 2 ? buttonSize / 2 - 10 : -(buttonSize / 2 - 10)) : 0,
          opacity: isMenuOpen ? 0 : 1,
        }}
        transition={{ 
          type: 'spring', 
          damping: 20, 
          stiffness: 300,
          duration: 0.3,
        }}
        onMouseDown={handleMouseDown}
        onClick={handleClick}
        onTouchStart={handleTouchStart}
        whileHover={!isCollapsed ? { scale: 1.1 } : {}}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="bg-[#00A758] shadow-xl flex items-center justify-center"
          animate={{ 
            width: isCollapsed ? 20 : buttonSize,
            height: isCollapsed ? collapsedHeight : buttonSize,
            borderRadius: isCollapsed ? 32 : buttonSize / 2,
          }}
        >
          {isCollapsed ? (
            <motion.i
              key="arrow"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`fa-solid fa-chevron-${position.x < window.innerWidth / 2 ? 'right' : 'left'} text-white text-base font-bold`}
            />
          ) : (
            <motion.i
              key="plus"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fa-solid fa-plus text-white text-2xl font-bold"
            />
          )}
        </motion.div>
      </motion.div>
    </>
  );
};

export default FloatingButton;