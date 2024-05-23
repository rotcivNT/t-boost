import axios from "axios";

const isValidUrl = (url: string) => {
  const regexp =
    /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
  return regexp.test(url);
};

export const previewLink = (url: string) => {
  if (!isValidUrl(url)) {
    return {
      url: false,
      data: 425,
    };
  }
  return axios
    .post(
      "https://api.linkpreview.net",
      {
        q: url,
      },
      {
        headers: {
          "X-Linkpreview-Api-Key": "fb20670c5ebe667e325ca2bf6d8e7b27",
        },
      }
    )
    .then((resp) => {
      return { url: true, data: resp.data };
    })
    .catch((err) => {
      return {
        url: true,
        data: err.response.status,
      };
    });
};
