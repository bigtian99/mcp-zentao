export function formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
}

export function calculateRemainingDays(deadline: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const deadlineDate = new Date(deadline);
    deadlineDate.setHours(0, 0, 0, 0);

    const diffTime = deadlineDate.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

export function calculateDaysDifference(startDate: string): number {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const start = new Date(startDate);
    start.setHours(0, 0, 0, 0);

    const diffTime = today.getTime() - start.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
} 