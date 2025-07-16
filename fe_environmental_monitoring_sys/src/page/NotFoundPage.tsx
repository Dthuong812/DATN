export default function NotFoundPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-8 h-screen flex flex-col items-center justify-center">
            <h1 className="text-3xl font-bold mb-4">404 - Trang không tìm thấy</h1>
            <p className="text-gray-700 mb-4">
                Rất tiếc, trang bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.
            </p>
            <p className="text-gray-500">
                Vui lòng kiểm tra lại đường dẫn hoặc quay lại trang chủ.
            </p>
        </div>
    );
}