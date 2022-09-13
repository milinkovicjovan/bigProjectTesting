import CoachForm from "../components/coaches/CoachForm.vue";
import "@testing-library/jest-dom/extend-expect";
import { render, screen } from "@testing-library/vue";
import "@testing-library/jest-dom";
import BaseButton from "../components/ui/BaseButton.vue";
import Router from "../router";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";
import { setupServer } from "msw/node";

// const coachData = {
//   firstName: data.first,
//   lastName: data.last,
//   description: data.desc,
//   hourlyRate: data.rate,
//   areas: data.areas,
// };

const server = setupServer(
  rest.put(
    "https://project-for-composition-api-default-rtdb.firebaseio.com/coaches/7yfLWMPadTXNo3xPSCb4lNZo4Y13.json?auth=eyJhbGciOiJSUzI1NiIsImtpZCI6ImVkNmJjOWRhMWFmMjM2ZjhlYTU2YTVkNjIyMzQwMWZmNGUwODdmMTEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vcHJvamVjdC1mb3ItY29tcG9zaXRpb24tYXBpIiwiYXVkIjoicHJvamVjdC1mb3ItY29tcG9zaXRpb24tYXBpIiwiYXV0aF90aW1lIjoxNjYyOTc3MDE1LCJ1c2VyX2lkIjoiN3lmTFdNUGFkVFhObzN4UFNDYjRsTlpvNFkxMyIsInN1YiI6Ijd5ZkxXTVBhZFRYTm8zeFBTQ2I0bE5abzRZMTMiLCJpYXQiOjE2NjI5NzcwMTUsImV4cCI6MTY2Mjk4MDYxNSwiZW1haWwiOiJ0ZXN0YXV0aEBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6ZmFsc2UsImZpcmViYXNlIjp7ImlkZW50aXRpZXMiOnsiZW1haWwiOlsidGVzdGF1dGhAZ21haWwuY29tIl19LCJzaWduX2luX3Byb3ZpZGVyIjoicGFzc3dvcmQifX0.OQm5o_EnITTneKTfYQY82VGcY2F0W7ygWbTlZPD8U857ps4Jg2Xu6P-Mqo3DfDTO2u8AaaaFgLhBiSoTpaTHw_LlpsYarUxbHWmL1td7-AWYv_uiQxP1_krY2gIxY0aXoBzpD_av8pjNR6V_tHEWoDgN9maBq616KbpUszt8mBnLatmjK9Uu0uTHTfo55GtgfMnHptmEQGtfy9D6_yiW8mJDWIyfdkTzkZIWNQzBVLQRkSPiQSspfBR_G1Xvz_6qU_Iw6dFAYyrFhvhqu4F54rnF-X4J6Jk-PFM_JUR_Zj49YvbLoBu9Cq2KnEinGX49ypDrdyShx4Cy1QrYVk_2-w",
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
let firstNameInput, lastNameInput, button;
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
    const setupFilled = async () => {
      await setup();
      await userEvent.type(firstNameInput, "Jovan");
      await userEvent.type(lastNameInput, "Milinkovic");
    };
    it("displays registration fail message when input field is empty", async () => {
      await setupFilled();
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
    // it("shows error if Firstname is empty", async () => {
    //   setup();
    //   const firstNameInput = screen.queryByLabelText("Firstname");
    //   await userEvent.type(firstNameInput, "Jovan");
    //   await userEvent.clear(firstNameInput);
    //   const button = screen.queryByRole("button", { name: "Register" });
    //   userEvent.click(button);
    //   expect(
    //     screen.getByText("Firstname must not be empty.")
    //   ).toBeInTheDocument();
    // });
  });
  //   describe("Interactions", () => {
  //     let firstName, lastName, description, hourlyRate, button;
  //     const setup = async () => {
  //       render(CoachForm, {
  //         global: {
  //           plugins: [Router],
  //           components: {
  //             "base-button": BaseButton,
  //           },
  //         },
  //       });
  //       firstName = screen.queryByLabelText("Firstname");
  //       lastName = screen.queryByLabelText("Lastname");
  //       description = screen.queryByLabelText("Description");
  //       hourlyRate = screen.queryByLabelText("Hourly Rate");
  //       button = screen.queryByRole("button", { name: "Register" });
  //       button = screen.queryByRole("Areas");
  //       await userEvent.type(firstName, "Jovan");
  //       await userEvent.type(lastName, "Milinkovic");
  //       await userEvent.type(description, "Frontend");
  //       await userEvent.type(hourlyRate, "40");
  //     };
  //     it("sends data to backend after clicking the button", async () => {
  //       setup();
  //       const firstName = screen.queryByLabelText("Firstname");
  //       const lastName = screen.queryByLabelText("Lastname");
  //       const description = screen.queryByLabelText("Description");
  //       const hourlyRate = screen.queryByLabelText("Hourly Rate");
  //       const checkboxLabel = screen.queryByLabelText("Frontend Development");
  //       await userEvent.type(firstName, "Jovan");
  //       await userEvent.type(lastName, "Milinkovic");
  //       await userEvent.type(description, "Frontend");
  //       await userEvent.type(hourlyRate, "40");
  //       await userEvent.click(checkboxLabel);
  //       const button = screen.queryByRole("button", { name: "Register" });
  //       await userEvent.click(button);

  //       expect(checkboxLabel).toHaveLength();
  //     });
  //   });
});
