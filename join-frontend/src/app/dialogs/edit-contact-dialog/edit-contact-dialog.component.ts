import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-edit-contact-dialog',
  imports: [MatFormField, MatIconModule, CommonModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss'
})

export class EditContactDialogComponent {
  contact: any;
  contacts: Contact[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    public dialogRef: MatDialogRef<EditContactDialogComponent>,
    private contactService: ContactService
  ) {
    this.contact = { ...data };
  }

  saveChanges(): void {
    this.contactService.updateContact(this.contact.id, this.contact).subscribe(
      (updatedContact) => {
        this.dialogRef.close(updatedContact);
      },
      (error) => {
        console.error('Error updating contact:', error);
      }
    );
  }

  deleteContact(contact: Contact): void {
    this.contactService.deleteContact(contact.id).subscribe(
      () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
        this.dialogRef.close();
      },
      (error) => {
        console.error('Fehler beim Löschen des Kontakts', error);
      }
    );
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  closeDialog(): void {
    this.dialogRef.close();
  }
}
