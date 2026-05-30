import { api } from "./axiosConfig";

export const aiApi = {
    checkSymptoms: (data) =>
        api.post('/api/ai/symptom-check', data),
    recommendDoctors: (data) =>
        api.post('/api/ai/recommend-doctors', data),

    // FromData: file uploads cant use JSON

    summarizeReport: (file) => {
        const formData = new FormData();
        formData.append('file', file);
        return api.post('/api/ai/report-summarize', formData, {
            headers: { 'Content-Type': 'multipart/form-data'},
        });
    },
    chat: (data) => api.post('/api/ai/chat', data),
};
