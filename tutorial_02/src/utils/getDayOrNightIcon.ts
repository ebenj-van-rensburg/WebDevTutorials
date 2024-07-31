/** @format */
export function getDayOrNightIcon(iconName: string, dateTimeString: string): string {
    const hours: number = new Date(dateTimeString).getHours(); // Get hours from the given date and time string
  
    const isDayTime: boolean = hours >= 6 && hours < 18; // Consider daytime from 6 AM to 6 PM
  
    return isDayTime ? iconName.replace(/.$/, "d") : iconName.replace(/.$/, "n");
  }