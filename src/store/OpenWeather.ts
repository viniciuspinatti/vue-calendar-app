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
    return fetch(
      `${OPEN_WEATHER_URL}/data/2.5/onecall?lat=${pLat}&lon=${pLon}&exclude=minutely,hourly,alerts&appid=${process.env.VUE_APP_OPEN_WEATHER_KEY}&units=metric`,
      {
        method: "GET"
      }
    ).then(async (resp) => {
      if (resp.status == 200) {
        const parsedReponse: OpenWeather.OneCallResponse = await resp.json();

        const skyWeatherList: OpenWeather.SkyWithTemperature[] = [];

        skyWeatherList.push({
          temp: parsedReponse.current.temp as number,
          icon: parsedReponse.current.weather[0].icon,
          main: parsedReponse.current.weather[0].main
        });

        parsedReponse.daily.forEach((dailyWeather) => {
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

        return parsedReponse;
      }
      throw resp;
    });
  }
};
