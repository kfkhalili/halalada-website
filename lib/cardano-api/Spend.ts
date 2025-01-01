//Spend.ts
import type {
  MultiAsset,
  TransactionOutputs,
  TransactionUnspentOutput,
} from "@emurgo/cardano-serialization-lib-browser";
import { CardanoAPIObject } from "./CardanoAPI";

type ProtocolParameters = {
  coinsPerUtxoWord: string;
  minFeeA: string;
  minFeeB: string;
  maxTxSize: string;
  coinsPerUtxoByte: string;
};

type Asset = {
  unit: string;
  quantity: string;
};

type Send = {
  address: string;
  amount?: number;
  assets?: Asset[];
  metadata?: object | null;
  metadataLabel?: string;
};

type Delegate = {
  stakepoolId: string;
  metadata?: object | null;
  metadataLabel?: string;
};

type UTxOList = Array<TransactionUnspentOutput>;

let protocolParameters = undefined as ProtocolParameters | undefined;

const setProtocolParameters = (
  coinsPerUtxoWord: string,
  minFeeA: string,
  minFeeB: string,
  maxTxSize: string,
  coinsPerUtxoByte: string
) => {
  protocolParameters = {
    coinsPerUtxoWord: coinsPerUtxoWord,
    minFeeA: minFeeA,
    minFeeB: minFeeB,
    maxTxSize: maxTxSize,
    coinsPerUtxoByte: coinsPerUtxoByte,
  };
};

type Metadata = object | null;

type ProtocolParameter = {
  linearFee: {
    minFeeA: string;
    minFeeB: string;
  };
  minUtxo: any;
  poolDeposit: string;
  keyDeposit: string;
  maxTxSize: number;
  slot: string;
  coinsPerUtxoByte: string;
};

type SendMultiple = {
  recipients: {
    address: string;
    amount?: number;
    assets?: Asset[];
  }[];
  metadata?: Metadata;
  metadataLabel?: string;
};

export const Spend = () => {
  return {
    name: "spend",
    exec: {
      send: send,
      sendMultiple: sendMultiple,
      delegate: delegate,
      getAssets: getAssets,
    },
  };
};

const errorIfUndefined = <T>(item: T | undefined): T => {
  if (!item) {
    throw new Error("Value is undefined");
  }
  return item;
};

const send = async ({
  address,
  amount = 0,
  assets = [],
  metadata = null,
  metadataLabel = "721",
}: Send): Promise<string> => {
  const paymentAddress = await CardanoAPIObject.baseCommands.getChangeAddress(
    CardanoAPIObject.addressReturnType.bech32
  );
  const protocolParameter = await getProtocolParameter();
  const utxos = await CardanoAPIObject.baseCommands.getUtxos();
  const lovelace = Math.floor((amount || 0) * 1000000).toString();
  const receiveAddress = address;
  const multiAsset = _makeMultiAsset(assets);
  const outputValue = CardanoAPIObject.serializationLib.Value.new(
    CardanoAPIObject.serializationLib.BigNum.from_str(lovelace)
  );
  if ((assets || []).length > 0) {
    outputValue.set_multiasset(multiAsset);
  }

  // Construct TransactionOutput for min_ada_for_output
  const transactionOutput =
    CardanoAPIObject.serializationLib.TransactionOutput.new(
      CardanoAPIObject.serializationLib.Address.from_bech32(receiveAddress),
      outputValue
    );

  // Calculate min ADA using min_ada_for_output
  const minAda = CardanoAPIObject.serializationLib.min_ada_for_output(
    transactionOutput,
    protocolParameter.coinsPerUtxoByte
  );

  if (
    CardanoAPIObject.serializationLib.BigNum.from_str(lovelace).compare(
      minAda
    ) < 0
  ) {
    outputValue.set_coin(minAda);
  }

  const outputs = CardanoAPIObject.serializationLib.TransactionOutputs.new();
  outputs.add(transactionOutput);

  const rawTransaction = _txBuilder({
    PaymentAddress: String(paymentAddress),
    Utxos: utxos,
    Outputs: outputs,
    ProtocolParameter: protocolParameter,
    Metadata: metadata,
    MetadataLabel: metadataLabel,
    Delegation: null,
  });
  return await _signSubmitTx(rawTransaction);
};

