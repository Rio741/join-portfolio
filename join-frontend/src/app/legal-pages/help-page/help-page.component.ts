import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Location } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-help-page',
  imports: [MatIconModule, MatButtonModule],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.scss'
})

export class HelpPageComponent {

  constructor(private location: Location) { }

  goBack() {
    this.location.back();
  }
}
