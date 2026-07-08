import { describe, it, expect } from "vitest";
import { initLynxx, LynxxWallet } from "./index";

describe("LynxxWallet SDK", () => {
  it("should initialize with default testnet", () => {
    const sdk = initLynxx();
    expect(sdk).toBeInstanceOf(LynxxWallet);
    expect(sdk.getNetwork()).toBe("testnet");
  });

  it("should initialize with public network", () => {
    const sdk = initLynxx("public");
    expect(sdk.getNetwork()).toBe("public");
  });

  it("should resolve a connection placeholder", async () => {
    const sdk = initLynxx();
    const address = await sdk.connect();
    expect(address).toBe("G_PLACEHOLDER_ADDRESS");
  });
});
