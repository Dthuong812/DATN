import { motion } from "framer-motion";
import type { Variants } from "framer-motion";
import { LeafIcon } from "lucide-react";

const floatingVariants: Variants = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
  floatFast: {
    y: [0, -20, 0],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: [0.42, 0, 0.58, 1], 
    },
  },
};

export const FloatingElements = () => {
  return (
    <>
      <motion.div
        className="absolute top-1/4 left-10 opacity-20"
        variants={floatingVariants}
        animate="float"
      >
        <LeafIcon className="h-16 w-16 text-emerald-400" />
      </motion.div>
      
      <motion.div
        className="absolute top-1/3 right-20 opacity-30"
        variants={floatingVariants}
        animate="floatFast"
      >
        <LeafIcon className="h-12 w-12 text-teal-400" />
      </motion.div>
      
      <motion.div
        className="absolute bottom-1/4 left-1/4 opacity-25"
        variants={floatingVariants}
        animate="float"
      >
        <LeafIcon className="h-14 w-14 text-emerald-300" />
      </motion.div>

      <motion.div
        className="absolute top-1/5 right-1/4 w-8 h-8 rounded-full bg-emerald-400/20 border border-emerald-400/30"
        variants={floatingVariants}
        animate="floatFast"
      />
      
      <motion.div
        className="absolute bottom-1/3 left-1/3 w-12 h-12 rounded-full bg-teal-400/15 border border-teal-400/25"
        variants={floatingVariants}
        animate="float"
      />
    </>
  );
};