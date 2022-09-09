import CoachForm from "../components/coaches/CoachForm.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen, cleanup } from "@testing-library/vue";
import "@testing-library/jest-dom";

afterEach(cleanup);

describe("Checking forms", () => {
  it("has Areas of Expertise heading", () => {
    render(CoachForm);
    const header = screen.queryByRole("heading", {
      name: "Areas of Expertise",
    });
    expect(header).toBeInTheDocument();
  });
  it("has Firstname Input", () => {
    render(CoachForm);
    const firstNameInput = screen.queryByLabelText("Firstname");
    expect(firstNameInput).toBeInTheDocument();
  });
  it("has Lastname Input", () => {
    render(CoachForm);
    const lastNameInput = screen.queryByLabelText("Lastname");
    expect(lastNameInput).toBeInTheDocument();
  });
  it("has description textarea", () => {
    render(CoachForm);
    const descriptionTextarea = screen.queryByLabelText("Description");
    expect(descriptionTextarea).toBeInTheDocument();
  });
  it("has hourly rate input", () => {
    render(CoachForm);
    const hourlyRateInput = screen.queryByLabelText("Hourly Rate");
    expect(hourlyRateInput).toBeInTheDocument();
  });
  it("has checkbox", () => {
    render(CoachForm);
    const checkboxLabel = screen.queryByLabelText("Frontend Development");
    expect(checkboxLabel).toBeInTheDocument();
  });
  it("has checkbox", () => {
    render(CoachForm);
    const checkboxLabel = screen.queryByLabelText("Backend Development");
    expect(checkboxLabel).toBeInTheDocument();
  });
  it("has checkbox", () => {
    render(CoachForm);
    const checkboxLabel = screen.queryByLabelText("Career Advisory");
    expect(checkboxLabel).toBeInTheDocument();
  });
});
