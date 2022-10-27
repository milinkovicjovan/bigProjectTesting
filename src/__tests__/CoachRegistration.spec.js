import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { createStore } from "vuex";
import { createMemoryHistory, createRouter } from "vue-router";
import userEvent from "@testing-library/user-event";
import RouterView from "../components/layout/RouterView.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import CoachRegistration from "../pages/coaches/CoachRegistration";
import coaches from "../store/modules/coaches/index.js";

const storeInstance = createStore({
  modules: {
    coaches: {
      ...coaches,
    },
  },
});

const history = createMemoryHistory();
history.push("/register");

const router = createRouter({
  history: history,
  routes: [
    {
      path: "/register",
      component: CoachRegistration,
      meta: { requiresAuth: true },
    },
  ],
});

describe("Coach Registration Page", () => {
  const setup = async () => {
    render(RouterView, {
      global: {
        plugins: [router, storeInstance],
        components: {
          "base-button": BaseButton,
          "base-card": BaseCard,
        },
      },
    });
    await router.isReady();
  };

  describe("Checking inputs", () => {
    it("has Areas of Expertise heading", async () => {
      await setup();
      const header = screen.queryByRole("heading", {
        name: "Areas of Expertise",
      });
      expect(header).toBeInTheDocument();
    });

    it("has Firstname Input", async () => {
      await setup();
      const firstNameInput = screen.queryByLabelText("Firstname");
      expect(firstNameInput).toBeInTheDocument();
    });

    it("has Lastname Input", async () => {
      await setup();
      const lastNameInput = screen.queryByLabelText("Lastname");
      expect(lastNameInput).toBeInTheDocument();
    });

    it("has description textarea", async () => {
      await setup();
      const descriptionTextarea = screen.queryByLabelText("Description");
      expect(descriptionTextarea).toBeInTheDocument();
    });

    it("has hourly rate input", async () => {
      await setup();
      const hourlyRateInput = screen.queryByLabelText("Hourly Rate");
      expect(hourlyRateInput).toBeInTheDocument();
    });

    it("has checkbox", async () => {
      await setup();
      const checkboxLabel = screen.queryByLabelText("Frontend Development");
      expect(checkboxLabel).toBeInTheDocument();
    });

    it("has checkbox", async () => {
      await setup();
      const checkboxLabel = screen.queryByLabelText("Backend Development");
      expect(checkboxLabel).toBeInTheDocument();
    });

    it("has checkbox", async () => {
      await setup();
      const checkboxLabel = screen.queryByLabelText("Career Advisory");
      expect(checkboxLabel).toBeInTheDocument();
    });

    it("has button", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Register" });
      expect(button).toBeInTheDocument();
    });

    it("displays registration fail message when input field is empty", async () => {
      await setup();
      const descriptionTextarea = screen.queryByLabelText("Description");
      const button = screen.queryByRole("button", { name: "Register" });
      await userEvent.type(descriptionTextarea, "I am frontend developer");
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Firstname must not be empty."
      );
      const errorMessage2 = await screen.findByText(
        "Lastname must not be empty."
      );
      const errorMessage3 = await screen.findByText(
        "Please fix the above errors and submit again."
      );

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage2).toBeInTheDocument();
      expect(errorMessage3).toBeInTheDocument();
    });

    it("displays registration fail message when input field is empty", async () => {
      await setup();
      const firstNameInput = screen.queryByLabelText("Firstname");
      const lastNameInput = screen.queryByLabelText("Lastname");
      const button = screen.queryByRole("button", { name: "Register" });
      await userEvent.type(firstNameInput, "Jovan");
      await userEvent.type(lastNameInput, "Milinkovic");
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Description must not be empty."
      );
      const errorMessage2 = await screen.findByText(
        "Rate must be greater than 0."
      );
      const errorMessage3 = await screen.findByText(
        "At least one expertise must be selected."
      );
      const errorMessage4 = await screen.findByText(
        "Please fix the above errors and submit again."
      );

      expect(errorMessage).toBeInTheDocument();
      expect(errorMessage2).toBeInTheDocument();
      expect(errorMessage3).toBeInTheDocument();
      expect(errorMessage4).toBeInTheDocument();
    });
  });
});
