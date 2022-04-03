export {};

declare global {
  namespace Reminder {
    type Reminder = {
      id: number;
      description: string;
      time: string;
      city: City | null;
      color: string;
      weather: OpenWeather.SkyWithTemperature | null;
    };

    type City = {
      name: string;
      stateCode: string;
      country: string;
      lat: number;
      lon: number;
    };
  }
}
