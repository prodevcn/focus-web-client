import axios from "axios";

export const uploadMetadata = async (data) => {
  const response = await axios.post(
    `${process.env.REACT_APP_API}/upload-json`,
    { json: data }
  );

  if (response.data.url) {
    return response.data.url;
  }
  return null;
};

export const uploadFile = async (data) => {
  let form_Data = new FormData();

  form_Data.append("avatar", data.file);
  const response = await axios({
    method: "POST",
    url: `${process.env.REACT_APP_API}/upload-file`,
    data: form_Data,
    headers: { "Content-Type": "multipart/form-data" },
  });

  if (response.data.url) {
    return response.data.url;
  }
  return null;
};
