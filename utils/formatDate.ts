import { format } from "date-fns";

/**
 * Formats a date into a readable string like "Nov 10, 2025".
 * @param date - A date string, timestamp, or Date object
 * @returns A formatted date string, or an empty string if invalid
 */
export function formatPostDate(date?: string | number | Date): string {
    if (!date) return "";

    try {
        return format(new Date(date), "MMM d, yyyy"); // e.g. "Nov 10, 2025"
    } catch (error) {
        console.error("Invalid date provided to formatPostDate:", date);
        return "";
    }
}
