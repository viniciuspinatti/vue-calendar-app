import Vue from "vue";

const OPEN_WEATHER_URL = "https://api.openweathermap.org";

const state = Vue.observable({
  skyWeatherForCurrentSystemDateUpTo7Days: [] as OpenWeather.SkyWeather[]
});

export const gettersOpenWeather = {
  getSkyWeatherForCurrentSystemDateUpTo7Days(): OpenWeather.SkyWeather[] {
    return state.skyWeatherForCurrentSystemDateUpTo7Days;
  }
};

export const mutationsOpenWeather = {
  setSkyWeatherForCurrentSystemDateUpTo7Days: (
    skyWeatherForCurrentSystemDateUpTo7Days: OpenWeather.SkyWeather[]
  ): void => {
    state.skyWeatherForCurrentSystemDateUpTo7Days = skyWeatherForCurrentSystemDateUpTo7Days;
  }
};

export const actionsOpenWeather = {
  fetchOneCall: (pLat: number, pLon: number): Promise<OpenWeather.OneCallResponse> => {
    return fetch(
      `${OPEN_WEATHER_URL}/data/2.5/onecall?lat=${pLat}&lon=${pLon}&exclude=minutely,hourly,alerts&appid=${process.env.VUE_APP_OPEN_WEATHER_KEY}`,
      {
        method: "GET"
      }
    ).then(async (resp) => {
      if (resp.status == 200) {
        const parsedReponse: OpenWeather.OneCallResponse = await resp.json();

        const skyWeatherList: OpenWeather.SkyWeather[] = [];

        skyWeatherList.push(parsedReponse.current.weather[0]);

        parsedReponse.daily.forEach((dailyWeather) => {
          skyWeatherList.push(dailyWeather.weather[0]);
        });

        mutationsOpenWeather.setSkyWeatherForCurrentSystemDateUpTo7Days(skyWeatherList);

        return parsedReponse;
      }
      throw resp;
    });
  }
};
