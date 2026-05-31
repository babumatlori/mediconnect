import {format, formatDistanceToNow, isToday, isTomorrow } from "date-fns";

// format a date string for display in appointment cards (i = 2026-05-15, o = May 15, 2026)
export const formatDate = (dateString) => {
    try {
        return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
        return dateString;
    }
};

// Format time for slot display i= 9:00 o= 9:00 pm

export const formatTime = (timeString) => {
    try {
        if (!timeString) return '';

        const parts = timeString.split(':');

        const hours = parseInt(parts[0]);
        const minutes = parseInt(parts[1]);

        const date = new Date();
        date.setHours(hours, minutes);

        return format(date, 'h:mm a');
    } catch {
        return timeString;
    }
};
// smart data label - shows "TOdays, Tommorow",or the date.

export const smartDate = (dateString) => {
    try {
        const date = new Date(dateString);
        if (isToday(date)) return 'Today';
        if(isTomorrow(date)) return 'Tomorrow';
        return format(date, 'MMM dd, yyyy');
    } catch {
        return dateString;
    }
};

// Relative time - "2 hours age", "3 days  ago"

export const timeAgo = (dateString) => {
    try {
        return formatDistanceToNow(new Date(dateString), {
            addSuffix: true,
        })
    } catch {
        return '';
    }
};

// Format date for API requests.

export const toApiDate = (date) => {
    return format(date, 'yyyy-MM-dd');
}
