import { api } from "./axiosConfig";

export const userApi = {
    getDoctors:          ()         => api.get('/api/users/doctors'),
    getAvailableDoctors: ()         => api.get('/api/users/doctors/avaiable'),
    getDoctorById:       (id)       => api.get(`/api/users/doctors/${id}`),
    getDoctorsBySpec:    (spec)     => api.get(`/api/users/doctors/specialization/${spec}`),
    getPatient:          (id)       => api.get(`/api/users/patients/${id}`),
    updatePatient:       (id, data) => api.put(`/api/users/patients/${id}`, data),
    updateDoctor:        (id, data) => api.put(`/api/users/doctors/${id}`, data),
}
