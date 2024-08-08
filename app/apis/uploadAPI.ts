import axios from "axios";

const baseURL = process.env.NEXT_PUBLIC_API_UPLOAD_BASE_URL + "/v1/api/uploads";
export const uploadAPI = {
  uploadFile: (formData: FormData) => {
    return fetch(baseURL, {
      method: "POST",
      body: formData,
    });
  },
  getImages: (url: string) => axios.get(`${baseURL}?url=${url}`),
  onlyUploadFiles: (formData: FormData) => {
    return fetch(`${baseURL}/only-upload-files`, {
      method: "POST",
      body: formData,
    });
  },
};
