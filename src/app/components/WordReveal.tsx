import { motion } from "motion/react";

interface WordRevealProps {
  text: string;
  className?: string;
  style?: React.CSSProperties;
  delay?: number;
}

export function WordReveal({ text, className = "", style = {}, delay = 0 }: WordRevealProps) {
  const words = text.split(" ");

  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            delay: delay + i * 0.1,
            ease: "easeOut",
          }}
          className="inline-block mr-[0.3em]"
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
}
