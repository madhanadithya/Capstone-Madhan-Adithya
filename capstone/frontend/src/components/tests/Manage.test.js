// Manage.test.js

import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Manage from "./Manage";
import axios from "axios";

jest.mock("axios");

const categoriesMock = [
  { _id: "1", name: "Category 1", image: "http://example.com/image1.jpg" },
  { _id: "2", name: "Category 2", image: "http://example.com/image2.jpg" },
];

const serviceTypesMock = [
  {
    _id: "1",
    name: "Service 1",
    image: "http://example.com/service1.jpg",
    category: "1",
  },
  {
    _id: "2",
    name: "Service 2",
    image: "http://example.com/service2.jpg",
    category: "2",
  },
];

describe("Manage Component", () => {
  beforeEach(() => {
    axios.get.mockImplementation((url) => {
      if (url.includes("categories")) {
        return Promise.resolve({ data: categoriesMock });
      }
      if (url.includes("service-types")) {
        return Promise.resolve({ data: serviceTypesMock });
      }
    });

    axios.put.mockResolvedValue({});
    axios.delete.mockResolvedValue({});
  });

  test("renders loading indicator initially", () => {
    render(<Manage />);
    expect(screen.getByRole("progressbar")).toBeInTheDocument();
  });

  test("renders categories after loading", async () => {
    render(<Manage />);
    await waitFor(() => {
      expect(screen.getByText(/manage data/i)).toBeInTheDocument();
    });

    expect(screen.getByText(/category 1/i)).toBeInTheDocument();
    expect(screen.getByText(/category 2/i)).toBeInTheDocument();
  });

  test("opens modal for editing a category", async () => {
    render(<Manage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/edit/i));
    });

    expect(screen.getByText(/edit category/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toHaveValue("Category 1");
  });

  test("submits the edited category", async () => {
    render(<Manage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/edit/i));
    });

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "Updated Category" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "http://example.com/updated.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /save/i }));

    await waitFor(() => {
      expect(axios.put).toHaveBeenCalledWith(
        "http://localhost:5001/api/admin/categories/1",
        { name: "Updated Category", image: "http://example.com/updated.jpg" },
        { headers: { "x-auth-token": expect.any(String) } }
      );
    });
  });

  test("deletes a category", async () => {
    render(<Manage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/delete/i));
    });

    await waitFor(() => {
      expect(axios.delete).toHaveBeenCalledWith(
        "http://localhost:5001/api/admin/categories/1",
        { headers: { "x-auth-token": expect.any(String) } }
      );
    });
  });

  test("renders service types when switched to Service Type tab", async () => {
    render(<Manage />);
    await waitFor(() => {
      fireEvent.click(screen.getByText(/service type/i));
    });

    expect(screen.getByText(/service 1/i)).toBeInTheDocument();
    expect(screen.getByText(/service 2/i)).toBeInTheDocument();
  });
});
