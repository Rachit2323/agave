import { PublicKey } from '@solana/web3.js';

/** Address of the SPL Token program */
export const TOKEN_PROGRAM_ID = new PublicKey('Gorbj8Dp27NkXMQUkeHBSmpf6iQ3yT4b2uVe8kM4s6br');

/** Address of the SPL Token 2022 program */
export const TOKEN_2022_PROGRAM_ID = new PublicKey('G22oYgZ6LnVcy7v8eSNi2xpNk1NcZiPD8CVKSTut7oZ6');

/** Address of the SPL Associated Token Account program */
export const ASSOCIATED_TOKEN_PROGRAM_ID = new PublicKey('GoATGVNeSXerFerPqTJ8hcED1msPWHHLxao2vwBYqowm');

/** Address of the special mint for wrapped native SOL in spl-token */
export const NATIVE_MINT = new PublicKey('So11111111111111111111111111111111111111112');

/** Address of the special mint for wrapped native SOL in spl-token-2022 */
export const NATIVE_MINT_2022 = new PublicKey('9pan9bMn5HatX4EJdBwg9VgCa7Uz5HL8N1m5D3NdXejP');

/** Check that the token program provided is not `Tokenkeg...`, useful when using extensions */
export function programSupportsExtensions(programId: PublicKey): boolean {
    if (programId.equals(TOKEN_PROGRAM_ID)) {
        return false;
    } else {
        return true;
    }
}
