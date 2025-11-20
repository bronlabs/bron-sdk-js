import { generateBronJwt, parseJwkEcPrivateKey } from "./auth.js";
import { SDK_VERSION } from "./version.js";

export interface HttpRequestOptions {
  method: string;
  path: string;
  body?: any;
  query?: object;
}

export class HttpClient {
  private readonly userAgent: string;

  constructor(
    private baseUrl: string,
    private apiKeyJwk: string
  ) {
    this.userAgent = `Bron SDK JS/${SDK_VERSION}`;
  }

  async request<T>({
    method,
    path,
    body,
    query
  }: HttpRequestOptions): Promise<T> {
    let fullPath = path;

    if (query && Object.keys(query).length) {
      const params = new URLSearchParams();

      for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
          const filtered = value.filter(v => v != null);
          if (filtered.length > 0) {
            params.append(key, filtered.join(','));
          }
        } else if (value != null) {
          params.append(key, value);
        }
      }

      if (params.size > 0) {
        fullPath += `?${params.toString()}`;
      }
    }

    const url = `${this.baseUrl}${fullPath}`;

    const { privateKey, kid } = parseJwkEcPrivateKey(this.apiKeyJwk);

    const jwt = generateBronJwt({
      method,
      path: fullPath,
      kid,
      privateKey,
      body: body ? jsonStringify(body) : ""
    });

    const headers: Record<string, string> = {
      Authorization: `ApiKey ${jwt}`,
      "User-Agent": this.userAgent
    };

    if (body) {
      headers["Content-Type"] = "application/json";
    }

    const res = await fetch(url, {
      method,
      headers,
      body: body ? jsonStringify(body) : undefined
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }

    return res.json();
  }
}

export function jsonStringify(obj: unknown, space?: string | number): string {
  return JSON.stringify(
    obj,
    (_, value) => {
      if (value === null) {
        return undefined; // Filtering out properties
      }

      return typeof value === 'bigint' ? Number(value) : value;
    },
    space
  );
}
