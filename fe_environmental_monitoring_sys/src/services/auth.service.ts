import { userApi } from "@/store/AxiosCustom";
import type { ForgotPayload, LoginPayload } from "@/types/types";



const login= async (payload: LoginPayload) => {
    const response = await userApi.post("auth/signin", payload);
    if (response.data.Status < 0) {
      throw new Error(response.data.Message);
    }
    return response.data;
}
const forgot_password = async (payload:ForgotPayload) =>{
    const response = await userApi.patch("auth/forgot-password", payload);
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