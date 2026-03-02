import { useRef, useState } from "react";
import { motion } from "motion/react";
import { Link } from "react-router";

interface MagneticButtonProps {
  to: string;
  children: React.ReactNode;
}

export function MagneticButton({ to, children }: MagneticButtonProps) {
  const buttonRef = useRef<HTMLAnchorElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;

    setPosition({ x: deltaX, y: deltaY });
  };

  const handleMouseLeave = () => {
    setPosition({ x: 0, y: 0 });
  };

  return (
    <Link
      ref={buttonRef}
      to={to}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative inline-block"
    >
      <motion.div
        animate={{ x: position.x, y: position.y }}
        transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
        style={{ fontFamily: "'Inter', sans-serif", fontWeight: 600 }}
        className="relative flex items-center gap-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white px-6 py-3 rounded-xl shadow-lg shadow-blue-200 hover:shadow-blue-300 text-sm overflow-hidden group"
      >
        {/* Pulsing glow effect */}
        <motion.div
          className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100"
          animate={{
            boxShadow: [
              "0 0 0px rgba(37, 99, 235, 0.5)",
              "0 0 20px rgba(37, 99, 235, 0.5)",
              "0 0 0px rgba(37, 99, 235, 0.5)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        {children}
      </motion.div>
    </Link>
  );
}
