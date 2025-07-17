import { motion } from "framer-motion";
import { Button } from "./ui/button";
import { ParticleBackground } from "./ParticleBackground";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.5,
    },
  },
};

export function HeroSection() {
  return (
    <section className="relative py-12 md:py-24 lg:py-32 flex flex-col  items-center justify-between ">
      <div className="absolute inset-0 -z-10">
        <ParticleBackground />
      </div>

      <div className="container px-4 md:px-6">
        <motion.div
          className="grid items-center gap-6 lg:grid-cols-2 lg:gap-12"
          initial="hidden"
          animate="visible"
          variants={containerVariants}
        >
          <motion.div className="space-y-4 pl-10" variants={itemVariants}>
            <motion.h1
              className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl "
              whileHover={{ scale: 1.02 }}
            >
              Giám sát môi trường thông minh với{" "}
              <span className="text-emerald-600 bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-600">
                EcoMonitor
              </span>
            </motion.h1>

            <motion.p
              className="max-w-[600px] text-gray-500 md:text-xl"
              variants={itemVariants}
            >
              Hệ thống giám sát môi trường toàn diện với công nghệ AI tiên tiến,
              cung cấp dữ liệu chính xác và cảnh báo kịp thời.
            </motion.p>

            <motion.div
              className="flex flex-col gap-2 min-[400px]:flex-row pt-4"
              variants={itemVariants}
            >
              <Button className="bg-emerald-600 hover:bg-emerald-700 h-12 px-8">
                Bắt đầu ngay
              </Button>
              <Button variant="outline" className="h-12 px-8">
                Tìm hiểu thêm
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            className="flex justify-center"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="relative">
              <div className="absolute -inset-4 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-500 opacity-20 blur-lg"></div>
              <img
                alt="EcoMonitor Dashboard"
                className="relative rounded-xl shadow-2xl border border-emerald-100/20"
                height="400"
                src="https://scontent.fhan2-3.fna.fbcdn.net/v/t1.15752-9/517112181_588772487636747_133784113723534286_n.png?_nc_cat=108&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeHbNHTA8oy0nGkk_rn8nZfnwTBUB9utqhXBMFQH262qFRSx-lx6wrXx_yMoQMVypMVHGcg7ozExPhi1BD8C2Up_&_nc_ohc=KnQv3iM7y8gQ7kNvwHVH2t9&_nc_oc=AdnDSIYsXwb8mf8XVpNLEvsyhn09zRq8MfsyRxD8u3QnGvnnzLd25EJBAMuU9ejbinU&_nc_zt=23&_nc_ht=scontent.fhan2-3.fna&oh=03_Q7cD2wFA3t75m17_ttZzNR2VXFy-KGn9BtXald3Adq7Vx17ZeA&oe=689AE9A7"
                style={{
                  aspectRatio: "600/400",
                  objectFit: "cover",
                }}
                width="600"
              />
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
