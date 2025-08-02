import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatCardModule } from '@angular/material/card';
import { MatSliderModule } from '@angular/material/slider';
import { MatRadioModule } from '@angular/material/radio';
import { ProgressBarMode, MatProgressBarModule } from '@angular/material/progress-bar';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { NgForOf, NgIf, NgStyle } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { Task } from '../../models/task.model';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { AddTaskDialogComponent } from '../../dialogs/add-task-dialog/add-task-dialog.component';
import { TaskDialogComponent } from '../../dialogs/task-dialog/task-dialog.component';

@Component({
  selector: 'app-board',
  providers: [TaskService],
  imports: [NgForOf, NgIf, FormsModule, MatFormFieldModule, MatInputModule,
    MatIconModule, MatButtonModule, MatCardModule, MatRadioModule,
    MatSliderModule, MatProgressBarModule, DragDropModule, NgStyle, MatDialogModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss'
})

export class BoardComponent implements OnInit {

  constructor(private taskService: TaskService, private dialog: MatDialog,
    private cdRef: ChangeDetectorRef, private cdr: ChangeDetectorRef) { }

  mode: ProgressBarMode = 'determinate';
  value = 50;
  bufferValue = 75;
  tasks = {
    todo: [] as Task[],
    inProgress: [] as Task[],
    awaitFeedback: [] as Task[],
    done: [] as Task[]
  };
  searchQuery: string = '';

  ngOnInit(): void {
    this.loadTasks();
  }

  formatCategoryName(category: string): string {
    if (category === 'User_Story') {
      return category.replace('_', ' ');
    } else {
      return category;
    }
  }

  inProgressSubtasksCount(subtasks: any[]): number {
    return subtasks.filter(subtask => subtask.status === 'done').length;
  }

  calculateProgress(subtasks: any[]): number {
    const inProgressCount = this.inProgressSubtasksCount(subtasks);
    const totalSubtasks = subtasks.length;
    return totalSubtasks > 0 ? (inProgressCount / totalSubtasks) * 100 : 0;
  }

  openAddTaskDialog(): void {
    const dialogRef = this.dialog.open(AddTaskDialogComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadTasks();
      }
    });
  }

  openTaskDialog(task: any): void {
    const dialogRef = this.dialog.open(TaskDialogComponent, {
      data: task
    });

    dialogRef.afterClosed().subscribe((result: number) => {
      if (result) {
        this.loadTasks();
        this.deleteTask(result);
      }
    });
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.loadTasks();
      },
      error: (err) => {
        console.error('Fehler beim Löschen der Aufgabe:', err);
      }
    });
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.filterTasksByStatus(tasks);
      }
    });
  }

  filterTasksByStatus(tasks: Task[]): void {
    this.tasks.todo = tasks.filter(task => task.status === 'todo');
    this.tasks.inProgress = tasks.filter(task => task.status === 'inProgress');
    this.tasks.awaitFeedback = tasks.filter(task => task.status === 'awaitFeedback');
    this.tasks.done = tasks.filter(task => task.status === 'done');
  }

  drop(event: CdkDragDrop<any[]>): void {
    const movedTask = event.item.data;

    if (event.container.id === 'todo') {
      movedTask.status = 'todo';
    } else if (event.container.id === 'inProgress') {
      movedTask.status = 'inProgress';
    } else if (event.container.id === 'done') {
      movedTask.status = 'done';
    } else if (event.container.id === 'awaitFeedback') {
      movedTask.status = 'awaitFeedback';
    }

    this.taskService.updateTaskStatus(movedTask.id, movedTask.status).subscribe(
      (updatedTask) => {
        this.loadTasks();
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
    }
    return '#ccc';
  }

  changeToUppercase(str: string): string {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  filterTasks(): void {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) {
      this.loadTasks();
      return;
    }
    this.tasks = {
      todo: this.tasks.todo.filter((task) => task.title.toLowerCase().includes(query)),
      inProgress: this.tasks.inProgress.filter((task) => task.title.toLowerCase().includes(query)),
      awaitFeedback: this.tasks.awaitFeedback.filter((task) => task.title.toLowerCase().includes(query)),
      done: this.tasks.done.filter((task) => task.title.toLowerCase().includes(query))
    };
  }
}