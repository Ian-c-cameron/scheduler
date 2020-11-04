import React from "react";
import axios from "axios";

import {
  render,
  cleanup,
  waitForElement,
  fireEvent,
  getByText, 
  getAllByTestId,
  getByAltText,
  getByPlaceholderText,
  queryByText,
  waitForElementToBeRemoved,
  prettyDOM } from "@testing-library/react";

import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("changes the schedule when a new day is selected", async () => {
    const { getByText } = render(<Application />);

    await waitForElement(() => getByText("Monday"));

    fireEvent.click(getByText("Tuesday"));

    expect(getByText("Leopold Silvers")).toBeInTheDocument();
  });

  it("loads data, books an interview and reduces the spots remaining for the first day by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment")[0];

    fireEvent.click(getByAltText(appointment, "Add"));
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment,"Saving")).toBeInTheDocument();
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,"no spots remaining")).toBeInTheDocument();
  });

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce({
      status: 500,
      statusText: "Internal Server Error"
    });
  
    // 1. Render the Application.
    const { container } = render(<Application />);
    
    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the alt="Edit" button on the first booked appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. change the student name shown
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. select a new interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. click save
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the Saving status comes up
    expect(getByText(appointment,"Saving")).toBeInTheDocument();

    // 8. Wait for the appoint to display
    await waitForElement(() => getByText(appointment, "Could not save appointment."));

    // 9. click close button
    fireEvent.click(getByAltText(appointment, "Close"));

    //10. verify that the appointment is in show mode
    expect(getByText(appointment,"Archie Cohen")).toBeInTheDocument();

    // 11. check that the number of spots hasn't changed
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,"1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the alt="Edit" button on the first booked appointment.
    fireEvent.click(getByAltText(appointment, "Edit"));

    // 4. change the student name shown
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });

    // 5. select a new interviewer
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));

    // 6. click save
    fireEvent.click(getByText(appointment, "Save"));

    // 7. Check that the Saving status comes up
    expect(getByText(appointment,"Saving")).toBeInTheDocument();

    // 8. Wait for the appoint to display
    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    // 9. check that the number of spots hasn't changed
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,"1 spot remaining")).toBeInTheDocument();
  });

  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce({
      status: 500,
      statusText: "Internal Server Error"
    });

    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the alt="Delete" button on the first booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that "Delete the appointment?" shown
    expect(getByText(appointment,"Delete the appointment?")).toBeInTheDocument();

    // 5. click the Cancel button.
    fireEvent.click(getByText(appointment, "Cancel"));

    // 6. confirm that the booked appointment is back and spots remaining hasn't changed
    expect(getByText(appointment,"Archie Cohen")).toBeInTheDocument();

    // 7. repeat step 3 and 4
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment,"Delete the appointment?")).toBeInTheDocument();

    // 8. Click the Confirm button.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 9. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment,"Deleting")).toBeInTheDocument();

    // 10. Wait until the error is displayed when delete fails.
    await waitForElement(() => getByText(appointment, "Could not delete appointment."));

    // 9. click close button
    fireEvent.click(getByAltText(appointment, "Close"));

    //10. verify that the appointment is in show mode
    expect(getByText(container ,"Archie Cohen")).toBeInTheDocument();

    // 11. check that the number of spots hasn't changed
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,"1 spot remaining")).toBeInTheDocument();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    // 1. Render the Application.
    const { container } = render(<Application />);

    // 2. Wait until the text "Archie Cohen" is displayed.
    await waitForElement(() => getByText(container, "Archie Cohen"));
    
    const appointment = getAllByTestId(container, "appointment").find(appointment =>
      queryByText(appointment, "Archie Cohen")
    );

    // 3. Click the alt="Delete" button on the first booked appointment.
    fireEvent.click(getByAltText(appointment, "Delete"));

    // 4. Check that "Delete the appointment?" shown
    expect(getByText(appointment,"Delete the appointment?")).toBeInTheDocument();

    // 5. click the Cancel button.
    fireEvent.click(getByText(appointment, "Cancel"));

    // 6. confirm that the booked appointment is back and spots remaining hasn't changed
    expect(getByText(appointment,"Archie Cohen")).toBeInTheDocument();

    // 7. repeat step 3 and 4
    fireEvent.click(getByAltText(appointment, "Delete"));
    expect(getByText(appointment,"Delete the appointment?")).toBeInTheDocument();

    // 8. Click the Confirm button.
    fireEvent.click(getByText(appointment, "Confirm"));

    // 9. Check that the element with the text "Deleting" is displayed.
    expect(getByText(appointment,"Deleting")).toBeInTheDocument();

    // 10. Wait until the deleting message disappears.
    await waitForElementToBeRemoved(() => getByText(appointment, "Deleting"));

    // 11. confirm that Archie Cohen isn't displayed.
    expect(queryByText(appointment,"Archie Cohen")).not.toBeInTheDocument();

    // 12. Check that the DayListItem with the text "Monday" also has the text "2 spots remaining".
    const day = getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day,"2 spots remaining")).toBeInTheDocument();
  });
  
  

});

