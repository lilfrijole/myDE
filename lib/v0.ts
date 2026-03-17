import { createClient } from "v0-sdk";

let _client: ReturnType<typeof createClient> | null = null;

export function getV0Client() {
  if (!_client) {
    const apiKey = process.env.V0_API_KEY;
    if (!apiKey) {
      throw new Error("V0_API_KEY environment variable is not set");
    }
    _client = createClient({ apiKey });
  }
  return _client;
}
