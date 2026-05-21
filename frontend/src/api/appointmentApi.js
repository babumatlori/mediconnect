import { api } from "./axiosConfig";

export const appointmentApi = {
    getSlots:
        (doctorId, date) => api.get(`/api/appointments/slots/${doctorId}/${date}`),
    book:
        (data) => api.post('/api/appointments/book', data),
    getPatientAppointments:
        (patientId) => api.get(`/api/appointments/patient/${patientId}`),
    getDoctorAppointments:
        (doctorId) => api.get(`/api/appointments/doctor/${doctorId}`),
    cancel:
        (id) => api.delete(`/api/appointments/${id}/cancel`),
    complete:
        (id, notes) => api.put(`/api/appointments/${id}/complete?notes=${notes || ''}`),
};
