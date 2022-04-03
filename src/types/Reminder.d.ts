export {};

declare global {
  namespace Reminder {
    type Reminder = {
      description: string;
      time: string;
      city: City | null;
      color: string;
      weather: OpenWeather.SkyWithTemperature | null;
      date: string;
    };

    interface ReminderAdded extends Reminder {
      id: number;
    }

    type City = {
      name: string;
      stateCode: string;
      country: string;
      lat: number;
      lon: number;
    };
  }
}
