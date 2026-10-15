import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { Faq } from "./Faq";

describe("Faq", () => {
  it("renderiza al menos 3 preguntas como botones", () => {
    render(<Faq />);

    expect(screen.getAllByRole("button").length).toBeGreaterThanOrEqual(3);
  });

  it("la respuesta está oculta antes de pulsar la pregunta", () => {
    render(<Faq />);

    expect(screen.getByRole("button", { name: /obs/i })).toBeInTheDocument();
    expect(screen.queryByText(/browser source/i)).not.toBeInTheDocument();
  });

  it("pulsar una pregunta muestra su respuesta", async () => {
    const user = userEvent.setup();
    render(<Faq />);

    await user.click(screen.getByRole("button", { name: /obs/i }));

    expect(screen.getByText(/browser source/i)).toBeInTheDocument();
  });

  it("pulsar de nuevo la misma pregunta oculta la respuesta", async () => {
    const user = userEvent.setup();
    render(<Faq />);
    const question = screen.getByRole("button", { name: /obs/i });

    await user.click(question);
    await user.click(question);

    expect(screen.queryByText(/browser source/i)).not.toBeInTheDocument();
  });
});
