import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-subnav',
  templateUrl: './subnav.component.html',
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class SubNavComponent { }