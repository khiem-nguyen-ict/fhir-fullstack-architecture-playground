import React from "react";
import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ConfirmDialog, { useConfirmDialog } from "./ConfirmDialog.jsx";
import PropTypes from "prop-types";

describe("ConfirmDialog", () => {
  it("renders with default props when open", () => {
    render(<ConfirmDialog open onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.getByRole("heading", { name: "Confirm" })).toBeTruthy();
    expect(screen.getByText("Are you sure?")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Confirm" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeTruthy();
  });

  it("renders custom title and message", () => {
    render(
      <ConfirmDialog
        open
        title="Delete Patient"
        message="Are you sure you want to delete?"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("heading", { name: "Delete Patient" })).toBeTruthy();
    expect(screen.getByText("Are you sure you want to delete?")).toBeTruthy();
  });

  it("renders custom button text", () => {
    render(
      <ConfirmDialog
        open
        confirmText="Delete"
        cancelText="Keep"
        onConfirm={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByRole("button", { name: "Delete" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Keep" })).toBeTruthy();
  });

  it("calls onConfirm when confirm button is clicked", () => {
    const mockOnConfirm = vi.fn();
    render(<ConfirmDialog open onConfirm={mockOnConfirm} onCancel={vi.fn()} />);
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    expect(mockOnConfirm).toHaveBeenCalled();
  });

  it("calls onCancel when cancel button is clicked", () => {
    const mockOnCancel = vi.fn();
    render(<ConfirmDialog open onConfirm={vi.fn()} onCancel={mockOnCancel} />);
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    expect(mockOnCancel).toHaveBeenCalled();
  });

  it("does not render dialog content when open is false", () => {
    render(<ConfirmDialog open={false} onConfirm={vi.fn()} onCancel={vi.fn()} />);
    expect(screen.queryByText("Confirm")).toBeNull();
  });
});

describe("useConfirmDialog integration", () => {
  function TestComponent({ onResult }) {
    const { showConfirmDialog, confirmDialogProps, confirm } = useConfirmDialog();
    return (
      <div>
        <button
          onClick={async () => {
            const result = await confirm({ title: "Test", message: "Test message" });
            onResult(result);
          }}
        >
          Open Dialog
        </button>
        <ConfirmDialog open={showConfirmDialog} {...confirmDialogProps} />
      </div>
    );
  }

  TestComponent.propTypes = {
    onResult: PropTypes.func,
  };

  it("confirm function opens dialog and returns true on confirm", async () => {
    const results = [];
    function handleResult(result) {
      results.push(result);
    }
    
    render(<TestComponent onResult={handleResult} />);
    
    expect(screen.queryByText("Test message")).toBeNull();
    
    fireEvent.click(screen.getByText("Open Dialog"));
    
    expect(screen.getByText("Test message")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Test" })).toBeTruthy();
    
    fireEvent.click(screen.getByRole("button", { name: "Confirm" }));
    
    await waitFor(() => {
      expect(results).toContain(true);
    });
  });

  it("confirm function returns false on cancel", async () => {
    const results = [];
    function handleResult(result) {
      results.push(result);
    }
    
    render(<TestComponent onResult={handleResult} />);
    
    fireEvent.click(screen.getByText("Open Dialog"));
    
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));
    
    await waitFor(() => {
      expect(results).toContain(false);
    });
  });
});