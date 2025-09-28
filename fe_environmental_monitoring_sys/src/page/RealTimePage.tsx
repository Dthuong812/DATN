import SensorPanel from "@/components/SensorPanel";
import { useGetDeviceDatasQuery } from "@/services/devicedata.service";

export default function RealTimePage() {
    const {data: deviceDatas} = useGetDeviceDatasQuery({});
    console.log("deviceDatas", deviceDatas);
    return (
        <div className="max-w-8xl mx-auto h-full overflow-auto scrollbar-hide pt-8 pb-6 ">
            <SensorPanel />
        </div>
    );
}