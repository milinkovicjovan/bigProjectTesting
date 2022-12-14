import fetch from "node-fetch";
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

    const response = await fetch(
      `https://project-for-composition-api-default-rtdb.firebaseio.com/coaches/${userId}.json?auth=` +
        token,
      {
        method: "PUT",
        body: JSON.stringify(coachData),
      }
    );

    // const responseData = await response.json();

    if (!response.ok) {
      // error ...
    }

    context.commit("registerCoach", {
      ...coachData,
      id: userId,
    });
  },
  async loadCoaches(context, payload) {
    // console.log("forceRefresh", payload.forceRefresh);
    // console.log("shouldUpdate", context.getters.shouldUpdate);
    // console.log(
    //   "Logical if",
    //   !payload.forceRefresh && !context.getters.shouldUpdate
    // );
    if (!payload.forceRefresh && !context.getters.shouldUpdate) {
      return;
    }

    // console.log("LoadCoaches action");
    console.log("this IS FETCH");
    console.log(fetch);

    const response = await fetch(
      "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches.json"
    );
    // console.log("this is Response", response);
    const responseData = await response.json();
    console.log("this is responseData", responseData);

    // console.log(response);
    if (!response.ok) {
      const error = new Error(responseData.message || "Failed to fetch!");
      throw error;
    }

    const coaches = [];
    // console.log(coaches);
    for (const key in responseData) {
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

    // console.log(coaches, "this is coaches");

    context.commit("setCoaches", coaches);
    context.commit("setFetchTimestamp");
  },
};
