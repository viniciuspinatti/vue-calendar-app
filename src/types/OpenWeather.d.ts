export {};

declare global {
  namespace OpenWeather {
    type OneCallResponse = {
      lat: number;
      lon: number;
      timezone: string;
      timezone_offset: number;
      current: DayWeatherData;
      daily: DayWeatherData[];
    };

    type DayWeatherData = {
      dt: number;
      sunrise: number;
      sunset: number;
      temp: number;
      feels_like: number;
      pressure: number;
      humidity: number;
      dew_point: number;
      uvi: number;
      clouds: number;
      visibility: number;
      wind_speed: number;
      wind_deg: number;
      wind_gust: number;
      weather: SkyWeather[];
    };

    type SkyWeather = {
      id: number;
      main: string;
      description: string;
      icon: string;
    };
  }
}
