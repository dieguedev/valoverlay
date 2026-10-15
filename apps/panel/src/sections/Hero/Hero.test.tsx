import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Hero } from "./Hero";

const renderHero = () =>
  render(
    <MemoryRouter>
      <Hero />
    </MemoryRouter>,
  );

describe("Hero", () => {
  it("renderiza el heading principal", () => {
    renderHero();

    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      /overlay/i,
    );
  });

  it("el CTA primario enlaza a registro", () => {
    renderHero();

    expect(screen.getByRole("link", { name: /crear cuenta/i })).toHaveAttribute(
      "href",
      "/register",
    );
  });

  it("el CTA secundario enlaza al ancla de cómo funciona", () => {
    renderHero();

    expect(screen.getByRole("link", { name: /cómo funciona/i })).toHaveAttribute(
      "href",
      "#como-funciona",
    );
  });
});
