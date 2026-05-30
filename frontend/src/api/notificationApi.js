import { api } from "./axiosConfig";

export const notificationApi = {
    getNotifications: (userId) =>
        api.get(`/api/notifications/${userId}`),
    getUnreadCount: (userId) =>
        api.get(`/api/notifications/${userId}/unread-count`),
    markAsRead: (id) =>
        api.put(`/api/notifications/${id}/read`),
    markAllAsRead: (userId) =>
        api.put(`/api/notifications/${userId}/read-all`),
};
