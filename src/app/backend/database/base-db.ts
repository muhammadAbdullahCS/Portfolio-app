/**
 * Pure in-memory persistence — no Angular imports.
 */
export class BaseDB<T extends { id: number }> {
  protected data: T[] = [];

  create(item: T): T {
    this.data.push(item);
    return item;
  }

  getAll(): T[] {
    return [...this.data];
  }

  getById(id: number): T | undefined {
    return this.data.find((i) => i.id === id);
  }

  update(id: number, item: Partial<T>): T | undefined {
    const index = this.data.findIndex((i) => i.id === id);
    if (index === -1) {
      return undefined;
    }
    this.data[index] = { ...this.data[index], ...item } as T;
    return this.data[index];
  }

  delete(id: number): boolean {
    const before = this.data.length;
    this.data = this.data.filter((i) => i.id !== id);
    return this.data.length < before;
  }
}
