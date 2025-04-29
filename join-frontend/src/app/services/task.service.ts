import { Injectable } from '@angular/core';
import { Task } from '../models/task.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class TaskService {
  private apiUrl = 'http://127.0.0.1:8000/tasks/';

  constructor(private http: HttpClient) { }

  private getAuthHeaders(): HttpHeaders {
    const user_data = sessionStorage.getItem('user_data');
    if (!user_data) {
      throw new Error('User data is not available in session storage');
    }
    const userToken = JSON.parse(user_data).token;
    return new HttpHeaders().set('Authorization', `Token ${userToken}`);
  }

  createTask(task: Task): Observable<Task> {
    const headers = this.getAuthHeaders();
    return this.http.post<Task>(this.apiUrl, task, { headers });
  }

  getTasks(): Observable<Task[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task[]>(this.apiUrl, { headers });
  }

  getTaskById(id: string): Observable<Task> {
    const headers = this.getAuthHeaders();
    return this.http.get<Task>(`${this.apiUrl}${id}/`, { headers });
  }

  updateTaskStatus(id: string, status: string): Observable<Task> {
    const updatedTask = { status };
    const headers = this.getAuthHeaders();
    return this.http.patch<Task>(`${this.apiUrl}${id}/`, updatedTask, { headers });
  }

  updateSubtaskStatus(subtaskId: number, status: string): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.patch<any>(`http://127.0.0.1:8000/subtasks/${subtaskId}/update_status/`, { status }, { headers });
  }

  deleteTask(id: number): Observable<void> {
    const headers = this.getAuthHeaders();
    return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers });
  }

  updateTask(id: number, contact: Task): Observable<Task> {
    const headers = this.getAuthHeaders();
    return this.http.put<Task>(`${this.apiUrl}${id}/`, contact, { headers });
  }
}
