import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogRef } from '@angular/material/dialog';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { ContactService } from '../../services/contact.service';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../models/contact.model';


@Component({
  selector: 'app-add-contact-dialog',
  imports: [MatFormField, MatIconModule, CommonModule, MatInputModule, MatButtonModule, FormsModule],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})

export class AddContactDialogComponent {

  contact: Contact = {
    id: 0,
    name: '',
    email: '',
    color: '',
    phone_number: '',
  };

  constructor(
    public dialogRef: MatDialogRef<AddContactDialogComponent>,
    private contactService: ContactService
  ) {}

  generateRandomColor(): string {
    const r = Math.floor(Math.random() * 128) + 127;
    const g = Math.floor(Math.random() * 128) + 127;
    const b = Math.floor(Math.random() * 128) + 127;
    
    return `rgb(${r}, ${g}, ${b})`;  // Hier fehlte das Backtick
  }
  

  closeDialog(): void {
    this.dialogRef.close();
  }

  createContact(): void {
    if (!this.contact.name || !this.contact.email) {
      console.error('Name und Email sind erforderlich');
      return;
    }
    this.contact.color = this.generateRandomColor();
    this.contactService.createContact(this.contact).subscribe(
      (newContact) => {
        this.dialogRef.close(newContact);
      },
      (error) => {
        console.error('Fehler beim Erstellen des Kontakts:', error);
      }
    );
  }
}