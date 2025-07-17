import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
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
                Vào mục "Thiết bị" → "Thêm mới" → Nhập thông tin cảm biến và vị trí.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="item-2">
              <AccordionTrigger>Tôi quên mật khẩu?</AccordionTrigger>
              <AccordionContent>
                Vui lòng nhấn "Quên mật khẩu" tại trang đăng nhập. Liên hệ admin nếu không khôi phục được.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </CardContent>
      </Card>

      
    </div>
  );
}
