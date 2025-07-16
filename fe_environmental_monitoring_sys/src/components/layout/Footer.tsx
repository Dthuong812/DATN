import { Facebook, Github, Linkedin, Mail, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-green-900 text-gray-300 mt-10 relative">
      <div className="relative z-10 text-center px-6 py-12 md:py-16">
        {/* Logo and Description */}
        <motion.div
          className="container px-4 md:px-6 relative"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="flex flex-col items-center text-center space-y-6">
            <motion.h2
              className="text-3xl font-bold tracking-tighter sm:text-4xl text-white"
              animate={{
                scale: [1, 1.02, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              EcoMonitor
            </motion.h2>

            <p className="text-sm text-gray-300 max-w-xl mx-auto">Giải pháp giám sát môi trường thông minh, hỗ trợ ra quyết định bền vững.
              Đăng ký ngay để trải nghiệm hệ thống giám sát môi trường thông minh hàng đầu.
            </p>
          </div>
        </motion.div>

        <div className="flex justify-center gap-6 mt-8 text-gray-400">
          <a href="#" aria-label="Facebook" className="hover:text-white cursor-pointer">
            <Facebook />
          </a>
          <a href="#" aria-label="Twitter" className="hover:text-white cursor-pointer">
            <Twitter />
          </a>
          <a href="#" aria-label="LinkedIn" className="hover:text-white cursor-pointer">
            <Linkedin />
          </a>
          <a href="#" aria-label="GitHub" className="hover:text-white cursor-pointer">
            <Github />
          </a>
          <a href="#" aria-label="Email" className="hover:text-white cursor-pointer">
            <Mail />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-xs text-gray-400 mt-6">
          © {new Date().getFullYear()} EcoMonitor. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
