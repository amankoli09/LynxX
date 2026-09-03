import { StellarWalletsKit, Networks } from "@creit.tech/stellar-wallets-kit";
import { defaultModules } from "@creit.tech/stellar-wallets-kit/modules/utils";
import { Horizon, TransactionBuilder, Operation, Asset } from "@stellar/stellar-sdk";
import type { LynxxConfig, LynxxNetwork, SendXLMResult } from "./types";
import { LynxxWalletError, mapWalletError } from "./errors";

const NETWORK_PASSPHRASES: Record<LynxxNetwork, Networks> = {
  TESTNET: Networks.TESTNET,
  PUBLIC: Networks.PUBLIC,
};

// LynxxWalletError is defined in ./errors and re-exported from the package root.

/**
 * Manages the connection to a user's Stellar wallet (Freighter, xBull,
 * Albedo, and other wallets supported by `@creit.tech/stellar-wallets-kit`)
 * and provides helpers for signing transactions.
 *
 * Use {@link initLynxx} to create an instance rather than constructing this
 * class directly.
 */
export class LynxxWalletProvider {
  private readonly networkPassphrase: Networks;
  private address: string | null = null;

  constructor(config: LynxxConfig = {}) {
    const network = config.network ?? "TESTNET";
    this.networkPassphrase = NETWORK_PASSPHRASES[network];

    StellarWalletsKit.init({
      network: this.networkPassphrase,
      modules: defaultModules(),
    });
  }

  /**
   * Opens the wallet-selection modal and connects to the user's chosen
   * wallet.
   *
   * @returns The connected account's Stellar public key (`G...`).
   * @throws {@link LynxxWalletError} `"ModalClosed"` if the user closes the
   * modal without selecting a wallet, or approves without an address being
   * returned.
   *
   * @example
   * ```ts
   * const wallet = initLynxx();
   * const address = await wallet.connect();
   * console.log(`Connected: ${address}`);
   * ```
   */
  async connect(): Promise<string> {
    try {
      const { address } = await StellarWalletsKit.authModal();
      if (!address) {
        throw new Error("No address returned from wallet.");
      }
      this.address = address;
      return address;
    } catch (error) {
      throw new LynxxWalletError(
        error instanceof Error
          ? error.message
          : "Wallet connection was cancelled.",
        "ModalClosed",
      );
    }
  }

  /**
   * Signs a transaction with the connected wallet.
   *
   * @param xdr - The unsigned transaction, base64-encoded XDR (e.g. the
   * result of `transaction.toXDR()` from `@stellar/stellar-sdk`).
   * @returns The signed transaction as a base64-encoded XDR string.
   * @throws {@link LynxxWalletError} `"NotConnected"` if {@link connect} has
   * not been called yet, or `"SigningRejected"` if the user rejects the
   * signing request in their wallet.
   *
   * @example
   * ```ts
   * import { TransactionBuilder, Networks } from "@stellar/stellar-sdk";
   *
   * const signedXdr = await wallet.signTransaction(transaction.toXDR());
   * const signedTx = TransactionBuilder.fromXDR(signedXdr, Networks.TESTNET);
   * ```
   */
  async signTransaction(xdr: string): Promise<string> {
    if (!this.address) {
      throw new LynxxWalletError(
        "No wallet connected. Call connect() before signTransaction().",
        "NotConnected",
      );
    }

    try {
      const { signedTxXdr } = await StellarWalletsKit.signTransaction(xdr, {
        networkPassphrase: this.networkPassphrase,
        address: this.address,
      });

      if (!signedTxXdr) {
        throw new Error("Wallet did not return a signed transaction.");
      }

      return signedTxXdr;
    } catch (error) {
      throw new LynxxWalletError(
        error instanceof Error
          ? error.message
          : "Transaction signing was rejected.",
        "SigningRejected",
      );
    }
  }

  /**
   * Fetches the connected wallet's native XLM balance from Horizon.
   *
   * @returns The native XLM balance as a string (e.g. `"42.5000000"`).
   * @throws {@link LynxxWalletError} `"NotConnected"` if {@link connect} has
   * not been called yet, or with code `"WALLET_REQUEST_FAILED"` if the Horizon
   * request fails.
   *
   * @example
   * ```ts
   * const balance = await wallet.getBalance();
   * console.log(`Balance: ${balance} XLM`);
   * ```
   */
  async getBalance(): Promise<string> {
    if (!this.address) {
      throw new LynxxWalletError(
        "No wallet connected. Call connect() before getBalance().",
        "NotConnected",
      );
    }

    try {
      const server = this.getHorizonServer();
      const account = await server.loadAccount(this.address);
      const nativeBalance = account.balances.find(
        (b) => b.asset_type === "native",
      );

      if (!nativeBalance) {
        throw new LynxxWalletError(
          "Native XLM balance not found for account.",
          "BalanceNotFound",
        );
      }

      return nativeBalance.balance;
    } catch (error) {
      throw mapWalletError(error, "Failed to fetch balance.");
    }
  }

  /**
   * Sends XLM to a given address.
   *
   * @param to - The destination Stellar public key.
   * @param amount - The amount of XLM to send (as a string).
   * @returns An object containing the transaction hash and a success boolean.
   * @throws {@link LynxxWalletError} if the transaction fails to build, sign, or submit.
   */
  async sendXLM(to: string, amount: string): Promise<SendXLMResult> {
    if (!this.address) {
      throw new LynxxWalletError(
        "No wallet connected. Call connect() before sendXLM().",
        "NotConnected",
      );
    }

    try {
      const server = this.getHorizonServer();

      const account = await server.loadAccount(this.address);
      const fee = await server.fetchBaseFee();

      const transaction = new TransactionBuilder(account, {
        fee: fee.toString(),
        networkPassphrase: this.networkPassphrase,
      })
        .addOperation(
          Operation.payment({
            destination: to,
            asset: Asset.native(),
            amount: amount,
          })
        )
        .setTimeout(300)
        .build();

      const signedXdr = await this.signTransaction(transaction.toXDR());
      const signedTx = TransactionBuilder.fromXDR(
        signedXdr,
        this.networkPassphrase,
      );
      const result = await server.submitTransaction(signedTx);

      return {
        hash: result.hash,
        success: result.successful,
      };
    } catch (error) {
      throw mapWalletError(error, "Failed to send XLM.");
    }
  }

  /**
   * The currently connected wallet address.
   * @returns The connected `G...` public key, or `null` if not connected.
   */
  getAddress(): string | null {
    return this.address;
  }

  /** Whether a wallet is currently connected. */
  isConnected(): boolean {
    return this.address !== null;
  }

  /**
   * Clears the local connection state.
   *
   * This only forgets the address on the client; it does not revoke the
   * dApp's permission from within the wallet itself.
   */
  disconnect(): void {
    this.address = null;
  }

  private getHorizonServer(): Horizon.Server {
    const serverUrl =
      this.networkPassphrase === Networks.PUBLIC
        ? "https://horizon.stellar.org"
        : "https://horizon-testnet.stellar.org";
    return new Horizon.Server(serverUrl);
  }
}
