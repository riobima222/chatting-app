// utils/calculateTimeDifference.ts

export const calculateTimeDifference = (dateString: string | null | undefined): string => {
    if (!dateString) {
        return 'unknown';
    }

    try {
        const date = new Date(dateString);
        const now = new Date();
        const diff = now.getTime() - date.getTime();

        // Convert to seconds, minutes, hours, days
        const seconds = Math.floor(diff / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);
        const weeks = Math.floor(days / 7);
        const months = Math.floor(days / 30);
        const years = Math.floor(days / 365);

        if (seconds < 60) {
            return 'just now';
        } else if (minutes < 60) {
            return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
        } else if (hours < 24) {
            return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
        } else if (days < 7) {
            return `${days} ${days === 1 ? 'day' : 'days'} ago`;
        } else if (weeks < 4) {
            return `${weeks} ${weeks === 1 ? 'week' : 'weeks'} ago`;
        } else if (months < 12) {
            return `${months} ${months === 1 ? 'month' : 'months'} ago`;
        } else {
            return `${years} ${years === 1 ? 'year' : 'years'} ago`;
        }
    } catch (error) {
        console.error('Error calculating time difference:', error);
        return 'invalid date';
    }
};