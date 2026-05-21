import { api } from "./axiosConfig";

export const authApi = {
    register: (data)  => api.post('/api/auth/register', data),
    login:    (data)  => api.post('/api/auth/login', data),
    refresh:  (token) => api.post(`/api/auth/refresh?refreshToken=${token}`),
};
