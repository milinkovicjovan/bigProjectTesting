import axios from "axios";

export default {
  async contactCoach(context, payload) {
    const newRequest = {
      userEmail: payload.email,
      message: payload.message,
    };
    const response = await axios({
      method: "POST",
      url: `https://project-for-composition-api-default-rtdb.firebaseio.com/requests/${payload.coachId}.json`,
      data: newRequest,
    });

    const responseData = await response.data;

    if (response.status != 200) {
      const error = new Error(
        responseData.message || "Failed to send request."
      );
      throw error;
    }

    newRequest.id = responseData.name;
    //  newRequest.id = responseData.name (firebase Docs)
    newRequest.coachId = payload.coachId;
    // we add it in local data not sent to firebase

    context.commit("addRequest", newRequest);
  },
  async fetchRequests(context) {
    const coachId = context.rootGetters.userId;
    const token = context.rootGetters.token;
    const response = await axios.get(
      `https://project-for-composition-api-default-rtdb.firebaseio.com/requests/${coachId}.json?auth=` +
        token
    );

    const responseData = await response.data;

    if (!response.statusText === "ok") {
      const error = new Error(error.message || "Failed to fetch requests.");
      throw error;
    }

    const requests = [];

    for (const key in responseData) {
      const request = {
        id: key,
        coachId: coachId,
        userEmail: responseData[key].userEmail,
        message: responseData[key].message,
      };
      requests.push(request);
    }

    context.commit("setRequests", requests);
  },
};
