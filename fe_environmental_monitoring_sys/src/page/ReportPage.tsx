export default function ReportPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">Báo cáo</h1>
            <p className="text-gray-700 mb-4">
                Đây là trang báo cáo, nơi bạn có thể xem các báo cáo liên quan đến hệ thống giám sát môi trường.
            </p>
            <p className="text-gray-500">
                Vui lòng chọn một báo cáo từ menu bên trái để xem chi tiết.
            </p>
        </div>
    );
}