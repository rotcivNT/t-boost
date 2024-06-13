import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_UPLOAD_API_BASE_URL + "/v1/api/upload";
export const uploadAPI = {
  uploadFile: (formData: FormData) => {
    return fetch(baseURL, {
      method: "POST",
      body: formData,
    });
  },
  getImages: (url: string) => axios.get(`${baseURL}?url=${url}`),
};