const sendMultiple = async ({
  recipients = [],
  metadata = null,
  metadataLabel = "721",
}: SendMultiple): Promise<string> => {
  const paymentAddress = await CardanoAPIObject.baseCommands.getChangeAddress(
    CardanoAPIObject.addressReturnType.bech32
  );

  const protocolParameter = await getProtocolParameter();
  const utxos = await CardanoAPIObject.baseCommands.getUtxos();
  const outputs = CardanoAPIObject.serializationLib.TransactionOutputs.new();

  for (const recipient of recipients) {
    const lovelace = Math.floor((recipient.amount || 0) * 1000000).toString();
    const receiveAddress = recipient.address;
    const multiAsset = _makeMultiAsset(recipient.assets || []);
    const outputValue = CardanoAPIObject.serializationLib.Value.new(
      CardanoAPIObject.serializationLib.BigNum.from_str(lovelace)
    );

    if ((recipient.assets || []).length > 0) {
      outputValue.set_multiasset(multiAsset);
    }

    // Create TransactionOutput
    const transactionOutput =
      CardanoAPIObject.serializationLib.TransactionOutput.new(
        CardanoAPIObject.serializationLib.Address.from_bech32(receiveAddress),
        outputValue
      );

    // Calculate min ADA using min_ada_for_output
    const minAda = CardanoAPIObject.serializationLib.min_ada_for_output(
      transactionOutput,
      protocolParameter.coinsPerUtxoByte // Use coinsPerUtxoByte
    );

    if (
      CardanoAPIObject.serializationLib.BigNum.from_str(lovelace).compare(
        minAda
      ) < 0
    ) {
      outputValue.set_coin(minAda);
    }

    // Add updated TransactionOutput to outputs
    outputs.add(transactionOutput);
  }

  const RawTransaction = _txBuilder({
    PaymentAddress: String(paymentAddress),
    Utxos: utxos,
    Outputs: outputs,
    ProtocolParameter: protocolParameter,
    Metadata: metadata,
    MetadataLabel: metadataLabel,
    Delegation: null,
  });

  return await _signSubmitTx(RawTransaction);
};

const delegate = async ({
  stakepoolId,
  metadata = null,
  metadataLabel = "721",
}: Delegate): Promise<string> => {
  const protocolParameter = await getProtocolParameter();
  const stakeAddress = await CardanoAPIObject.baseCommands.getRewardAddress(
    CardanoAPIObject.addressReturnType.bech32
  );

  const stakeKeyHash = errorIfUndefined(
    errorIfUndefined(
      CardanoAPIObject.serializationLib.RewardAddress.from_address(
        errorIfUndefined(
          CardanoAPIObject.serializationLib.Address.from_bech32(
            String(stakeAddress)
          )
        )
      )
    )
      .payment_cred()
      .to_keyhash()
  ).to_bytes();

  const getDelegation = async (
    rewardAddr: string
  ): Promise<{ active: boolean; rewards: string; stakepoolId: string }> => {
    //@ts-ignore
    const stake = await CardanoAPIObject.plugins.data.request(
      `/accounts/${rewardAddr}`
    );
    if (!stake || stake.error)
      throw new Error("Blockfrost data retreived is incorrect");
    return {
      active: stake.active,
      rewards: stake.withdrawable_amount,
      stakepoolId: stakepoolId,
    };
  };

  const delegation = await getDelegation(String(stakeAddress));
  //@ts-ignore
  const pool = await CardanoAPIObject.plugins.data.request(
    `/pools/${stakepoolId}`
  );
  const poolHex = pool.hex;

  const utxos = await CardanoAPIObject.baseCommands.getUtxos();

  const paymentAddress = await CardanoAPIObject.baseCommands.getChangeAddress(
    CardanoAPIObject.addressReturnType.bech32
  );

  const outputs = CardanoAPIObject.serializationLib.TransactionOutputs.new();

  const addr = CardanoAPIObject.serializationLib.Address.from_bech32(
    String(paymentAddress)
  );

  const value = CardanoAPIObject.serializationLib.Value.new(
    CardanoAPIObject.serializationLib.BigNum.from_str(
      protocolParameter.keyDeposit
    )
  );
  outputs.add(
    CardanoAPIObject.serializationLib.TransactionOutput.new(addr, value)
  );

  const RawTransaction = _txBuilder({
    PaymentAddress: String(paymentAddress),
    Utxos: utxos,
    ProtocolParameter: protocolParameter,
    Outputs: outputs,
    Delegation: {
      poolHex: poolHex,
      stakeKeyHash: stakeKeyHash,
      delegation: delegation,
    },
    Metadata: metadata || undefined,
    MetadataLabel: metadataLabel,
  });

  return await _signSubmitTx(RawTransaction);
};

