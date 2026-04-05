import "@testing-library/jest-dom";

// Node 25 provides a built-in localStorage without .clear() / .removeItem() etc.
// Replace it with a fully-spec-compliant in-memory Storage so tests work correctly.
class InMemoryStorage implements Storage {
  private store: Record<string, string> = {};

  get length() {
    return Object.keys(this.store).length;
  }
  key(index: number): string | null {
    return Object.keys(this.store)[index] ?? null;
  }
  getItem(key: string): string | null {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }
  setItem(key: string, value: string): void {
    this.store[key] = String(value);
  }
  removeItem(key: string): void {
    delete this.store[key];
  }
  clear(): void {
    this.store = {};
  }
}

Object.defineProperty(globalThis, "localStorage", {
  value: new InMemoryStorage(),
  writable: true,
});
Object.defineProperty(globalThis, "sessionStorage", {
  value: new InMemoryStorage(),
  writable: true,
});
