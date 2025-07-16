import { motion } from "framer-motion";
import { GaugeIcon, AlertCircleIcon, CloudIcon } from "lucide-react";
import { FloatingElements } from "./FloatingElements";

const featureVariants = {
  offscreen: {
    y: 50,
    opacity: 0,
  },
  onscreen: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      bounce: 0.4,
      duration: 0.8,
    },
  },
};

export function FeaturesSection() {
  const features = [
    {
      icon: <GaugeIcon className="h-8 w-8 text-emerald-600" />,
      title: "Theo dõi thời gian thực",
      description:
        "Giám sát liên tục các chỉ số môi trường với dữ liệu cập nhật mỗi phút.",
    },
    {
      icon: <AlertCircleIcon className="h-8 w-8 text-emerald-600" />,
      title: "Cảnh báo thông minh",
      description:
        "Nhận thông báo ngay lập tức khi có vấn đề về môi trường vượt ngưỡng an toàn.",
    },
    {
      icon: <CloudIcon className="h-8 w-8 text-emerald-600" />,
      title: "Phân tích đa yếu tố",
      description:
        "Tích hợp nhiều chỉ số: chất lượng không khí, nhiệt độ, độ ẩm, tiếng ồn...",
    },
  ];

  return (
    <section id="features" className="py-12 md:py-24 bg-white relative flex flex-col  items-center justify-between">
      <FloatingElements />

      <div className="container px-4 md:px-6">
        <motion.div
          className="text-center space-y-4 mb-12"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Công nghệ tiên tiến cho{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-emerald-500 to-teal-600">
              môi trường trong lành
            </span>
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl">
            EcoMonitor kết hợp cảm biến hiện đại và trí tuệ nhân tạo để mang đến
            giải pháp giám sát môi trường toàn diện.
          </p>
        </motion.div>

        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              initial="offscreen"
              whileInView="onscreen"
              viewport={{ once: true, amount: 0.2 }}
              variants={featureVariants}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-center w-12 h-12 bg-emerald-100 rounded-full mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-500">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
