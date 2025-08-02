import { CommonModule, NgFor, NgIf, NgStyle } from '@angular/common';
import { Component, Inject, model, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { TaskService } from '../../services/task.service';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatDatepickerModule, MatDatepickerToggle } from '@angular/material/datepicker';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatOptionModule, provideNativeDateAdapter } from '@angular/material/core';
import { Contact } from '../../models/contact.model';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-task-dialog',
  providers: [provideNativeDateAdapter(), TaskService],
  imports: [NgStyle, NgFor, NgIf, MatIconModule, MatButtonModule, MatCheckboxModule, FormsModule,
    MatLabel, MatFormField, MatDatepickerModule, MatDatepickerToggle, MatButtonToggleModule, MatOptionModule,
    MatSelect, MatInputModule, MatSelectModule, CommonModule, MatListModule, ReactiveFormsModule
  ],
  templateUrl: './task-dialog.component.html',
  styleUrl: './task-dialog.component.scss'
})

export class TaskDialogComponent implements OnInit {
  isInputFocused: boolean = false;
  inputSubtask: string = '';
  createdSubtasks: { id: number; title: string; status: 'in-progress' | 'completed' }[] = [];
  AnewSubtasks: { title: string, status: 'in-progress' | 'completed' }[] = [];
  editingIndex: number | null = null;
  contacts: Contact[] = [];
  selectedContacts: string[] = [];
  isEditMode: boolean = false;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, public dialogRef: MatDialogRef<TaskDialogComponent>,
    private taskService: TaskService, private dialog: MatDialog, private contactService: ContactService) {
    this.task = data;
  }

  readonly checked = model(false);
  task: any;

  deleteTask(id: number): void {
    this.dialogRef.close(id);
  }

  ngOnInit(): void {
    this.loadContacts();
    this.loadSubtasks();
  }

  loadSubtasks() {
    this.createdSubtasks = this.task.subtasks
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

  inProgressSubtasksCount(subtasks: any[]): number {
    return subtasks.filter(subtask => subtask.status === 'done').length;
  }

  closeDialog(): void {
    this.dialogRef.close();
  }

  formatCategoryName(category: string): string {
    if (category === 'User_Story') {
      return category.replace('_', ' ');
    } else {
      return category;
    }
  }

  updateSubtaskStatus(taskId: number, subtask: any): void {
    const newStatus = subtask.status === 'done' ? 'inProgress' : 'done';
    this.taskService.updateSubtaskStatus(subtask.id, newStatus).subscribe(
      (updatedSubtask) => {
        subtask.status = updatedSubtask.status;
      },
      (error) => {
        console.error('Fehler beim Aktualisieren des Subtask-Status:', error);
      }
    );
  }

  getInitials(contact: any): string {
    let contactName = '';

    if (typeof contact === 'string') {
      contactName = contact;
    } else if (typeof contact === 'object' && contact.name) {
      contactName = contact.name;
    } else {
      return '';
    }

    const nameParts = contactName.split(' ');
    const firstInitial = nameParts[0]?.charAt(0).toUpperCase() || '';
    const lastInitial = nameParts[1]?.charAt(0).toUpperCase() || '';
    return `${firstInitial}${lastInitial}`;
  }

  getContactColor(contact: any): string {
    if (typeof contact === 'object' && contact.color) {
      return contact.color;
    } else if (typeof contact === 'string') {
      return contact;
    }
    return '#ccc';
  }

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = (d || new Date());
    date.setHours(0, 0, 0, 0);

    return date >= today;
  };

  formattingDate() {
    if (this.task.dueDate) {
      if (typeof this.task.dueDate === 'string' && !isNaN(Date.parse(this.task.dueDate))) {
        return;
      }
      if (this.task.dueDate instanceof Date) {
        const formattedDate = this.task.dueDate.toISOString().split('T')[0];
        this.task.dueDate = formattedDate as unknown as Date;
      }
    }
  }

  changeToUppercase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }





  // ---------------------------





  onSubmit(form: any) {
    this.formattingDate();

    if (form.valid) {
      this.task.subtasks = this.createdSubtasks;
      this.taskService.updateTask(this.task.id, this.task).subscribe({
        next: (response) => {
          this.isEditMode = false;
          this.dialogRef.close();
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  editTask() {
    this.isEditMode = true;
  }

  onInputFocus(): void {
    this.isInputFocused = true;
  }

  onInputBlur(): void {
    this.isInputFocused = false;
  }

  addSubtask() {
    if (this.inputSubtask.trim() !== '') {
      const newSubtask = {
        id: this.createdSubtasks.length + 1,
        title: this.inputSubtask.trim(),
        status: 'in-progress' as 'in-progress' | 'completed',
      };
      this.createdSubtasks.push(newSubtask);
      this.inputSubtask = '';
    }
  }

  clearInputField() {
    this.inputSubtask = '';
  }

  deleteSubtask(index: number) {
    this.createdSubtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.inputSubtask = this.createdSubtasks[index].title;
    this.editingIndex = index;
  }

  updateSubtask() {
    if (this.editingIndex !== null) {
      this.createdSubtasks[this.editingIndex].title = this.inputSubtask;
      this.editingIndex = null;
      this.inputSubtask = '';
    }
  }

  compareContacts = (c1: any, c2: any) => {
    return c1 && c2 && c1.id === c2.id;
  };
}
