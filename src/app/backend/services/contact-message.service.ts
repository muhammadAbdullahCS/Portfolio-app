import { Injectable } from '@angular/core';
import type { ContactMessage } from '../../shared/interfaces';
import { ContactMessageDB } from '../database/contact-message-db';

@Injectable({ providedIn: 'root' })
export class ContactMessageService {
  private readonly db = new ContactMessageDB();

  submit(name: string, email: string, message: string): ContactMessage {
    return this.db.insert({ name, email, message });
  }

  getAll(): ContactMessage[] {
    return this.db.getAll();
  }

  delete(id: number): boolean {
    return this.db.delete(id);
  }
}
