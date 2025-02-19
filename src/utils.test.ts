import { describe, it, expect } from "vitest";
import { getStatus } from "./utils";

describe("getStatus", () => {
  it('should return "EXPIRED" if the date is in the past', () => {
    const expiresDate = new Date("2023-01-01");
    const now = new Date("2023-01-02");
    expect(getStatus(expiresDate, now)).toBe("EXPIRED");
  });

  it('should return "EXPIRES TODAY" if the date is today', () => {
    const now = new Date();
    const expiresDate = new Date(now);
    expect(getStatus(expiresDate, now)).toBe("EXPIRES TODAY");
  });

  it('should return "VALID" if the date is in the future', () => {
    const now = new Date("2023-01-01");
    const expiresDate = new Date("2023-01-02");
    expect(getStatus(expiresDate, now)).toBe("VALID");
  });

  it('should return "EXPIRED" if the date is yesterday', () => {
    const now = new Date("2023-01-02");
    const expiresDate = new Date("2023-01-01");
    expect(getStatus(expiresDate, now)).toBe("EXPIRED");
  });

  it('should return "VALID" if the date is tomorrow', () => {
    const now = new Date("2023-01-01");
    const expiresDate = new Date("2023-01-02");
    expect(getStatus(expiresDate, now)).toBe("VALID");
  });
});