const _txBuilder = ({
  PaymentAddress,
  Utxos,
  Outputs,
  ProtocolParameter,
  Metadata = null,
  MetadataLabel = "721",
  Delegation = null,
}: {
  PaymentAddress: string;
  Utxos: UTxOList;
  Outputs: TransactionOutputs;
  ProtocolParameter: ProtocolParameter;
  Metadata?: Metadata;
  MetadataLabel?: string;
  Delegation?: {
    stakeKeyHash: Uint8Array;
    poolHex: string;
    delegation: {
      active: boolean;
      rewards: string;
      stakepoolId: string;
    };
  } | null;
}): Uint8Array => {
  const MULTIASSET_SIZE = 5000;

  // Set protocol parameters
  const { serializationLib } = CardanoAPIObject;
  setProtocolParameters(
    ProtocolParameter.minUtxo.toString(),
    ProtocolParameter.linearFee.minFeeA.toString(),
    ProtocolParameter.linearFee.minFeeB.toString(),
    ProtocolParameter.maxTxSize.toString(),
    ProtocolParameter.coinsPerUtxoByte.toString()
  );

  // Initialize TransactionBuilder
  const txBuilder = serializationLib.TransactionBuilder.new(
    serializationLib.TransactionBuilderConfigBuilder.new()
      .fee_algo(
        serializationLib.LinearFee.new(
          serializationLib.BigNum.from_str(ProtocolParameter.linearFee.minFeeA),
          serializationLib.BigNum.from_str(ProtocolParameter.linearFee.minFeeB)
        )
      )
      .coins_per_utxo_byte(
        serializationLib.BigNum.from_str(ProtocolParameter.coinsPerUtxoByte)
      )
      .pool_deposit(
        serializationLib.BigNum.from_str(ProtocolParameter.poolDeposit)
      )
      .key_deposit(
        serializationLib.BigNum.from_str(ProtocolParameter.keyDeposit)
      )
      .max_tx_size(ProtocolParameter.maxTxSize)
      .max_value_size(MULTIASSET_SIZE)
      .build()
  );

  const transactionUnspentOutputs =
    serializationLib.TransactionUnspentOutputs.new();
  Utxos.forEach((utxo) => transactionUnspentOutputs.add(utxo));

  txBuilder.add_inputs_from(
    transactionUnspentOutputs,
    serializationLib.CoinSelectionStrategyCIP2.RandomImprove
  );

  // Add outputs to the transaction
  for (let i = 0; i < Outputs.len(); i++) {
    txBuilder.add_output(Outputs.get(i));
  }

  // Handle delegation certificates
  if (Delegation) {
    const certificates = serializationLib.Certificates.new();

    if (!Delegation.delegation.active) {
      certificates.add(
        serializationLib.Certificate.new_stake_registration(
          serializationLib.StakeRegistration.new(
            serializationLib.Credential.from_keyhash(
              serializationLib.Ed25519KeyHash.from_bytes(
                Delegation.stakeKeyHash
              )
            )
          )
        )
      );
    }

    certificates.add(
      serializationLib.Certificate.new_stake_delegation(
        serializationLib.StakeDelegation.new(
          serializationLib.Credential.from_keyhash(
            serializationLib.Ed25519KeyHash.from_bytes(Delegation.stakeKeyHash)
          ),
          serializationLib.Ed25519KeyHash.from_bytes(
            Buffer.from(Delegation.poolHex, "hex")
          )
        )
      )
    );

    txBuilder.set_certs(certificates);
  }

  // Attach metadata if provided
  if (Metadata) {
    const METADATA = serializationLib.GeneralTransactionMetadata.new();
    METADATA.insert(
      serializationLib.BigNum.from_str(MetadataLabel),
      serializationLib.encode_json_str_to_metadatum(JSON.stringify(Metadata), 0)
    );

    const AUXILIARY_DATA = serializationLib.AuxiliaryData.new();
    AUXILIARY_DATA.set_metadata(METADATA);
    txBuilder.set_auxiliary_data(AUXILIARY_DATA);
  }

  // Add change to the transaction if needed
  txBuilder.add_change_if_needed(
    serializationLib.Address.from_bech32(PaymentAddress)
  );

  const builtTx = txBuilder.build();
  console.log("Min fee:", txBuilder.min_fee().to_str());
  console.log("Actual body fee:", builtTx.fee().to_str());

  const transaction = serializationLib.Transaction.new(
    builtTx,
    serializationLib.TransactionWitnessSet.new()
  );

  // Validate transaction size
  const size = transaction.to_bytes().length * 2;
  if (size > ProtocolParameter.maxTxSize) {
    throw new Error("The transaction is too large");
  }

  return transaction.to_bytes();
};

