import { generateBronJwt, parseJwkEcPrivateKey } from "./auth.js";

export interface HttpRequestOptions {
  method: string;
  path: string;
  body?: any;
  query?: Record<string, string | string[]>;
}

export class HttpClient {
  constructor(
    private baseUrl: string,
    private apiKeyJwk: string
  ) {}

  async request<T>({
    method,
    path,
    body,
    query
  }: HttpRequestOptions): Promise<T> {
    // Build query string
    let fullPath = path;
    if (query && Object.keys(query).length) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
          params.append(key, value.join(","));
        } else {
          params.append(key, value);
        }
      }
      fullPath += `?${params.toString()}`;
    }
    
    const url = `${this.baseUrl}${fullPath}`;
    
    const { privateKey, kid } = parseJwkEcPrivateKey(this.apiKeyJwk);
    
    const jwt = generateBronJwt({
      method,
      path: fullPath,
      kid,
      privateKey,
      body: body ? JSON.stringify(body) : ""
    });
    
    const headers: Record<string, string> = {
      Authorization: `ApiKey ${jwt}`
    };

    if (body) headers["Content-Type"] = "application/json";

    const res = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });
    
    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`HTTP ${res.status}: ${errText}`);
    }
    
    return res.json();
  }
}