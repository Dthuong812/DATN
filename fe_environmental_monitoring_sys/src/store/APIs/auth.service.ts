import type { LoginPayload } from "@/types/types";
import api from "../AxiosCustom";


const login= async (payload: LoginPayload) => {
    const response = await api.post("auth/signin", payload);
    if (response.data.Status < 0) {
      throw new Error(response.data.Message);
    }
    return response.data;
  }

const authService = {
    login,
}
export default authService;