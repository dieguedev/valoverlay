import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Footer } from "./Footer";

describe("Footer", () => {
  it("enlaza a la política de privacidad", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /privacidad/i }),
    ).toHaveAttribute("href", "/privacy");
  });

  it("enlaza a los términos y condiciones", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /términos/i }),
    ).toHaveAttribute("href", "/terms");
  });

  it("muestra el nombre del producto en el copyright", () => {
    render(
      <MemoryRouter>
        <Footer />
      </MemoryRouter>,
    );

    expect(screen.getByText(/valoverlay/i)).toBeInTheDocument();
  });
});
