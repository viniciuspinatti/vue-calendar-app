import axios, { AxiosResponse } from "axios";
import Vue from "vue";

const OPEN_WEATHER_URL = "https://api.openweathermap.org";

const state = Vue.observable({
  skyWeatherForCurrentSystemDateUpTo7Days: [] as OpenWeather.SkyWithTemperature[]
});

export const gettersOpenWeather = {
  getSkyWeatherForCurrentSystemDateUpTo7Days(): OpenWeather.SkyWithTemperature[] {
    return state.skyWeatherForCurrentSystemDateUpTo7Days;
  }
};

export const mutationsOpenWeather = {
  setSkyWeatherForCurrentSystemDateUpTo7Days: (
    skyWeatherForCurrentSystemDateUpTo7Days: OpenWeather.SkyWithTemperature[]
  ): void => {
    state.skyWeatherForCurrentSystemDateUpTo7Days = skyWeatherForCurrentSystemDateUpTo7Days;
  }
};

export const actionsOpenWeather = {
  fetchOneCall: (pLat: number, pLon: number): Promise<OpenWeather.OneCallResponse> => {
    const axiosInstance = axios.create({
      baseURL: OPEN_WEATHER_URL,
      timeout: 100000
    });

    return new Promise((resolve) => {
      axiosInstance
        .get(
          `${OPEN_WEATHER_URL}/data/2.5/onecall?lat=${pLat}&lon=${pLon}&exclude=minutely,hourly,alerts&appid=${process.env.VUE_APP_OPEN_WEATHER_KEY}&units=metric`
        )
        .then((result: AxiosResponse<any, any>) => result.data)
        .then((resp: OpenWeather.OneCallResponse) => {
          const skyWeatherList: OpenWeather.SkyWithTemperature[] = [];

          skyWeatherList.push({
            temp: resp.current.temp as number,
            icon: resp.current.weather[0].icon,
            main: resp.current.weather[0].main
          });

          resp.daily.forEach((dailyWeather: any) => {
            const temperature =
              typeof dailyWeather.temp == "object"
                ? (dailyWeather.temp.max + dailyWeather.temp.max) / 2
                : dailyWeather.temp;
            skyWeatherList.push({
              temp: temperature,
              icon: dailyWeather.weather[0].icon,
              main: dailyWeather.weather[0].main
            });
          });

          mutationsOpenWeather.setSkyWeatherForCurrentSystemDateUpTo7Days(skyWeatherList);
          resolve(resp);
        });
    });
  }
};