const _makeMultiAsset = (assets: Asset[]): MultiAsset => {
  const AssetsMap: any = {};
  for (const asset of assets) {
    const [policy, assetName] = asset.unit.split(".");
    const quantity = asset.quantity;
    if (!Array.isArray(AssetsMap[policy])) {
      AssetsMap[policy] = [];
    }
    AssetsMap[policy].push({
      unit: CardanoAPIObject.buffer.from(assetName, "ascii").toString("hex"),
      quantity: quantity,
    });
  }
  const multiAsset = CardanoAPIObject.serializationLib.MultiAsset.new();
  for (const policy in AssetsMap) {
    const ScriptHash = CardanoAPIObject.serializationLib.ScriptHash.from_bytes(
      CardanoAPIObject.buffer.from(policy, "hex")
    );
    const Assets = CardanoAPIObject.serializationLib.Assets.new();

    const _assets = AssetsMap[policy];

    for (const asset of _assets) {
      const AssetName = CardanoAPIObject.serializationLib.AssetName.new(
        CardanoAPIObject.buffer.from(asset.unit, "hex")
      );
      const BigNum = CardanoAPIObject.serializationLib.BigNum.from_str(
        String(asset.quantity)
      );
      Assets.insert(AssetName, BigNum);
    }
    multiAsset.insert(ScriptHash, Assets);
  }
  return multiAsset;
};

const _signSubmitTx = async (transactionRaw: Uint8Array): Promise<string> => {
  const transaction =
    CardanoAPIObject.serializationLib.Transaction.from_bytes(transactionRaw);
  const witneses = await CardanoAPIObject.baseCommands.signTx(transaction);
  const TransactionWitness =
    CardanoAPIObject.serializationLib.TransactionWitnessSet.from_bytes(
      CardanoAPIObject.buffer.from(witneses, "hex")
    );
  const signedTx = CardanoAPIObject.serializationLib.Transaction.new(
    transaction.body(),
    TransactionWitness,
    transaction.auxiliary_data()
  );
  if (typeof signedTx === "string") {
    throw new Error("signedTx can not be a hex string");
  }

  return await CardanoAPIObject.baseCommands.submitTx(signedTx);
};
const getProtocolParameter = async () => {
  //@ts-ignore
  const latestBlock = await CardanoAPIObject.plugins.data.request(
    "/blocks/latest"
  );
  if (!latestBlock) throw "invalid protocol parameters";

  //@ts-ignore
  const p = await CardanoAPIObject.plugins.data.request(
    `/epochs/${latestBlock.epoch}/parameters`
  );
  if (!p) throw "invalid protocol parameters";

  const parameters = {
    linearFee: {
      minFeeA: p.min_fee_a.toString(),
      minFeeB: p.min_fee_b.toString(),
    },
    minUtxo: "1000000",
    poolDeposit: p.pool_deposit,
    keyDeposit: p.key_deposit,
    maxTxSize: p.max_tx_size,
    slot: latestBlock.slot,
    coinsPerUtxoByte: p.coins_per_utxo_byte?.toString() || "4310", // Use API value or a sensible default
  };

  return parameters;
};

const getAssets = async (address: string) => {
  //@ts-ignore
  const assets = await CardanoAPIObject.plugins.data.request(
    `/accounts/${address}/addresses/assets`
  );

  return assets;
};
