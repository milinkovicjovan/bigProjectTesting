import "whatwg-fetch";
import CoachesList from "../pages/coaches/CoachesList.vue";
import CoachItem from "../components/coaches/CoachItem.vue";
import CoachFilter from "../components/coaches/CoachFilter.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseDialog from "../components/ui/BaseDialog.vue";
import BaseSpinner from "../components/ui/BaseSpinner.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseBadge from "../components/ui/BaseBadge.vue";
import Router from "../router";
// import userEvent from "@testing-library/user-event";
import store from "../store/modules/coaches/index.js";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { createStore } from "vuex";

const storeInstance = createStore({
  modules: {
    coaches: store,
  },
});

const server = setupServer(
  rest.get(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches.json",
    (req, res, ctx) => {
      // console.log("THIS IS MOCK");
      return res(ctx.status(200));
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

const setup = async () => {
  // console.log(storeInstance.getters["coaches/loadCoaches"]);
  // console.log(store);
  render(CoachesList, {
    global: {
      plugins: [Router, storeInstance],
      components: {
        "base-button": BaseButton,
        "base-dialog": BaseDialog,
        "base-spinner": BaseSpinner,
        "base-card": BaseCard,
        "base-badge": BaseBadge,
        "coach-item": CoachItem,
        "coach-filter": CoachFilter,
      },
    },
  });
  await Router.isReady();
};

describe("Coaches List page", () => {
  describe("Layout", () => {
    it("has button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Refresh" });
      expect(button).toBeInTheDocument();
    });
    it("has button", () => {
      setup();
      const button = screen.queryByRole("link", {
        name: "Login to Register as Coach",
      });
      expect(button).toBeInTheDocument();
    });
    // it("has button", async () => {
    //   await setup();
    //   const button = screen.queryByRole("link", {
    //     name: "Contact",
    //   });
    //   expect(button).toBeInTheDocument();
    // });
    // it("has button", async () => {
    //   await setup();
    //   const button = screen.queryByRole("link", {
    //     name: "View Details",
    //   });
    //   expect(button).toBeInTheDocument();
    // });
    it("has heading for choosing filters", () => {
      setup();
      const heading = screen.queryByRole("heading", {
        name: "Find Your Coach",
      });
      expect(heading).toBeInTheDocument();
    });
    it("displays spinner during the api call is in progress", async () => {
      await setup();
      const spinner = screen.queryByRole("status");
      expect(spinner).toBeVisible();
    });
    // it("has text Jovan Milinkovic", async () => {
    //   await setup();
    //   const heading = await screen.getByText(/Jovan Milinkovic/i);
    //   expect(heading).toBeInTheDocument();
    // });
  });
});
