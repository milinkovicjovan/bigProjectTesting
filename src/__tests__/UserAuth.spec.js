import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { createStore } from "vuex";
import { createMemoryHistory, createRouter } from "vue-router";
import UserAuth from "../pages/auth/UserAuth.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseDialog from "../components/ui/BaseDialog.vue";
import BaseSpinner from "../components/ui/BaseDialog.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import RouterView from "../components/layout/RouterView.vue";
import auth from "../store/modules/auth/index";

const storeInstance = createStore({
  modules: {
    auth: {
      ...auth,
    },
  },
});

const history = createMemoryHistory();
history.push("/auth");

const router = createRouter({
  history: history,
  routes: [{ path: "/auth", component: UserAuth }],
});

const setup = async () => {
  render(RouterView, {
    global: {
      plugins: [router, storeInstance],
      components: {
        "base-button": BaseButton,
        "base-dialog": BaseDialog,
        "base-spinner": BaseSpinner,
        "base-card": BaseCard,
      },
    },
  });
  await router.isReady();
};

describe("User Auth Page", () => {
  describe("Layout", () => {
    it("has E-mail label", async () => {
      await setup();
      const input = screen.queryByLabelText("E-Mail");
      expect(input).toBeInTheDocument();
    });

    it("has password input", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");
      expect(input).toBeInTheDocument();
    });

    it("has password type for password input", async () => {
      await setup();
      const input = screen.queryByLabelText("Password");
      expect(input.type).toBe("password");
    });

    it("has Login button", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Login" });
      expect(button).toBeInTheDocument();
    });

    it("has Sign Up instead button", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Signup instead" });
      expect(button).toBeInTheDocument();
    });

    it("has Login up instead button", async () => {
      await setup();
      const button2 = screen.queryByRole("button", { name: "Signup instead" });
      await userEvent.click(button2);
      const button = await screen.queryByRole("button", {
        name: "Login instead",
      });
      expect(button).toBeInTheDocument();
    });

    it("displays registration fail message when input field is empty", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Login" });
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Please enter a valid email and password (must be at least 6 characters long)."
      );
      expect(errorMessage).toBeInTheDocument();
    });
  });
});
