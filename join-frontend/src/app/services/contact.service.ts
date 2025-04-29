import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/contact.model';

@Injectable({
    providedIn: 'root'
})

export class ContactService {

    constructor(private http: HttpClient) { }

    private apiUrl = 'http://127.0.0.1:8000/contacts/';

    private getAuthHeaders(): HttpHeaders {
        const user_data = sessionStorage.getItem('user_data');
        if (!user_data) {
            throw new Error('User data is not available in session storage');
        }
        const userToken = JSON.parse(user_data).token;
        return new HttpHeaders().set('Authorization', `Token ${userToken}`);
    }

    getContacts(): Observable<Contact[]> {
        const headers = this.getAuthHeaders();
        return this.http.get<Contact[]>(this.apiUrl, { headers });
    }

    deleteContact(id: number): Observable<void> {
        const headers = this.getAuthHeaders();
        return this.http.delete<void>(`${this.apiUrl}${id}/`, { headers });
    }

    getContact(id: number): Observable<Contact> {
        return this.http.get<Contact>(`${this.apiUrl}/${id}`);
    }

    createContact(contact: Contact): Observable<Contact> {
        const headers = this.getAuthHeaders();
        return this.http.post<Contact>(this.apiUrl, contact, { headers });
    }

    updateContact(id: number, contact: Contact): Observable<Contact> {
        const headers = this.getAuthHeaders();
        return this.http.put<Contact>(`${this.apiUrl}${id}/`, contact, { headers });
    }
}
