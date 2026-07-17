import { describe, expect, it, vi } from "vitest";
import { fetchStarships } from "./api";

describe("fetchStarships", () => {
  it("follows SWAPI pagination and forwards the abort signal", async () => {
    const signal = new AbortController().signal;
    const fetchImpl = vi
      .fn()
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: "A" }], next: "page-2" }) })
      .mockResolvedValueOnce({ ok: true, json: async () => ({ results: [{ name: "B" }], next: null }) });

    await expect(fetchStarships({ signal, fetchImpl })).resolves.toEqual([{ name: "A" }, { name: "B" }]);
    expect(fetchImpl).toHaveBeenNthCalledWith(1, "https://swapi.dev/api/starships/", { signal });
    expect(fetchImpl).toHaveBeenNthCalledWith(2, "page-2", { signal });
  });

  it("rejects failed HTTP responses", async () => {
    const fetchImpl = vi.fn().mockResolvedValue({ ok: false, status: 503 });
    await expect(fetchStarships({ fetchImpl })).rejects.toThrow("HTTP error! status: 503");
  });
});
