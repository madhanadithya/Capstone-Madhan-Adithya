import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import Add from "./Add";

global.fetch = jest.fn();

beforeEach(() => {
  fetch.mockClear();
});

describe("Add Component", () => {
  test("renders form elements", () => {
    render(<Add />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/image url/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add category/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /add service type/i })
    ).toBeInTheDocument();
  });

  test("fetches categories on mount", async () => {
    const categories = [
      { _id: "1", name: "Category 1" },
      { _id: "2", name: "Category 2" },
    ];
    fetch.mockResolvedValueOnce({
      ok: true,
      json: jest.fn().mockResolvedValueOnce(categories),
    });

    render(<Add />);

    expect(fetch).toHaveBeenCalledWith(
      "http://localhost:5001/api/admin/categories",
      {
        headers: {
          "x-auth-token": null, 
        },
      }
    );

    await waitFor(() => {
      expect(screen.getByText(/category 1/i)).toBeInTheDocument();
      // expect(screen.getByText(/category 2/i)).toBeInTheDocument();
    });
  });

  test("submits form with category", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<Add />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Category" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "http://example.com/image.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(
        "http://localhost:5001/api/admin/categories",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-auth-token": null,
          },
          body: JSON.stringify({
            name: "New Category",
            image: "http://example.com/image.jpg",
          }),
        }
      );
    });
  });

  test("displays success snackbar after successful submission", async () => {
    fetch.mockResolvedValueOnce({ ok: true });

    render(<Add />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Category" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "http://example.com/image.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    await waitFor(() => {
      expect(
        screen.getByText(/category added successfully/i)
      ).toBeInTheDocument();
    });
  });

  test("displays error snackbar on failed submission", async () => {
    fetch.mockResolvedValueOnce({ ok: false });

    render(<Add />);

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: "New Category" },
    });
    fireEvent.change(screen.getByLabelText(/image url/i), {
      target: { value: "http://example.com/image.jpg" },
    });

    fireEvent.click(screen.getByRole("button", { name: /add category/i }));

    await waitFor(() => {
      expect(screen.getByText(/error adding category/i)).toBeInTheDocument();
    });
  });
});
