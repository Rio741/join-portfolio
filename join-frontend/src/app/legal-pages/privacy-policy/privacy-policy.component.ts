import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-privacy-policy',
  imports: [MatIconModule, MatButtonModule, CommonModule],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})

export class PrivacyPolicyComponent {

  constructor(private location: Location, public authService: AuthService) { }

  goBack() {
    this.location.back();
  }
}
