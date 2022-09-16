import "whatwg-fetch";
import CoachForm from "../components/coaches/CoachForm.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import BaseButton from "../components/ui/BaseButton.vue";
import Router from "../router";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

const server = setupServer(
  rest.put(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches/7yfLWMPadTXNo3xPSCb4lNZo4Y13.json",
    (req, res, ctx) => {
      console.log("mock");
      return res(
        ctx.json({
          firstName: "Jovan",
          lastName: "Milinkovic",
          description: "Frontend",
          hourlyRate: 40,
          areas: "Frontend",
        })
      );
    }
  )
);

beforeAll(() => {
  server.listen();
});

afterAll(() => {
  server.close();
});
let firstNameInput, lastNameInput, descriptionTextarea, button;
describe("Coach Form Page", () => {
  const setup = () => {
    render(CoachForm, {
      global: {
        plugins: [Router],
        components: {
          "base-button": BaseButton,
        },
      },
    });

    firstNameInput = screen.queryByLabelText("Firstname");
    lastNameInput = screen.queryByLabelText("Lastname");
    descriptionTextarea = screen.queryByLabelText("Description");
    button = screen.queryByRole("button", { name: "Register" });
  };
  // working
  describe("Checking inputs", () => {
    it("has Areas of Expertise heading", () => {
      setup();
      const header = screen.queryByRole("heading", {
        name: "Areas of Expertise",
      });
      expect(header).toBeInTheDocument();
    });
    it("has Firstname Input", () => {
      setup();
      const firstNameInput = screen.queryByLabelText("Firstname");
      expect(firstNameInput).toBeInTheDocument();
    });
    it("has Lastname Input", () => {
      setup();
      const lastNameInput = screen.queryByLabelText("Lastname");
      expect(lastNameInput).toBeInTheDocument();
    });
    it("has description textarea", () => {
      setup();
      const descriptionTextarea = screen.queryByLabelText("Description");
      expect(descriptionTextarea).toBeInTheDocument();
    });
    it("has hourly rate input", () => {
      setup();
      const hourlyRateInput = screen.queryByLabelText("Hourly Rate");
      expect(hourlyRateInput).toBeInTheDocument();
    });
    it("has checkbox", () => {
      setup();
      const checkboxLabel = screen.queryByLabelText("Frontend Development");
      expect(checkboxLabel).toBeInTheDocument();
    });
    it("has checkbox", () => {
      setup();
      const checkboxLabel = screen.queryByLabelText("Backend Development");
      expect(checkboxLabel).toBeInTheDocument();
    });
    it("has checkbox", () => {
      setup();
      const checkboxLabel = screen.queryByLabelText("Career Advisory");
      expect(checkboxLabel).toBeInTheDocument();
    });
    it("has button", () => {
      setup();
      const button = screen.queryByRole("button", { name: "Register" });
      expect(button).toBeInTheDocument();
    });
    it("displays registration fail message when input field is empty", async () => {
      await setup();
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
