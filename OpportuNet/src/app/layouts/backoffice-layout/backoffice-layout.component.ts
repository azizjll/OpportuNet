import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { SidebarComponent } from 'src/app/backoffice/sidebar/sidebar.component';

@Component({
  selector: 'app-backoffice-layout',
  standalone: true,
  imports: [CommonModule, RouterOutlet, SidebarComponent],
  templateUrl: './backoffice-layout.component.html',
  styleUrls: ['./backoffice-layout.component.css']
})
export class BackofficeLayoutComponent {

}
