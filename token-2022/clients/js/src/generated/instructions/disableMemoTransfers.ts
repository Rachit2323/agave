/**
 * This code was AUTOGENERATED using the codama library.
 * Please DO NOT EDIT THIS FILE, instead use visitors
 * to add features, then rerun codama to update it.
 *
 * @see https://github.com/codama-idl/codama
 */

import {
  AccountRole,
  combineCodec,
  getStructDecoder,
  getStructEncoder,
  getU8Decoder,
  getU8Encoder,
  transformEncoder,
  type AccountMeta,
  type AccountSignerMeta,
  type Address,
  type Codec,
  type Decoder,
  type Encoder,
  type Instruction,
  type InstructionWithAccounts,
  type InstructionWithData,
  type ReadonlyAccount,
  type ReadonlySignerAccount,
  type ReadonlyUint8Array,
  type TransactionSigner,
  type WritableAccount,
} from '@solana/kit';
import { TOKEN_2022_PROGRAM_ADDRESS } from '../programs';
import { getAccountMetaFactory, type ResolvedAccount } from '../shared';

export const DISABLE_MEMO_TRANSFERS_DISCRIMINATOR = 30;

export function getDisableMemoTransfersDiscriminatorBytes() {
  return getU8Encoder().encode(DISABLE_MEMO_TRANSFERS_DISCRIMINATOR);
}

export const DISABLE_MEMO_TRANSFERS_MEMO_TRANSFERS_DISCRIMINATOR = 1;

export function getDisableMemoTransfersMemoTransfersDiscriminatorBytes() {
  return getU8Encoder().encode(
    DISABLE_MEMO_TRANSFERS_MEMO_TRANSFERS_DISCRIMINATOR
  );
}

export type DisableMemoTransfersInstruction<
  TProgram extends string = typeof TOKEN_2022_PROGRAM_ADDRESS,
  TAccountToken extends string | AccountMeta<string> = string,
  TAccountOwner extends string | AccountMeta<string> = string,
  TRemainingAccounts extends readonly AccountMeta<string>[] = [],
> = Instruction<TProgram> &
  InstructionWithData<ReadonlyUint8Array> &
  InstructionWithAccounts<
    [
      TAccountToken extends string
        ? WritableAccount<TAccountToken>
        : TAccountToken,
      TAccountOwner extends string
        ? ReadonlyAccount<TAccountOwner>
        : TAccountOwner,
      ...TRemainingAccounts,
    ]
  >;

export type DisableMemoTransfersInstructionData = {
  discriminator: number;
  memoTransfersDiscriminator: number;
};

export type DisableMemoTransfersInstructionDataArgs = {};

export function getDisableMemoTransfersInstructionDataEncoder(): Encoder<DisableMemoTransfersInstructionDataArgs> {
  return transformEncoder(
    getStructEncoder([
      ['discriminator', getU8Encoder()],
      ['memoTransfersDiscriminator', getU8Encoder()],
    ]),
    (value) => ({
      ...value,
      discriminator: DISABLE_MEMO_TRANSFERS_DISCRIMINATOR,
      memoTransfersDiscriminator:
        DISABLE_MEMO_TRANSFERS_MEMO_TRANSFERS_DISCRIMINATOR,
    })
  );
}

export function getDisableMemoTransfersInstructionDataDecoder(): Decoder<DisableMemoTransfersInstructionData> {
  return getStructDecoder([
    ['discriminator', getU8Decoder()],
    ['memoTransfersDiscriminator', getU8Decoder()],
  ]);
}

export function getDisableMemoTransfersInstructionDataCodec(): Codec<
  DisableMemoTransfersInstructionDataArgs,
  DisableMemoTransfersInstructionData
> {
  return combineCodec(
    getDisableMemoTransfersInstructionDataEncoder(),
    getDisableMemoTransfersInstructionDataDecoder()
  );
}

export type DisableMemoTransfersInput<
  TAccountToken extends string = string,
  TAccountOwner extends string = string,
> = {
  /** The token account to update. */
  token: Address<TAccountToken>;
  /** The account's owner or its multisignature account. */
  owner: Address<TAccountOwner> | TransactionSigner<TAccountOwner>;
  multiSigners?: Array<TransactionSigner>;
};

export function getDisableMemoTransfersInstruction<
  TAccountToken extends string,
  TAccountOwner extends string,
  TProgramAddress extends Address = typeof TOKEN_2022_PROGRAM_ADDRESS,
>(
  input: DisableMemoTransfersInput<TAccountToken, TAccountOwner>,
  config?: { programAddress?: TProgramAddress }
): DisableMemoTransfersInstruction<
  TProgramAddress,
  TAccountToken,
  (typeof input)['owner'] extends TransactionSigner<TAccountOwner>
    ? ReadonlySignerAccount<TAccountOwner> & AccountSignerMeta<TAccountOwner>
    : TAccountOwner
> {
  // Program address.
  const programAddress = config?.programAddress ?? TOKEN_2022_PROGRAM_ADDRESS;

  // Original accounts.
  const originalAccounts = {
    token: { value: input.token ?? null, isWritable: true },
    owner: { value: input.owner ?? null, isWritable: false },
  };
  const accounts = originalAccounts as Record<
    keyof typeof originalAccounts,
    ResolvedAccount
  >;

  // Original args.
  const args = { ...input };

  // Remaining accounts.
  const remainingAccounts: AccountMeta[] = (args.multiSigners ?? []).map(
    (signer) => ({
      address: signer.address,
      role: AccountRole.READONLY_SIGNER,
      signer,
    })
  );

  const getAccountMeta = getAccountMetaFactory(programAddress, 'programId');
  const instruction = {
    accounts: [
      getAccountMeta(accounts.token),
      getAccountMeta(accounts.owner),
      ...remainingAccounts,
    ],
    programAddress,
    data: getDisableMemoTransfersInstructionDataEncoder().encode({}),
  } as DisableMemoTransfersInstruction<
    TProgramAddress,
    TAccountToken,
    (typeof input)['owner'] extends TransactionSigner<TAccountOwner>
      ? ReadonlySignerAccount<TAccountOwner> & AccountSignerMeta<TAccountOwner>
      : TAccountOwner
  >;

  return instruction;
}

export type ParsedDisableMemoTransfersInstruction<
  TProgram extends string = typeof TOKEN_2022_PROGRAM_ADDRESS,
  TAccountMetas extends readonly AccountMeta[] = readonly AccountMeta[],
> = {
  programAddress: Address<TProgram>;
  accounts: {
    /** The token account to update. */
    token: TAccountMetas[0];
    /** The account's owner or its multisignature account. */
    owner: TAccountMetas[1];
  };
  data: DisableMemoTransfersInstructionData;
};

export function parseDisableMemoTransfersInstruction<
  TProgram extends string,
  TAccountMetas extends readonly AccountMeta[],
>(
  instruction: Instruction<TProgram> &
    InstructionWithAccounts<TAccountMetas> &
    InstructionWithData<ReadonlyUint8Array>
): ParsedDisableMemoTransfersInstruction<TProgram, TAccountMetas> {
  if (instruction.accounts.length < 2) {
    // TODO: Coded error.
    throw new Error('Not enough accounts');
  }
  let accountIndex = 0;
  const getNextAccount = () => {
    const accountMeta = instruction.accounts![accountIndex]!;
    accountIndex += 1;
    return accountMeta;
  };
  return {
    programAddress: instruction.programAddress,
    accounts: {
      token: getNextAccount(),
      owner: getNextAccount(),
    },
    data: getDisableMemoTransfersInstructionDataDecoder().decode(
      instruction.data
    ),
  };
}
