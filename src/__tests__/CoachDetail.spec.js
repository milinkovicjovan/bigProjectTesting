import CoachDetail from "../pages/coaches/CoachDetail.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseBadge from "../components/ui/BaseBadge.vue";
import Router from "../router";
import store from "../store/modules/coaches";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.post(
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
describe("Coach Detail page", () => {
  const setup = () => {
    render(CoachDetail, {
      global: {
        plugins: [Router],
        components: {
          "base-button": BaseButton,
          "base-card": BaseCard,
          "base-badge": BaseBadge,
        },
        provide: {
          store,
        },
      },
    });
  };

  describe("Layout", () => {
    it("has props heading", async () => {
      setup();
      const id = await screen.findByText("Jovan Milinkovic");
      expect(id).toBeInTheDocument();
    });
  });
});
