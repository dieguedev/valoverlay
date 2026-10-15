import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Features } from "./Features";

const cardHeadings = () => screen.getAllByRole("heading", { level: 3 });

describe("Features", () => {
  it("renderiza el heading de la sección", () => {
    render(<Features />);

    expect(screen.getByRole("heading", { level: 2 })).toBeInTheDocument();
  });

  it("renderiza las 3 tarjetas de feature", () => {
    render(<Features />);

    expect(cardHeadings()).toHaveLength(3);
  });

  it("la tarjeta de overlay menciona OBS", () => {
    render(<Features />);

    expect(cardHeadings().some((h) => /obs/i.test(h.textContent ?? ""))).toBe(
      true,
    );
  });

  it("la tarjeta de panel menciona personalización", () => {
    render(<Features />);

    expect(
      cardHeadings().some((h) => /panel|customiza/i.test(h.textContent ?? "")),
    ).toBe(true);
  });

  it("la tarjeta de tiempo real menciona actualización en vivo", () => {
    render(<Features />);

    expect(
      cardHeadings().some((h) =>
        /tiempo real|en vivo/i.test(h.textContent ?? ""),
      ),
    ).toBe(true);
  });
});
