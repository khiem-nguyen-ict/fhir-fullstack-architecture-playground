import React from "react";
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import LoadingList from "./LoadingList.jsx";

describe("LoadingList", () => {
  it("renders spinner when loading is true", () => {
    render(
      <LoadingList loading={true}>
        <div>Content</div>
      </LoadingList>
    );

    expect(document.querySelector(".MuiCircularProgress-root")).toBeDefined();
    expect(screen.getByText("Content")).toBeDefined();
  });

  it("renders children when loading is false", () => {
    render(
      <LoadingList loading={false}>
        <div>Content</div>
      </LoadingList>
    );

    expect(screen.getByText("Content")).toBeDefined();
    expect(document.querySelector(".MuiCircularProgress-root")).toBeNull();
  });

  it("renders children after loading completes", async () => {
    const { rerender } = render(
      <LoadingList loading={true}>
        <div>Content</div>
      </LoadingList>
    );

    expect(document.querySelector(".MuiCircularProgress-root")).toBeDefined();
    expect(screen.getByText("Content")).toBeDefined();

    rerender(
      <LoadingList loading={false}>
        <div>Content</div>
      </LoadingList>
    );

    expect(screen.getByText("Content")).toBeDefined();
    expect(document.querySelector(".MuiCircularProgress-root")).toBeNull();
  });
});