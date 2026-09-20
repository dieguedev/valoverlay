import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Header } from "./Header";

describe("Header", () => {
  it("enlaza el logo al home", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(screen.getByRole("link", { name: /valoverlay/i })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("enlaza a iniciar sesión", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /iniciar sesión/i }),
    ).toHaveAttribute("href", "/login");
  });

  it("enlaza a crear cuenta", () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /crear cuenta/i }),
    ).toHaveAttribute("href", "/register");
  });
});
