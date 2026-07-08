/**
 * LynxX Wallet SDK
 * Entry point for integrating LynxX into your dApps.
 */

export class LynxxWallet {
  private network: string;

  constructor(network: "testnet" | "public" = "testnet") {
    this.network = network;
  }

  public getNetwork(): string {
    return this.network;
  }

  public async connect(): Promise<string> {
    // Placeholder for actual connection logic
    return Promise.resolve("G_PLACEHOLDER_ADDRESS");
  }
}

export function initLynxx(network: "testnet" | "public" = "testnet"): LynxxWallet {
  return new LynxxWallet(network);
}
