import { motion } from "framer-motion";

export function TestimonialsSection() {
  const testimonials = [
    {
      quote:
        "EcoMonitor đã giúp chúng tôi phát hiện sớm ô nhiễm không khí và có biện pháp xử lý kịp thời.",
      name: "Nguyễn Văn A",
      role: "Giám đốc Sở TNMT TP.HCM",
    },
    {
      quote:
        "Hệ thống dễ sử dụng, dữ liệu chính xác giúp chúng tôi ra quyết định nhanh chóng.",
      name: "Trần Thị B",
      role: "Kỹ sư môi trường",
    },
    {
      quote:
        "Cảnh báo từ EcoMonitor giúp bảo vệ sức khỏe người dân trong những ngày ô nhiễm cao.",
      name: "Lê Văn C",
      role: "Bác sĩ Bệnh viện Đa khoa",
    },
  ];

  return (
    <section
      id="testimonials"
      className="py-12 md:py-24 bg-white relative flex flex-col  items-center justify-between"
    >
      <div className="container px-4 md:px-6">
        <div className="text-center space-y-4 mb-12">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl">
            Được tin dùng bởi các chuyên gia
          </h2>
          <p className="max-w-[700px] mx-auto text-gray-500 md:text-xl">
            Những đánh giá từ khách hàng và đối tác của chúng tôi
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="relative group"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              viewport={{ once: true }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-lg blur opacity-20 group-hover:opacity-40 transition duration-300"></div>
              <div className="relative bg-gray-50 p-6 rounded-lg h-full">
                <blockquote className="text-gray-600 italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="font-medium">
                  <p className="text-emerald-600">{testimonial.name}</p>
                  <p className="text-gray-500 text-sm">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
