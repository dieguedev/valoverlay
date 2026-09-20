import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { PublicLayout } from "./PublicLayout";

describe("PublicLayout", () => {
  it("muestra el Header y el Footer junto al contenido de la ruta activa", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route element={<PublicLayout />}>
            <Route path="/" element={<p>contenido de prueba</p>} />
          </Route>
        </Routes>
      </MemoryRouter>,
    );

    expect(
      screen.getByRole("link", { name: /iniciar sesión/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /privacidad/i }),
    ).toBeInTheDocument();
    expect(screen.getByText("contenido de prueba")).toBeInTheDocument();
  });
});
