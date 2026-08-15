import { describe, it, expect, vi, beforeEach } from "vitest";
import { Keypair, Account } from "@stellar/stellar-sdk";

const authModal = vi.fn();
const signTransaction = vi.fn();
const init = vi.fn();

const loadAccount = vi.fn();
const fetchBaseFee = vi.fn();
const submitTransaction = vi.fn();

vi.mock("@creit.tech/stellar-wallets-kit", () => ({
  StellarWalletsKit: { init, authModal, signTransaction },
  Networks: {
    TESTNET: "Test SDF Network ; September 2015",
    PUBLIC: "Public Global Stellar Network ; September 2015",
  },
}));

vi.mock("@creit.tech/stellar-wallets-kit/modules/utils", () => ({
  defaultModules: () => [],
}));

vi.mock("@stellar/stellar-sdk", async (importOriginal) => {
  const actual = await importOriginal<typeof import("@stellar/stellar-sdk")>();
  return {
    ...actual,
    Horizon: {
      Server: vi.fn().mockImplementation(() => ({
        loadAccount,
        fetchBaseFee,
        submitTransaction,
      })),
    },
  };
});

const { LynxxWalletProvider } = await import("./provider");

describe("LynxxWalletProvider", () => {
  beforeEach(() => {
    authModal.mockReset();
    signTransaction.mockReset();
    loadAccount.mockReset();
    fetchBaseFee.mockReset();
    submitTransaction.mockReset();
  });

  it("connects and stores the address", async () => {
    authModal.mockResolvedValue({ address: "GABC" });
    const provider = new LynxxWalletProvider();

    const address = await provider.connect();

    expect(address).toBe("GABC");
    expect(provider.getAddress()).toBe("GABC");
    expect(provider.isConnected()).toBe(true);
  });

  it("throws a ModalClosed error when the wallet modal is dismissed", async () => {
    authModal.mockRejectedValue(new Error("closed"));
    const provider = new LynxxWalletProvider();

    await expect(provider.connect()).rejects.toMatchObject({
      code: "ModalClosed",
    });
  });

  it("throws a NotConnected error when signing before connecting", async () => {
    const provider = new LynxxWalletProvider();

    await expect(provider.signTransaction("xdr")).rejects.toMatchObject({
      code: "NotConnected",
    });
  });

  it("signs a transaction once connected", async () => {
    authModal.mockResolvedValue({ address: "GABC" });
    signTransaction.mockResolvedValue({ signedTxXdr: "signed-xdr" });
    const provider = new LynxxWalletProvider();
    await provider.connect();

    const signed = await provider.signTransaction("unsigned-xdr");

    expect(signed).toBe("signed-xdr");
    expect(signTransaction).toHaveBeenCalledWith("unsigned-xdr", {
      networkPassphrase: "Test SDF Network ; September 2015",
      address: "GABC",
    });
  });

  it("throws a SigningRejected error when the wallet rejects signing", async () => {
    authModal.mockResolvedValue({ address: "GABC" });
    signTransaction.mockRejectedValue(new Error("rejected"));
    const provider = new LynxxWalletProvider();
    await provider.connect();

    await expect(provider.signTransaction("unsigned-xdr")).rejects.toMatchObject({
      code: "SigningRejected",
    });
  });

  it("clears state on disconnect", async () => {
    authModal.mockResolvedValue({ address: "GABC" });
    const provider = new LynxxWalletProvider();
    await provider.connect();

    provider.disconnect();

    expect(provider.getAddress()).toBeNull();
    expect(provider.isConnected()).toBe(false);
  });

  describe("sendXLM", () => {
    it("throws NotConnected if wallet is not connected", async () => {
      const provider = new LynxxWalletProvider();
      const destination = Keypair.random().publicKey();
      await expect(provider.sendXLM(destination, "10")).rejects.toMatchObject({
        code: "NotConnected",
      });
    });

    it("successfully sends XLM", async () => {
      const sender = Keypair.random().publicKey();
      const destination = Keypair.random().publicKey();
      authModal.mockResolvedValue({ address: sender });
      const provider = new LynxxWalletProvider();
      await provider.connect();

      // Mock stellar-sdk functions
      const mockAccount = new Account(sender, "1");
      loadAccount.mockResolvedValue(mockAccount);
      fetchBaseFee.mockResolvedValue(100);

      // Echo the constructed XDR so fromXDR can parse it successfully
      signTransaction.mockImplementation(async (xdr) => ({ signedTxXdr: xdr }));
      submitTransaction.mockResolvedValue({ hash: "abcd123", successful: true });

      const result = await provider.sendXLM(destination, "10");

      expect(loadAccount).toHaveBeenCalledWith(sender);
      expect(fetchBaseFee).toHaveBeenCalled();
      expect(signTransaction).toHaveBeenCalled();
      expect(submitTransaction).toHaveBeenCalled();

      const submittedTx = submitTransaction.mock.calls[0][0];
      expect(submittedTx.operations).toHaveLength(1);

      const op = submittedTx.operations[0];
      if (op.type !== "payment") {
        throw new Error("Expected payment operation");
      }
      expect(op.destination).toBe(destination);
      expect(op.amount).toBe("10.0000000"); // stellar-sdk adds 7 decimal places internally
      expect(op.asset.isNative()).toBe(true);

      expect(result).toEqual({ hash: "abcd123", success: true });
    });

    it("throws LynxxWalletError if loadAccount fails", async () => {
      const sender = Keypair.random().publicKey();
      const destination = Keypair.random().publicKey();
      authModal.mockResolvedValue({ address: sender });
      const provider = new LynxxWalletProvider();
      await provider.connect();

      loadAccount.mockRejectedValue(new Error("Account not found"));

      await expect(provider.sendXLM(destination, "10")).rejects.toMatchObject({
        code: "WALLET_REQUEST_FAILED",
      });
    });

    it("throws LynxxWalletError if signing fails", async () => {
      const sender = Keypair.random().publicKey();
      const destination = Keypair.random().publicKey();
      authModal.mockResolvedValue({ address: sender });
      const provider = new LynxxWalletProvider();
      await provider.connect();

      const mockAccount = new Account(sender, "1");
      loadAccount.mockResolvedValue(mockAccount);
      fetchBaseFee.mockResolvedValue(100);

      signTransaction.mockRejectedValue(new Error("rejected"));

      await expect(provider.sendXLM(destination, "10")).rejects.toMatchObject({
        code: "SigningRejected", // signTransaction wrapper maps inner errors to SigningRejected, which mapWalletError passes through
      });
    });
  });
});
