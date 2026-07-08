export * from "./types";
export * from "./provider";

import { LynxxWalletProvider } from "./provider";

/**
 * Initializes and returns a new LynxX Wallet Provider instance.
 * This is the primary entry point for dApps integrating the SDK.
 */
export function initLynxx(): LynxxWalletProvider {
  return new LynxxWalletProvider();
}
