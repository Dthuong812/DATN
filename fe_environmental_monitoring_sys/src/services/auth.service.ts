import type { ForgotPayload, LoginPayload } from "@/types/types";
import api from "../store/AxiosCustom";


const login= async (payload: LoginPayload) => {
    const response = await api.post("auth/signin", payload);
    if (response.data.Status < 0) {
      throw new Error(response.data.Message);
    }
    return response.data;
}
const forgot_password = async (payload:ForgotPayload) =>{
    const response = await api.patch("auth/forgot-password", payload);
    if (response.data.Status < 0) {
      throw new Error(response.data.Message);
    }
    console.log(response.data);
    return response.data;

}

const authService = {
    login,
    forgot_password
}
export default authService;