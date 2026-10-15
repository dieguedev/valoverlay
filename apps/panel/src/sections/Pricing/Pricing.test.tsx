import { render, screen, within } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { Pricing } from "./Pricing";

const proPlan = () =>
  within(screen.getByRole("article", { name: /^pro$/i }));

describe("Pricing", () => {
  it("renderiza las 2 tarjetas de plan", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(screen.getAllByRole("heading", { level: 3 })).toHaveLength(2);
  });

  it("el plan Pro lista 3 diferenciadores", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(proPlan().getAllByRole("listitem")).toHaveLength(3);
  });

  it("el plan Pro diferencia por más estadísticas o widgets", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(proPlan().getByText(/estadísticas|widgets/i)).toBeInTheDocument();
  });

  it("el plan Pro diferencia por personalización avanzada", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(
      proPlan().getByText(/personalización|marca de agua/i),
    ).toBeInTheDocument();
  });

  it("el plan Pro diferencia por acceso anticipado al editor drag & drop", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(proPlan().getByText(/drag.{0,3}drop|arrastrar/i)).toBeInTheDocument();
  });

  it("el CTA del plan Free enlaza a registro", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /empezar gratis/i }),
    ).toHaveAttribute("href", "/register");
  });

  it("el CTA del plan Pro enlaza a registro", () => {
    render(
      <MemoryRouter>
        <Pricing />
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /empezar con pro/i }),
    ).toHaveAttribute("href", "/register");
  });
});
