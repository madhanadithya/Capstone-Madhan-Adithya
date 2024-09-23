// Admin.test.js

import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import Admin from "./Admin";

// Mock the child components
jest.mock("./Manage", () => () => <div>Manage Component</div>);
jest.mock("./Add", () => () => <div>Add Component</div>);
jest.mock("./Users", () => () => <div>Users Component</div>);

describe("Admin Component", () => {
  test("renders Manage tab by default", () => {
    render(<Admin />);
    expect(screen.getByText(/manage component/i)).toBeInTheDocument();
  });

  test("renders Add tab content when Add tab is clicked", () => {
    render(<Admin />);

    fireEvent.click(screen.getByText(/add/i));

    expect(screen.getByText(/add component/i)).toBeInTheDocument();
    expect(screen.queryByText(/manage component/i)).not.toBeInTheDocument();
  });

  test("renders Users tab content when Users tab is clicked", () => {
    render(<Admin />);

    fireEvent.click(screen.getByText(/users/i));

    expect(screen.getByText(/users component/i)).toBeInTheDocument();
    expect(screen.queryByText(/manage component/i)).not.toBeInTheDocument();
  });

  test("renders Manage tab content again when Manage tab is clicked", () => {
    render(<Admin />);

    fireEvent.click(screen.getByText(/add/i)); // Switch to Add
    fireEvent.click(screen.getByText(/manage/i)); // Switch back to Manage

    expect(screen.getByText(/manage component/i)).toBeInTheDocument();
    expect(screen.queryByText(/add component/i)).not.toBeInTheDocument();
  });
});
