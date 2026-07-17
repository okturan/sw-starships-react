import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import App from "./App";
import { fetchStarships } from "./utils/api";

vi.mock("./utils/api", () => ({ fetchStarships: vi.fn() }));

const starships = [
  {
    name: "Millennium Falcon",
    model: "YT-1300 light freighter",
    starship_class: "Light freighter",
    cost_in_credits: "100000",
    length: "34.37",
    max_atmosphering_speed: "1050",
    crew: "4",
    passengers: "6",
    cargo_capacity: "100000",
    consumables: "2 months",
    hyperdrive_rating: "0.5",
    MGLT: "75",
    url: "https://swapi.dev/api/starships/10/",
  },
  {
    name: "X-wing",
    model: "T-65 X-wing",
    starship_class: "Starfighter",
    cost_in_credits: "149999",
    length: "12.5",
    max_atmosphering_speed: "1050",
    crew: "1",
    passengers: "0",
    cargo_capacity: "110",
    consumables: "1 week",
    hyperdrive_rating: "1.0",
    MGLT: "100",
    url: "https://swapi.dev/api/starships/12/",
  },
];

describe("Star Wars Starships", () => {
  beforeEach(() => {
    fetchStarships.mockReset();
  });

  afterEach(() => cleanup());

  it("moves from loading to searchable results and reports no matches", async () => {
    fetchStarships.mockResolvedValue(starships);
    const user = userEvent.setup();
    render(<App />);

    expect(screen.getByRole("status").textContent).toContain("Contacting the archive");
    expect(await screen.findByRole("button", { name: "View details for Millennium Falcon" })).toBeTruthy();

    const search = screen.getByRole("searchbox", { name: "Search starships by name" });
    await user.type(search, "x-wing");
    expect(screen.queryByRole("button", { name: "View details for Millennium Falcon" })).toBeNull();
    expect(screen.getByRole("button", { name: "View details for X-wing" })).toBeTruthy();

    await user.clear(search);
    await user.type(search, "Death Star");
    expect(screen.getByRole("heading", { name: "No vessels match “Death Star”" })).toBeTruthy();
  });

  it("opens the detail dialog from the keyboard and closes it with Escape", async () => {
    fetchStarships.mockResolvedValue(starships);
    const user = userEvent.setup();
    render(<App />);

    const falcon = await screen.findByRole("button", { name: "View details for Millennium Falcon" });
    falcon.focus();
    await user.keyboard("{Enter}");

    const dialog = screen.getByRole("dialog", { name: "Millennium Falcon" });
    expect(dialog).toBeTruthy();
    expect(screen.getByRole("button", { name: "Close starship details" })).toBe(document.activeElement);

    await user.keyboard("{Tab}");
    expect(screen.getByRole("button", { name: "Close starship details" })).toBe(document.activeElement);

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("dialog")).toBeNull();
    await waitFor(() => expect(falcon).toBe(document.activeElement));
  });

  it("offers a retry after a failed request", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});
    fetchStarships.mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce(starships);
    const user = userEvent.setup();
    render(<App />);

    expect((await screen.findByRole("alert")).textContent).toContain("could not be loaded");
    await user.click(screen.getByRole("button", { name: "Try again" }));
    expect(await screen.findByRole("button", { name: "View details for X-wing" })).toBeTruthy();
    expect(fetchStarships).toHaveBeenCalledTimes(2);
    consoleError.mockRestore();
  });
});
