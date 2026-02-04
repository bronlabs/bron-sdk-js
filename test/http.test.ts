import { describe, it, expect } from "vitest";
import { jsonStringify } from "../src/utils/http.js";

describe("jsonStringify", () => {
  it("should stringify simple objects", () => {
    const obj = { name: "test", value: 123 };
    expect(jsonStringify(obj)).toBe('{"name":"test","value":123}');
  });

  it("should stringify nested objects", () => {
    const obj = { outer: { inner: "value" } };
    expect(jsonStringify(obj)).toBe('{"outer":{"inner":"value"}}');
  });

  it("should stringify arrays", () => {
    const arr = [1, 2, 3];
    expect(jsonStringify(arr)).toBe("[1,2,3]");
  });

  it("should convert bigint to number", () => {
    const obj = { amount: BigInt(123456789012345) };
    const result = jsonStringify(obj);
    expect(result).toBe('{"amount":123456789012345}');
  });

  it("should handle multiple bigint values", () => {
    const obj = {
      amount1: BigInt(100),
      amount2: BigInt(200),
      nested: { amount3: BigInt(300) }
    };
    const result = jsonStringify(obj);
    expect(result).toBe('{"amount1":100,"amount2":200,"nested":{"amount3":300}}');
  });

  it("should filter out null values", () => {
    const obj = { name: "test", nullValue: null, value: 123 };
    const result = jsonStringify(obj);
    expect(result).toBe('{"name":"test","value":123}');
  });

  it("should filter out null in nested objects", () => {
    const obj = { outer: { inner: "value", nullField: null } };
    const result = jsonStringify(obj);
    expect(result).toBe('{"outer":{"inner":"value"}}');
  });

  it("should handle empty objects", () => {
    expect(jsonStringify({})).toBe("{}");
  });

  it("should handle empty arrays", () => {
    expect(jsonStringify([])).toBe("[]");
  });

  it("should preserve undefined as missing keys", () => {
    const obj = { name: "test", undefinedValue: undefined };
    const result = jsonStringify(obj);
    expect(result).toBe('{"name":"test"}');
  });

  it("should handle boolean values", () => {
    const obj = { active: true, deleted: false };
    expect(jsonStringify(obj)).toBe('{"active":true,"deleted":false}');
  });

  it("should handle string values with special characters", () => {
    const obj = { text: 'hello "world"' };
    expect(jsonStringify(obj)).toBe('{"text":"hello \\"world\\""}');
  });

  it("should support pretty printing with space parameter", () => {
    const obj = { name: "test" };
    const result = jsonStringify(obj, 2);
    expect(result).toContain("\n");
    expect(result).toContain("  ");
  });

  it("should handle arrays with null values", () => {
    const arr = [1, null, 3];
    const result = jsonStringify(arr);
    expect(result).toBe("[1,null,3]");
  });

  it("should handle mixed types in arrays", () => {
    const arr = ["string", 123, true, { key: "value" }];
    const result = jsonStringify(arr);
    expect(result).toBe('["string",123,true,{"key":"value"}]');
  });

  it("should handle deeply nested structures", () => {
    const obj = {
      level1: {
        level2: {
          level3: {
            value: "deep"
          }
        }
      }
    };
    const result = jsonStringify(obj);
    expect(result).toBe('{"level1":{"level2":{"level3":{"value":"deep"}}}}');
  });

  it("should handle numeric string values", () => {
    const obj = { amount: "123.456" };
    expect(jsonStringify(obj)).toBe('{"amount":"123.456"}');
  });

  it("should handle zero values", () => {
    const obj = { count: 0, balance: BigInt(0) };
    const result = jsonStringify(obj);
    expect(result).toBe('{"count":0,"balance":0}');
  });
});
