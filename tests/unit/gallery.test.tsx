// @vitest-environment jsdom
import { afterEach, expect, it } from "vitest";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import "@testing-library/jest-dom/vitest";
import { ProjectGallery } from "@/components/project-gallery";
import { fallbackPortfolio } from "@/content/portfolio";
afterEach(cleanup);
it("filters by category and search, then clears an empty result", () => {
  render(<ProjectGallery projects={fallbackPortfolio.projects} />);
  fireEvent.click(screen.getByRole("button", { name: "Deep Learning" }));
  expect(
    screen.getByRole("heading", { name: "Human activity recognition" }),
  ).toBeInTheDocument();
  expect(
    screen.queryByRole("heading", { name: "Fraud detection & risk scoring" }),
  ).not.toBeInTheDocument();
  fireEvent.change(screen.getByRole("textbox", { name: "Search projects" }), {
    target: { value: "unknown" },
  });
  expect(screen.getByText("No matching projects")).toBeInTheDocument();
  fireEvent.click(screen.getByRole("button", { name: /Show all work/ }));
  expect(screen.getAllByRole("article")).toHaveLength(3);
  expect(
    screen.getByRole("button", { name: "Project results page 1" }),
  ).toHaveAttribute("aria-current", "page");
  expect(
    screen.getByRole("button", { name: "Next project results page" }),
  ).toBeEnabled();
});
