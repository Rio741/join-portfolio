import { Component, OnInit } from '@angular/core';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatListModule } from '@angular/material/list';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-task',
  providers: [provideNativeDateAdapter(), TaskService],
  imports: [MatSelectModule, MatButtonModule, MatIconModule, MatInputModule,
    MatFormFieldModule, MatListModule, CommonModule, FormsModule, MatSelectModule,
    MatCheckboxModule, MatButtonToggleModule, ReactiveFormsModule, MatDatepickerModule],
  templateUrl: './add-task.component.html',
  styleUrl: './add-task.component.scss'
})

export class AddTaskComponent implements OnInit {
  task: Task;
  isInputFocused: boolean = false;
  selectedContacts: string[] = [];
  newSubtask: string = '';
  newSubtasks: string[] = [];
  selectedSubtasks: { title: string, status: 'in-progress' | 'completed' }[] = []; 
  editingIndex: number | null = null;
  contacts: Contact[] = [];

  constructor(private taskService: TaskService, private contactService: ContactService, private router: Router) {
    this.task = new Task(
      '',
      '',
      [],
      null,
      'medium',
      '',
      [],
      'todo'
    );
  }

  ngOnInit(): void {
    this.loadContacts();
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

  myFilter = (d: Date | null): boolean => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const date = (d || new Date());
    date.setHours(0, 0, 0, 0);

    return date >= today;
  };

  formattingDate() {
    if (this.task.dueDate) {
      const formattedDate = this.task.dueDate.toISOString().split('T')[0];
      this.task.dueDate = formattedDate as unknown as Date;
    }
  }

  onSubmit(form: any) {
    this.selectedSubtasks = this.newSubtasks.map((title) => ({
      title: title.trim(),
      status: 'in-progress',
    }));
    this.task.subtasks = [...this.selectedSubtasks];
    this.formattingDate();

    if (form.valid) {
      this.taskService.createTask(this.task).subscribe({
        next: (response) => {
          this.router.navigate(['/kanban/board']);
        },
        error: (error) => {
          console.error('Error creating task:', error);
        }
      });
    }
  }

  clearForm(form: any) {
    form.resetForm();
    this.task = new Task(
      '',
      '',
      [],
      null,
      'medium',
      '',
      [],
      'todo'
    );
  }

  onInputFocus(): void {
    this.isInputFocused = true;
  }
  
  onInputBlur(): void {
    this.isInputFocused = false;
  }
  
  addSubtask() {
    if (this.newSubtask.trim() !== '') {
      this.newSubtasks.push(this.newSubtask.trim());
      this.newSubtask = '';
    }
  }

  clearInputField() {
    this.newSubtask = '';
  }

  deleteSubtask(index: number) {
    this.newSubtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.newSubtask = this.newSubtasks[index];
    this.editingIndex = index;
  }

  updateSubtask() {
    if (this.editingIndex !== null) {
      this.newSubtasks[this.editingIndex] = this.newSubtask;
      this.editingIndex = null;
      this.newSubtask = '';
    }
  }
}


