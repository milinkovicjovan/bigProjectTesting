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
import Router from "../router";
// import userEvent from "@testing-library/user-event";
import store from "../store/modules/coaches";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.get(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches.json",
    (req, res, ctx) => {
      console.log("mock");
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

test("supports sign in user flow", () => {
  server.use(
    rest.get(
      "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches.json",
      (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      }
    )
  );
});

const setup = async () => {
  render(CoachesList, {
    global: {
      plugins: [Router],
      components: {
        "base-button": BaseButton,
        "base-dialog": BaseDialog,
        "base-spinner": BaseSpinner,
        "base-card": BaseCard,
        "coach-item": CoachItem,
        "coach-filter": CoachFilter,
      },
      template: `
      <coach-item>Jovan Milinkovic</coach-item>`,
      provide: {
        store,
      },
    },
  });
};

describe("Coaches List page", () => {
  describe("Layout", () => {
    it("has button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Refresh" });
      expect(button).toBeInTheDocument();
    });
    it("has heading for choosing filters", () => {
      setup();
      const heading = screen.queryByRole("heading", {
        name: "Find Your Coach",
      });
      expect(heading).toBeInTheDocument();
    });
    it("has heading for choosing filters", () => {
      setup();
      const heading = screen.queryByRole("heading", {
        name: "Jovan Milinkovic",
      });
      expect(heading).toBeInTheDocument();
    });
  });
});
