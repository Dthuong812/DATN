import { motion, AnimatePresence, type Variants } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Mail, MapPin, Phone, Leaf, Send, MoveRight } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useState } from "react";
import Footer from "@/components/layout/Footer";

// Fix leaflet marker icons
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const floatingVariants: Variants = {
  float: {
    y: [0, -15, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

export default function ContactPage() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  // Removed unused isHovered state

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitted(true);
    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="w-full flex flex-col h-full overflow-auto scrollbar-hide relative bg-gray-50">

      <motion.div
        className="absolute top-1/4 left-10 opacity-20"
        variants={floatingVariants}
        animate="float"
      >
        <Leaf className="h-16 w-16 text-emerald-400" />
      </motion.div>
      <motion.div
        className="absolute top-1/3 right-20 opacity-30"
        variants={floatingVariants}
        animate="float"
      >
        <Leaf className="h-12 w-12 text-teal-400" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="container mx-auto px-4 py-12 md:py-24 text-center"
      >
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-emerald-600 to-teal-600 py-3">
          Liên hệ với <span className="text-emerald-600">EcoMonitor</span>
        </h1>
        <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
          Nếu bạn có bất kỳ câu hỏi hoặc ý kiến nào về EcoMonitor, xin vui lòng
          liên hệ với chúng tôi.
        </p>
      </motion.div>

      {/* Contact Information and Form */}
      <div className="container mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 px-4">
        {/* Contact Information */}
        <Card className="p-6 md:p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-6">Thông tin liên hệ</h2>
          <div className="space-y-6">
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Mail className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">info@ecomonitor.vn</p>
                <p className="text-muted-foreground">support@ecomonitor.vn</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <Phone className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium">Điện thoại</h3>
                <p className="text-muted-foreground">+84 123 456 789</p>
                <p className="text-muted-foreground">+84 987 654 321</p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-3 rounded-full">
                <MapPin className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <h3 className="font-medium">Địa chỉ</h3>
                <p className="text-muted-foreground">Số 123, Đường ABC, Hà Nội</p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 md:p-8 bg-white shadow-lg rounded-lg">
          <h2 className="text-2xl font-semibold mb-6 flex items-center gap-2">
            <Send className="h-6 w-6 text-emerald-600" />
            Gửi tin nhắn cho chúng tôi
          </h2>
          <AnimatePresence>
            {isSubmitted ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-emerald-100 border border-emerald-200 text-emerald-800 p-4 rounded-lg mb-6"
              >
                Cảm ơn bạn! Chúng tôi đã nhận được tin nhắn và sẽ phản hồi sớm
                nhất.
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <Input id="name" placeholder="Họ và tên" required />
                <Input id="email" type="email" placeholder="Email" required />
                <Input id="subject" placeholder="Chủ đề" required />
                <Textarea id="message" rows={5} placeholder="Nội dung" required />
                <Button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-700"
                >
                  Gửi tin nhắn
                  <MoveRight className="h-4 w-4 ml-2" />
                </Button>
              </motion.form>
            )}
          </AnimatePresence>
        </Card>
      </div>

      <div className="container mx-auto mt-12">
        <MapContainer
          center={[21.0285, 105.8542]}
          zoom={15}
          style={{ height: "400px", width: "100%" }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[21.0285, 105.8542]}>
            <Popup>Trụ sở EcoMonitor tại Hà Nội</Popup>
          </Marker>
        </MapContainer>
      </div>
      <Footer/>
    </div>
  );
}
