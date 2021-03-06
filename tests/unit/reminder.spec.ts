import { mount, createLocalVue } from "@vue/test-utils";
import Vuetify from "vuetify";
import Reminder from "../../src/components/Reminder/Reminder.vue";
import cities from "../../src/const/cities.json";
import dayjs from "dayjs";

describe("Reminder.vue", () => {
  it("should render reminder input fields", () => {
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

  it("init a reminder, put data and add in reminders list", async () => {
    const wrapper = mount(Reminder, {
      localVue: createLocalVue(),
      vuetify: new Vuetify(),
      propsData: {
        currentDateSelected: dayjs().format("YYYY-MM-DD"),
        reminder: null,
        allReminders: []
      }
    });

    expect(wrapper.find('[data-testid="reminder-modal"]').exists()).toBe(true);

    await wrapper.find('[data-testid="reminder-description"]').setValue("My Reminder");
    expect(wrapper.vm.$data.description).toBe("My Reminder");
    expect(wrapper.find('[data-testid="reminder-weather"]').exists()).toBeFalsy();

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

    /* Assuming no weather forecast returned. 
    I did it this way because I don't know for sure how to assemble the test considering 
    that the method in the component makes a request that populates the observable. */
    await wrapper.setData({
      isUpdatingWeather: false
    });

    expect(wrapper.find('[data-testid="reminder-weather"]').exists()).toBeTruthy();
    expect(wrapper.find('[data-testid="reminder-no-weather-forecast"]').exists()).toBeTruthy();

    const color = wrapper.findAll(".v-color-picker__swatch").at(0).find(".v-color-picker__color");
    await color.trigger("click");

    expect(wrapper.vm.$data.color).toBe("#B71C1C");
    expect(wrapper.vm.$data.time).toBe("12:00");

    expect(wrapper.find('[data-testid="reminder-btn-save-update"]').text()).toBe("Add");
    await wrapper.find('[data-testid="reminder-btn-save-update"]').trigger("click");
  });
});
