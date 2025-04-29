import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { TaskService } from '../../services/task.service';
import { CommonModule, NgIf } from '@angular/common';

@Component({
  selector: 'app-summary',
  imports: [RouterModule, NgIf, CommonModule],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})

export class SummaryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService) { }

  userData: any;
  convertedName: string = '';
  greeting: string = '';
  todoTasks: number = 0;
  doneTasks: number = 0;
  prioTasks: number = 0;
  tasksInBoard: number = 0;
  inProgressTasks: number = 0;
  awaitingFeedbackTasks: number = 0;
  upcomingDate: any;
  showNameContainer: boolean = false;

  ngOnInit(): void {
    if (window.innerWidth < 1080) {
      this.route.queryParams.subscribe(params => {
        if (params['showContainer']) {
          this.showNameContainer = true;

          setTimeout(() => {
            this.showNameContainer = false;
          }, 2000);
        }
      });
    }

    this.loadUserData();
    this.convertUsername();
    this.triggerAnimation();
    this.loadTasks();
    this.setGreeting();
  }

  setGreeting(): void {
    const hours = new Date().getHours();
    if (hours < 12) {
      this.greeting = 'Good Morning';
    } else if (hours >= 12 && hours < 18) {
      this.greeting = 'Good Afternoon';
    } else {
      this.greeting = 'Good Evening';
    }
  }

  triggerAnimation(): void {
    setTimeout(() => {
      const nameContainer = document.querySelector('.name-container');
      if (nameContainer) {
        nameContainer.classList.add('slide-in');
      }
    }, 100);
  }

  loadTasks(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        this.todoTasks = tasks.filter(task => task.status === 'todo').length;
        this.doneTasks = tasks.filter(task => task.status === 'done').length;
        this.prioTasks = tasks.filter(task => task.priority === 'urgent').length;
        this.tasksInBoard = tasks.filter(task => task.title).length;
        this.inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;
        this.awaitingFeedbackTasks = tasks.filter(task => task.status === 'awaitFeedback').length;

        this.findNextTask();
      },
      error: (err) => {
        console.error('Fehler beim Laden der Aufgaben:', err);
      }
    });
  }

  formatDate(date: any): string {
    return new Date(date).toLocaleDateString('de-DE', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  }

  findNextTask(): void {
    this.taskService.getTasks().subscribe({
      next: (tasks) => {
        const sortedTasks = tasks
          .filter(task => task.dueDate)
          .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());

        const nextTask = sortedTasks[0];
        if (nextTask) {
          this.upcomingDate = this.formatDate(nextTask.dueDate);
        }
      },
      error: (err) => {
        console.error('Fehler beim Laden der Aufgaben:', err);
      }
    });
  }

  convertUsername(): void {
    const username = this.userData.username;
    this.convertedName = username.replace(/_/g, ' ');
  }

  loadUserData(): void {
    const storedUserData = sessionStorage.getItem('user_data');
    if (storedUserData) {
      this.userData = JSON.parse(storedUserData);
    }
  }
}
