import { describe, it, expect } from "vitest";
import { useDebounce } from "../useDebounce";

describe("useDebounce", () => {
  it("is a callable function", () => {
    expect(typeof useDebounce).toBe("function");
  });
});
