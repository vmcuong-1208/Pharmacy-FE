import axiosClient from "./axiosClient";

const toBase64 = (value: string): string => {
  const utf8Bytes = encodeURIComponent(value).replace(
    /%([0-9A-F]{2})/g,
    (_, p1) => String.fromCharCode(Number.parseInt(p1, 16)),
  );
  return btoa(utf8Bytes);
};

export const loginApi = async (username: string, password: string) => {
  const passwordBase64 = toBase64(password);

  const params = new URLSearchParams();
  params.append("username", username);
  params.append("password", passwordBase64);

  const response = await axiosClient.post("/auth/login", params, {
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
  });

  return response.data; // { access_token, token_type, expires_in }
};
