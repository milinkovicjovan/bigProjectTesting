import UserAuth from "../pages/auth/UserAuth.vue";
import "@testing-library/jest-dom";
import {
  render,
  screen,
  //   waitForElementToBeRemoved,
} from "@testing-library/vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseDialog from "../components/ui/BaseDialog.vue";
import BaseSpinner from "../components/ui/BaseDialog.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import Router from "../router";
import store from "../store/modules/auth";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

let requestPayload;
const server = setupServer(
  rest.post(
    "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDEONB1RoTxq2oA77VNLUYFBC768JxGw6k",
    (req, res, ctx) => {
      console.log("mock");
      requestPayload = req.json();
      return res(
        ctx.status(200),
        ctx.json({
          email: "testauth@gmail.com",
          password: "testauth4444",
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
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDEONB1RoTxq2oA77VNLUYFBC768JxGw6k",
      (req, res, ctx) => {
        return res(ctx.json({ success: true }));
      }
    )
  );
});

let emailInput, passwordInput, button;
const setup = async () => {
  render(UserAuth, {
    global: {
      plugins: [Router],
      components: {
        "base-button": BaseButton,
        "base-dialog": BaseDialog,
        "base-spinner": BaseSpinner,
        "base-card": BaseCard,
      },
      provide: {
        store,
      },
    },
  });
  emailInput = screen.queryByLabelText("E-Mail");
  passwordInput = screen.queryByLabelText("Password");
  button = screen.queryByRole("button", { name: "Login" });
};

describe("UserAuth page", () => {
  describe("Layout", () => {
    it("has E-mail label", () => {
      setup();
      const input = screen.queryByLabelText("E-Mail");
      expect(input).toBeInTheDocument();
    });
    it("has password input", () => {
      setup();
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });
    it("has password type for password input", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });
    it("has Login button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument();
    });
    it("has Sign Up button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Signup instead" });
      expect(button).toBeInTheDocument();
    });
  });
  describe("Interactions", () => {
    const setupFilled = async () => {
      await setup();
      await userEvent.type(emailInput, "testauth@gmail.com");
      await userEvent.type(passwordInput, "testauth4444");
    };
    it("enables the button when email and password inputs are filled", async () => {
      await setupFilled();
      expect(button).toBeEnabled();
    });
    it("sends email and password to backend after clicking the button", async () => {
      await setupFilled();
      await userEvent.click(button);
      expect(requestPayload).toEqual({
        email: "testauth@gmail.com",
        password: "testauth4444",
      });
      screen.debug();
    });
    it("test writing in inputs", async () => {
      await setup();
      await userEvent.type(emailInput, "testauth@gmail.com");
      await userEvent.type(passwordInput, "testauth4444");
      await userEvent.click(button);
      expect(requestPayload).toEqual({
        email: "testauth@gmail.com",
        password: "testauth4444",
      });
    });
    it("displays registration fail message when input field is empty", async () => {
      await setup();
      await userEvent.type(emailInput, "user100@mail.com");
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Please enter a valid email and password (must be at least 6 characters long)."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
