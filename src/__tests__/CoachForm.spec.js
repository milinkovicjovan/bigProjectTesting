import CoachForm from "../components/coaches/CoachForm.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/vue";
import "@testing-library/jest-dom";
import BaseButton from "../components/ui/BaseButton.vue";
import Router from "../router";

afterEach(cleanup);

describe("Checking forms", () => {
  const setup = () => {
    render(CoachForm, {
      global: {
        plugins: [Router],
        components: {
<<<<<<< HEAD
          "base-button": BaseButton,
        },
      },
=======
          "base-button": BaseButton
        }
      }
>>>>>>> 61aa7e1af1d931d447d8fc24bff329a85a033460
    });
  };

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
});
