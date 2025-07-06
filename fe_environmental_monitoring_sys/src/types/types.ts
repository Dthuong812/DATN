export interface Station {
    name: string;
    location: string;
    status: "Hoạt động" | "Bảo trì";
    aqi: number;
  }