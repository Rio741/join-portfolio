import { CommonModule, NgForOf } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { EditContactDialogComponent } from '../../dialogs/edit-contact-dialog/edit-contact-dialog.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-contacts',
  imports: [
    CommonModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatDividerModule,
    NgForOf,
    MatCardModule,
  ],
  templateUrl: './contacts.component.html',
  styleUrls: ['./contacts.component.scss'],
})

export class ContactsComponent implements OnInit {

  constructor(private dialog: MatDialog, private contactService: ContactService) { }

  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  buttonVisible: boolean = false;
  screenWidth: number = window.innerWidth;

  ngOnInit(): void {
    this.loadContacts();
    this.screenWidth = window.innerWidth;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact;
    
    if (this.selectedContact) {
      setTimeout(() => {
        document.querySelector('.contact-under-section')?.classList.add('show');
      }, 10);
    }

    if (this.screenWidth <= 1080 && this.selectedContact) {
      document.querySelector('.contact-main-section')?.classList.add('d-flex');
      setTimeout(() => {
        
        document.querySelector('.mat-mdc-card')?.classList.add('hide');
        document.querySelector('.contact-main-section')?.classList.add('content-padding');
      }, 10);
    }
  }

  mobileGoBack() {
    document.querySelector('.mat-mdc-card')?.classList.remove('hide');
    document.querySelector('.contact-main-section')?.classList.remove('content-padding');
    document.querySelector('.contact-main-section')?.classList.remove('d-flex');
    this.selectedContact = null;

  }

  handleContactCreated(newContact: Contact): void {
    this.loadContacts();
    this.showSlideInButton();
  }

  showSlideInButton(): void {
    this.buttonVisible = true;
    setTimeout(() => {
      this.buttonVisible = false;
    }, 3000);
  }

  loadContacts(): void {
    this.contactService.getContacts().subscribe(
      (data) => {
        this.contacts = data;
      },
      (error) => {
        console.error('Fehler beim Laden der Kontakte', error);
      }
    );
  }

  deleteContact(contact: Contact): void {
    this.contactService.deleteContact(contact.id).subscribe(
      () => {
        this.contacts = this.contacts.filter(c => c.id !== contact.id);
      },
      (error) => {
        console.error('Fehler beim Löschen des Kontakts', error);
      }
    );
  }

  get groupedContacts(): { [key: string]: Contact[] } {
    return this.contacts
      .sort((a, b) => a.name.localeCompare(b.name))
      .reduce((groups: { [key: string]: Contact[] }, contact: Contact) => {
        const firstLetter = contact.name.charAt(0).toUpperCase();
        if (!groups[firstLetter]) {
          groups[firstLetter] = [];
        }
        groups[firstLetter].push(contact);
        return groups;
      }, {});
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');
  }

  openAddContactDialog(): void {
    const dialogRef = this.dialog.open(AddContactDialogComponent);

    dialogRef.afterClosed().subscribe((newContact: Contact | undefined) => {
      if (newContact) {
        this.handleContactCreated(newContact);
      }
    });
  }

  openEditContactDialog(): void {
    const dialogRef = this.dialog.open(EditContactDialogComponent, {
      data: this.selectedContact,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.selectContact(result);
      } 
    });
  }
}
