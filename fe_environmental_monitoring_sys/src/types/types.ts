export interface Station {
  name: string;
  location: string;
  status: "Hoạt động" | "Bảo trì";
  aqi: number;
}
export interface PollutionStation {
  name: string;
  lat: number;
  lng: number;
  aqi: number;
}
export interface SensorData {
  id: string;
  name: string;
  lat: number;
  lng: number;
  aqi: number;
  temperature: number;
  humidity: number;
  timestamp: string;
}
