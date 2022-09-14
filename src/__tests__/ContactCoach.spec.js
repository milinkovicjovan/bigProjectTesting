import ContactCoach from "../pages/requests/ContactCoach.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import BaseButton from "../components/ui/BaseButton.vue";
import Router from "../router";
import store from "../store/modules/requests";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.post(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/requests/7yfLWMPadTXNo3xPSCb4lNZo4Y13.json",
    (req, res, ctx) => {
      console.log("mock");
      return res(
        ctx.json({
          userEmail: "testauth4444@gmail.com",
          message: "I am Frontend developer",
        })
      );
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
    rest.post(
      "https://project-for-composition-api-default-rtdb.firebaseio.com/requests/7yfLWMPadTXNo3xPSCb4lNZo4Y13.json",
      (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      }
    )
  );
});

let button;
const setup = async () => {
  render(ContactCoach, {
    global: {
      plugins: [Router],
      components: {
        "base-button": BaseButton,
      },
      provide: {
        store,
      },
    },
  });
  button = screen.queryByRole("button", { name: "Send Message" });
};

describe("Contact Coach page", () => {
  describe("Layout", () => {
    it("has Your E-Mail input", () => {
      setup();
      const input = screen.queryByLabelText("Your E-Mail");
      expect(input).toBeInTheDocument();
    });
    it("has Message text-area", () => {
      setup();
      const input = screen.queryByLabelText("Message");
      expect(input).toBeInTheDocument();
    });
    it("has Login button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Send Message" });
      expect(button).toBeInTheDocument();
    });
    it("displays registration fail message when input field is empty", async () => {
      await setup();
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Please enter a valid email and non-empty message."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
