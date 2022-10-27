import axios from "axios";

export default {
  async registerCoach(context, data) {
    const userId = context.rootGetters.userId;
    const coachData = {
      firstName: data.first,
      lastName: data.last,
      description: data.desc,
      hourlyRate: data.rate,
      areas: data.areas,
    };

    const token = context.rootGetters.token;

    const response = await axios({
      method: "PUT",
      url:
        `https://project-for-composition-api-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` +
        token,
      data: coachData,
    });

    if (!response.statusText === "ok") {
      // error ...
    }

    context.commit("registerCoach", {
      ...coachData,
      id: userId,
    });
  },
  async loadCoaches(context, payload) {
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }

    const baseUrl =
      "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches.json";

    const response = await axios.get(baseUrl);
    const responseData = await response.data;

    if (!response.statusText === "ok") {
      const error = new Error(error.message || "Failed to fetch!");
      throw error;
    }

    const coaches = [];

    for (let key in responseData) {
      const coach = {
        id: key,
        firstName: responseData[key].firstName,
        lastName: responseData[key].lastName,
        description: responseData[key].description,
        hourlyRate: responseData[key].hourlyRate,
        areas: responseData[key].areas,
      };
      coaches.push(coach);
    }

    context.commit("setCoaches", coaches);
    context.commit("setFetchTimestamp");
  },
};
