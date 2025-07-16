import { motion } from "framer-motion";

const statVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.5,
    },
  }),
};

export function StatsSection() {
  const stats = [
    { value: "99.9%", label: "Độ chính xác" },
    { value: "24/7", label: "Giám sát liên tục" },
    { value: "1000+", label: "Cảm biến triển khai" },
    { value: "50+", label: "Thành phố áp dụng" },
  ];

  return (
    <section id="stats" className="py-12 md:py-24 relative flex flex-col  items-center justify-between">
      <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-teal-600/10 opacity-40"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-400/5 via-transparent to-transparent"></div>
      
      <div className="container px-4 md:px-6 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={index}
              className="text-center bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-sm"
              custom={index}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={statVariants}
              whileHover={{ scale: 1.05 }}
            >
              <motion.h3 
                className="text-4xl font-bold text-emerald-600 mb-2"
                animate={{
                  backgroundPosition: ['0% 50%', '100% 50%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                style={{
                  backgroundImage: 'linear-gradient(90deg, #10b981, #0d9488, #10b981)',
                  backgroundSize: '200% 100%',
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {stat.value}
              </motion.h3>
              <p className="text-gray-600 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}