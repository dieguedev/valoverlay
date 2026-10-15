import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HowItWorks } from "./HowItWorks";

describe("HowItWorks", () => {
  it("tiene el id de ancla como-funciona", () => {
    const { container } = render(<HowItWorks />);

    expect(container.querySelector("#como-funciona")).not.toBeNull();
  });

  it("renderiza el heading de la sección", () => {
    render(<HowItWorks />);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renderiza los 4 pasos del flujo", () => {
    render(<HowItWorks />);

    expect(screen.getAllByRole("listitem")).toHaveLength(4);
  });

  it("el segundo paso menciona vincular la cuenta de Riot", () => {
    render(<HowItWorks />);

    const [, secondStep] = screen.getAllByRole("listitem");

    expect(secondStep).toHaveTextContent(/riot/i);
    expect(secondStep).toHaveTextContent(/vincul/i);
  });
});
