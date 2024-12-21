// utils/apiUtils.ts
import { message } from "antd";
import Swal from "sweetalert2";

export const showAlert = async (message:string) => {
    await Swal.fire({
        title: 'Thông báo!',
        text: message,
        icon: 'info',
        confirmButtonText: 'OK'
    });
}

export const handleApiRequest = async (
apiCall: () => Promise<any>, onSuccess: (response: any) => void

) => {
    try {
        console.log("call api")
        const response = await apiCall();
        if (response.code === 200 || response.code === 201) {
            //message.success(response.message);
            onSuccess(response);
        } else {
            message.error(response.message || "Unknown error occurred");
        }
        return response;
    } catch (error: any) {
        //message.error(error.response?.message || "Error occurred");


         showAlert(error.response?.message || "Error occurred");

        console.error("API request error:", error);
    } finally {

    }
};
