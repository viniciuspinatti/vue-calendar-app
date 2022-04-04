import { mount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";
import Reminder from "../../src/components/Reminder/Reminder.vue";
import cities from "../../src/const/cities.json";
import dayjs from "dayjs";

describe("Reminder.vue", () => {
  it("should render reminder input fields", async () => {
    const wrapper = mount(Reminder, {
      localVue: createLocalVue(),
      vuetify: new Vuetify()
    });
    expect(wrapper.find('[data-testid="reminder-description"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="reminder-city-selected"]').exists()).toBe(true);
    expect(wrapper.vm.$data.citiesList.length).toBe(cities.length);
    expect(wrapper.find('[data-testid="reminder-color"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="reminder-time"]').exists()).toBe(true);
  });

  test("should set/has the values to reminder", async () => {
    const wrapper = mount(Reminder, {
      localVue: createLocalVue(),
      vuetify: new Vuetify(),
      data() {
        return {
          id: 0,
          description: "",
          time: "12:00",
          citiesList: cities,
          citySelected: null,
          hasRangeForShowWeather: false,
          color: "#333333",
          weather: null,
          isUpdatingWeather: false,
          action: "ADD"
        };
      },
      propsData: {
        currentDateSelected: dayjs().format("YYYY-MM-DD"),
        reminder: null
      }
    });

    await wrapper.find('[data-testid="reminder-description"]').setValue("My Reminder");
    expect(wrapper.vm.$data.description).toBe("My Reminder");

    await wrapper.vm.$nextTick();
    await wrapper.setData({
      citySelected: {
        name: "Birigui",
        stateCode: "SP",
        country: "Brasil",
        lat: -21.2892,
        lon: -50.3411
      }
    });

    expect(wrapper.vm.$data.citySelected.name).toBe("Birigui");
  });
});
