import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom/extend-expect";
import "@testing-library/jest-dom";
import { createMemoryHistory, createRouter } from "vue-router";
import { setupServer } from "msw/node";
import { rest } from "msw";
import { createStore } from "vuex";
import CoachesList from "../pages/coaches/CoachesList.vue";
import CoachItem from "../components/coaches/CoachItem.vue";
import CoachFilter from "../components/coaches/CoachFilter.vue";
import CoachDetail from "../pages/coaches/CoachDetail.vue";
import ContactCoach from "../pages/requests/ContactCoach.vue";
import UserAuth from "../pages/auth/UserAuth.vue";
import BaseButton from "../components/ui/BaseButton.vue";
import BaseDialog from "../components/ui/BaseDialog.vue";
import BaseSpinner from "../components/ui/BaseSpinner.vue";
import BaseCard from "../components/ui/BaseCard.vue";
import BaseBadge from "../components/ui/BaseBadge.vue";
import RouterView from "../components/layout/RouterView.vue";
import coaches from "../store/modules/coaches/index.js";

const storeInstance = createStore({
  modules: {
    coaches: {
      ...coaches,
    },
  },
});

const data = {
  "7yfLWMPadTXNo3xPSCb4lNZo4Y13": {
    id: "7yfLWMPadTXNo3xPSCb4lNZo4Y13",
    firstName: "Jovan",
    lastName: "Milinkovic",
    hourlyRate: 40,
    description: "Frontend",
    areas: ["frontend"],
  },
  TKeA5tGlQORC5rmv4IxgZJLOSgN2: {
    id: "TKeA5tGlQORC5rmv4IxgZJLOSgN2",
    firstName: "Manuelo",
    lastName: "Lorenzo",
    hourlyRate: 60,
    description: "Backend Developer",
    areas: ["backend"],
  },
  mYZcERu9AMQVCAehphi3QnNQLdv2: {
    id: "mYZcERu9AMQVCAehphi3QnNQLdv2",
    firstName: "Elena",
    lastName: "Stivens",
    hourlyRate: 30,
    description: "Career Advisor",
    areas: ["career"],
  },
};

const server = setupServer(
  rest.get(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches.json",
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
history.push("/coaches");

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
    { path: "/auth", component: UserAuth, meta: { requiresUnauth: true } },
  ],
});

describe("Coaches List Page", () => {
  const setup = async () => {
    render(RouterView, {
      global: {
        plugins: [router, storeInstance],
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
    await router.isReady();
  };

  describe("Layout", () => {
    it("has heading Find Your Coach", async () => {
      await setup();
      const heading = screen.queryByRole("heading", {
        name: "Find Your Coach",
      });
      expect(heading).toBeInTheDocument();
    });

    it("has button Refresh", async () => {
      await setup();
      const button = screen.queryByRole("button", { name: "Refresh" });
      expect(button).toBeInTheDocument();
    });

    it("has button Login to Register as Coach", async () => {
      await setup();
      const button = screen.queryByRole("link", {
        name: "Login to Register as Coach",
      });
      expect(button).toBeInTheDocument();
    });

    it("displays spinner during loading coaches", async () => {
      await setup();
      const spinner = screen.queryByRole("status");
      expect(spinner).toBeVisible();
    });

    it("has coach 'Jovan Milinkovic'", async () => {
      await setup();
      const coach = await screen.findByTestId("7yfLWMPadTXNo3xPSCb4lNZo4Y13");
      const heading = await screen.findByText("Jovan Milinkovic");
      const hourlyRate = await screen.findByText("$40/hour");
      const areas = await screen.findByText("FRONTEND");
      expect(coach).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(hourlyRate).toBeInTheDocument();
      expect(areas).toBeInTheDocument();
    });

    it("has coach 'Manuelo Lorenzo'", async () => {
      await setup();
      const coach = await screen.findByTestId("TKeA5tGlQORC5rmv4IxgZJLOSgN2");
      const heading = await screen.findByText("Manuelo Lorenzo");
      const hourlyRate = await screen.findByText("$60/hour");
      const areas = await screen.findByText("BACKEND");
      expect(coach).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(hourlyRate).toBeInTheDocument();
      expect(areas).toBeInTheDocument();
    });

    it("has coach 'Elena Stivens'", async () => {
      await setup();
      const coach = await screen.findByTestId("mYZcERu9AMQVCAehphi3QnNQLdv2");
      const heading = await screen.findByText("Elena Stivens");
      const hourlyRate = await screen.findByText("$30/hour");
      const areas = await screen.findByText("CAREER");
      expect(coach).toBeInTheDocument();
      expect(heading).toBeInTheDocument();
      expect(hourlyRate).toBeInTheDocument();
      expect(areas).toBeInTheDocument();
    });

    it("has Contact button", async () => {
      await setup();
      const button = await screen.findAllByText("Contact");
      expect(button[2]).toBeInTheDocument();
    });

    it("has View Details button", async () => {
      await setup();
      const button = await screen.findAllByText("View Details");
      expect(button[2]).toBeInTheDocument();
    });
  });
});
