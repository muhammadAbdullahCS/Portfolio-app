import type { ContactMessage } from '../../shared/interfaces';
import { BaseDB } from './base-db';

export class ContactMessageDB extends BaseDB<ContactMessage> {
  private nextId = 1;

  insert(msg: Omit<ContactMessage, 'id' | 'createdAt'>): ContactMessage {
    const full: ContactMessage = {
      id: this.nextId++,
      ...msg,
      createdAt: new Date().toISOString(),
    };
    return this.create(full);
  }
}
