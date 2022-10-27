import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { createStore } from "vuex";
import { createMemoryHistory, createRouter } from "vue-router";
import coaches from "../store/modules/coaches";
import ContactCoach from "../pages/requests/ContactCoach.vue";
import CoachesList from "../pages/coaches/CoachesList.vue";
import CoachDetail from "../pages/coaches/CoachDetail.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseBadge from "../components/ui/BaseBadge.vue";
import RouterView from "../components/layout/RouterView.vue";

const storeInstance = createStore({
  modules: {
    coaches: {
      ...coaches,
      state: {
        coaches: [
          {
            id: "7yfLWMPadTXNo3xPSCb4lNZo4Y13",
            firstName: "Jovan",
            lastName: "Milinkovic",
            hourlyRate: 40,
            description: "Frontend",
            areas: ["frontend"],
          },
        ],
      },
    },
  },
});

const history = createMemoryHistory();
history.push("/coaches/7yfLWMPadTXNo3xPSCb4lNZo4Y13/contact");

const router = createRouter({
  history: history,
  routes: [
    { path: "/", redirect: "/coaches" },
    { path: "/coaches", component: CoachesList },
    {
      path: "/coaches/:id",
      component: CoachDetail,
      props: true,
      children: [{ path: "/coaches/:id/contact", component: ContactCoach }],
    },
  ],
});

describe("Contact Coach page", () => {
  const setup = async () => {
    render(RouterView, {
      global: {
        plugins: [router, storeInstance],
        components: {
          "base-button": BaseButton,
          "base-card": BaseCard,
          "base-badge": BaseBadge,
        },
      },
    });
    await router.isReady();
  };

  describe("Layout", () => {
    it("has Jovan Milinkovic name and rate of $40", async () => {
      await setup();
      const heading = await screen.findByText("Jovan Milinkovic");
      const hourlyRate = await screen.findByText("$40/hour");
      expect(heading).toBeInTheDocument();
      expect(hourlyRate).toBeInTheDocument();
    });

    it("has heading Interested? Reach out now!", async () => {
      await setup();
      const heading = screen.queryByRole("heading", {
        name: "Interested? Reach out now!",
      });
      expect(heading).toBeInTheDocument();
    });

    it("has Your E-Mail input", async () => {
      await setup();
      const input = screen.queryByLabelText("Your E-Mail");
      expect(input).toBeInTheDocument();
    });

    it("has Message text-area", async () => {
      await setup();
      const input = screen.queryByLabelText("Message");
      expect(input).toBeInTheDocument();
    });

    it("has Send Message button", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Send Message" });
      expect(button).toBeInTheDocument();
    });

    it("displays registration fail message when input field is empty", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Send Message" });
      await userEvent.click(button);
      const errorMessage = await screen.findByText(
        "Please enter a valid email and non-empty message."
      );
      expect(errorMessage).toBeInTheDocument();
    });

    it("has Frontend badge and description", async () => {
      await setup();
      const badge = await screen.findByText("FRONTEND");
      const description = await screen.findByText("Frontend");
      expect(badge).toBeInTheDocument();
      expect(description).toBeInTheDocument();
    });
  });
});
