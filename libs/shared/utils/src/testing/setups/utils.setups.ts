export const setupZeroHourTests = (): Date => {
    const date: Date = new Date();
    date.setHours(0, 0, 0, 0);
    return date;
};
