import type { PrivacyMode } from "@/stores/settingsStore";

const LEO_BASE_CONTEXT = `You are building an application using Aleo blockchain and its Leo programming language.

Leo is a statically-typed, functional programming language for writing private applications on the Aleo blockchain. It uses zero-knowledge proofs (zkSNARKs) to enable private computation.

Key Leo language concepts:
- \`program\` declarations define a smart contract (e.g., \`program my_app.aleo { ... }\`)
- \`transition\` functions are entry points that create proofs and can be called externally
- \`function\` blocks are private helper functions that execute off-chain
- \`record\` types represent private, owned state (like UTXOs - destroyed on use, new ones created)
- \`mapping\` declarations store public on-chain state (key-value pairs)
- \`finalize\` blocks execute on-chain after a transition's proof is verified
- Types: u8, u16, u32, u64, u128, i8-i128, field, group, bool, address, scalar
- Visibility modifiers: \`private\` (hidden in proof), \`public\` (visible on-chain)
- \`assert\` and \`assert_eq\` for constraints
- Standard operations: let, const, if/else, for loops, return

Example Leo program structure:
\`\`\`leo
program token.aleo {
    record Token {
        owner: address,
        amount: u64,
    }

    mapping balances: address => u64;

    transition mint(receiver: address, amount: u64) -> Token {
        return Token {
            owner: receiver,
            amount: amount,
        };
    }

    transition transfer(token: Token, to: address, amount: u64) -> (Token, Token) {
        let remaining: u64 = token.amount - amount;
        let sender_token: Token = Token { owner: token.owner, amount: remaining };
        let receiver_token: Token = Token { owner: to, amount: amount };
        return (sender_token, receiver_token);
    }
}
\`\`\``;

const PRIVATE_CONTEXT = `
PRIVACY MODE: Private by Default
- Use \`record\` types for all user state to keep data private
- Prefer \`transition\` functions with private inputs/outputs
- Use zero-knowledge proofs so that transaction details (sender, receiver, amounts) are hidden
- Only use \`mapping\` and \`finalize\` when absolutely necessary for public consensus
- Records are consumed and recreated on each use, providing forward secrecy
- All computation happens off-chain; only the proof goes on-chain`;

const PUBLIC_CONTEXT = `
PRIVACY MODE: Public
- Use \`mapping\` declarations for on-chain public state storage
- Use \`finalize\` blocks to update public state after proof verification
- Public mappings allow anyone to read the state on-chain
- Transitions can have public inputs/outputs visible on the blockchain
- Suitable for governance, public registries, and transparent applications`;

export function buildAleoContext(privacyMode: PrivacyMode = "private"): string {
  const privacy = privacyMode === "private" ? PRIVATE_CONTEXT : PUBLIC_CONTEXT;
  return LEO_BASE_CONTEXT + privacy;
}

export const LEO_LANGUAGE_ID = "leo";

export const LEO_MONARCH_TOKENS = {
  keywords: [
    "program", "transition", "function", "finalize", "record", "mapping",
    "struct", "let", "const", "return", "if", "else", "for", "in",
    "assert", "assert_eq", "assert_neq", "import", "as", "self", "then",
  ],
  typeKeywords: [
    "u8", "u16", "u32", "u64", "u128", "i8", "i16", "i32", "i64", "i128",
    "field", "group", "bool", "address", "scalar", "string",
  ],
  visibility: ["private", "public", "constant"],
  operators: [
    "+", "-", "*", "/", "**", "==", "!=", "<", ">", "<=", ">=",
    "&&", "||", "!", "=", "+=", "-=", "*=", "/=", "=>",
  ],
  tokenizer: {
    root: [
      [/[a-zA-Z_]\w*/, {
        cases: {
          "@keywords": "keyword",
          "@typeKeywords": "type",
          "@visibility": "keyword.modifier",
          "@default": "identifier",
        },
      }],
      [/\/\/.*$/, "comment"],
      [/\/\*/, "comment", "@comment"],
      [/"([^"\\]|\\.)*$/, "string.invalid"],
      [/"/, "string", "@string"],
      [/\d+[ui](?:8|16|32|64|128)/, "number"],
      [/\d+(?:field|group|scalar)/, "number"],
      [/\d+/, "number"],
      [/[{}()[\]]/, "delimiter.bracket"],
      [/[;,.]/, "delimiter"],
      [/=>/, "operator"],
    ],
    comment: [
      [/[^/*]+/, "comment"],
      [/\*\//, "comment", "@pop"],
      [/[/*]/, "comment"],
    ],
    string: [
      [/[^\\"]+/, "string"],
      [/\\./, "string.escape"],
      [/"/, "string", "@pop"],
    ],
  },
};
