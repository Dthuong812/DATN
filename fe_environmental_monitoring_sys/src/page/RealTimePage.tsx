import SensorPanel from "@/components/SensorPanel";

export default function RealTimePage() {
    return (
        <div className="max-w-8xl mx-auto h-full overflow-auto scrollbar-hide pt-8 pb-6 ">
            <SensorPanel />
        </div>
    );
}