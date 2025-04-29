import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-legal-notice',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {

  constructor(private location: Location, public authService: AuthService) { }

  goBack() {
    this.location.back();
  }
}
