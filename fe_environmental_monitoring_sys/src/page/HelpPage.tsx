import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function HelpPage() {
  return (
    <div className="max-w-8xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Liên hệ hỗ trợ</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>📧 Email: support@ecomonitor.vn</p>
          <p>📞 Hotline: 1900 9999</p>
          <p>⏰ Giờ làm việc: 8h00 – 17h00 từ Thứ 2 – Thứ 6</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Câu hỏi thường gặp</CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="item-1">
              <AccordionTrigger>Làm sao để kết nối cảm biến?</AccordionTrigger>
              <AccordionContent>
                Vào mục "Thiết bị" → "Thêm mới" → Nhập thông tin cảm biến và vị
                trí.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Tôi quên mật khẩu?</AccordionTrigger>
              <AccordionContent>
                Vui lòng nhấn "Quên mật khẩu" tại trang đăng nhập. Liên hệ admin
                nếu không khôi phục được.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-3">
              <AccordionTrigger>
                Làm thế nào để cập nhật phần mềm cảm biến?
              </AccordionTrigger>
              <AccordionContent>
                Truy cập mục "Cài đặt" → "Cập nhật phần mềm" → Chọn "Kiểm tra
                bản cập nhật" và làm theo hướng dẫn.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-4">
              <AccordionTrigger>
                Tôi gặp sự cố khi kết nối cảm biến với ứng dụng?
              </AccordionTrigger>
              <AccordionContent>
                Kiểm tra kết nối mạng và đảm bảo cảm biến đã được bật nguồn. Thử
                khởi động lại ứng dụng và cảm biến.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-5">
              <AccordionTrigger>
                Làm sao để thay đổi thông tin vị trí của cảm biến?
              </AccordionTrigger>
              <AccordionContent>
                Vào mục "Thiết bị" → Chọn cảm biến cần chỉnh sửa → Cập nhật
                thông tin vị trí và lưu lại.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-6">
              <AccordionTrigger>
                Tôi cần hỗ trợ kỹ thuật ngoài giờ làm việc thì phải làm sao?
              </AccordionTrigger>
              <AccordionContent>
                Vui lòng gửi email chi tiết vấn đề đến support@ecomonitor.vn,
                chúng tôi sẽ phản hồi sớm nhất có thể vào ngày làm việc tiếp
                theo.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>
    </div>
  );
}
