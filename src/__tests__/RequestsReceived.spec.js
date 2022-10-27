import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { createMemoryHistory, createRouter } from "vue-router";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { createStore } from "vuex";
import RequestsReceived from "../pages/requests/RequestsReceived.vue";
import RequestItem from "../components/requests/RequestItem.vue";
import UserAuth from "../pages/auth/UserAuth.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseDialog from "../components/ui/BaseDialog.vue";
import BaseSpinner from "../components/ui/BaseSpinner.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import RouterView from "../components/layout/RouterView.vue";
import auth from "../store/modules/auth/index";
import requests from "../store/modules/requests/index";

const storeInstance = createStore({
  modules: {
    auth: {
      ...auth,
      state: {
        userId: "7yfLWMPadTXNo3xPSCb4lNZo4Y13",
        token: "eyJhbGciOiJSUzI1NiIs",
      },
    },
    requests: {
      ...requests,
    },
  },
});

const data = {
  "-NBsehNdG9NTuQxDR69B": {
    coachId: "7yfLWMPadTXNo3xPSCb4lNZo4Y13",
    id: "-NBsehNdG9NTuQxDR69B",
    message: "I am frontend developer",
    userEmail: "testauth4444@gmail.com",
  },
  "-NBvSvYvRc-AYIjrd1Zo": {
    coachId: "7yfLWMPadTXNo3xPSCb4lNZo4Y13",
    id: "-NBvSvYvRc-AYIjrd1Zo",
    message: "Poruka",
    userEmail: "testauth@gmail.com",
  },
};

const server = setupServer(
  rest.get(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/requests/7yfLWMPadTXNo3xPSCb4lNZo4Y13.json",
    (req, res, ctx) => {
      return res(ctx.status(200), ctx.json(data));
    }
  )
);

beforeAll(() => {
  server.listen({
    onUnhandledRequest: "warn",
  });
});

beforeEach(() => {
  server.resetHandlers();
});

afterAll(() => {
  server.close();
});

const history = createMemoryHistory();
history.push("/requests");

const router = createRouter({
  history: history,
  routes: [
    { path: "/auth", component: UserAuth, meta: { requiresUnauth: true } },
    {
      path: "/requests",
      component: RequestsReceived,
      meta: { requiresAuth: true },
    },
  ],
});

describe("Requests Received Page", () => {
  const setup = async () => {
    render(RouterView, {
      global: {
        plugins: [router, storeInstance],
        components: {
          "base-button": BaseButton,
          "base-dialog": BaseDialog,
          "base-spinner": BaseSpinner,
          "base-card": BaseCard,
          "request-item": RequestItem,
        },
      },
    });
    await router.isReady();
  };

  describe("Layout", () => {
    it("has heading Requests Received", async () => {
      await setup();
      const heading = screen.queryByRole("heading", {
        name: "Requests Received",
      });
      expect(heading).toBeInTheDocument();
    });

    it("has E-mail and message", async () => {
      await setup();
      const eMail = await screen.findByText("testauth4444@gmail.com");
      const message = await screen.findByText("I am frontend developer");
      expect(eMail).toBeInTheDocument();
      expect(message).toBeInTheDocument();
    });

    it("has E-mail and message", async () => {
      await setup();
      const eMail = await screen.findByText("testauth@gmail.com");
      const message = await screen.findByText("Poruka");
      // screen.debug();
      expect(eMail).toBeInTheDocument();
      expect(message).toBeInTheDocument();
    });
  });
});
