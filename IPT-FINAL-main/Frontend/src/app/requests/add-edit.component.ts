import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { RequestService } from './request.service';
import { AccountService } from '../_services/account.service';
import { User } from '../_models/user';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

type Employee = {
  id: string;
  employeeId: string;
  user: User;
};

@Component({
  selector: 'app-add-edit',
  templateUrl: './add-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AddEditComponent implements OnInit {
  id: string | undefined;
  request: any = {
    type: '',
    description: '',
    requestItems: []
  };
  loading = false;
  errorMessage = '';
  employees: Employee[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requestService: RequestService,
    public accountService: AccountService
  ) { }

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    
    if (this.accountService.accountValue?.role === 'Admin') {
      this.loadEmployees();
    }

    if (this.id) {
      this.loadRequest();
    }
  }

  loadEmployees() {
    this.requestService.getEmployees().subscribe({
      next: (employees: Employee[]) => {
        this.employees = employees;
      },
      error: (error: any) => {
        this.errorMessage = 'Error loading employees';
        console.error('Error loading employees:', error);
      }
    });
  }

  loadRequest() {
    if (!this.id) return;
    
    this.loading = true;
    this.requestService.getById(this.id).subscribe({
      next: (request) => {
        this.request = request;
        this.loading = false;
      },
      error: (error: any) => {
        this.errorMessage = 'Error loading request';
        this.loading = false;
        console.error('Error loading request:', error);
      }
    });
  }

  addItem() {
    this.request.requestItems.push({
      name: '',
      quantity: 1
    });
  }

  removeItem(index: number) {
    this.request.requestItems.splice(index, 1);
  }

  save() {
    this.errorMessage = '';
    
    if (!this.request.type) {
      this.errorMessage = 'Please select a request type';
      return;
    }

    if (!this.request.description) {
      this.errorMessage = 'Please enter a description';
      return;
    }

    if (this.accountService.accountValue?.role === 'Admin' && !this.request.employeeId) {
      this.errorMessage = 'Please select an employee';
      return;
    }

    if (this.request.requestItems.length === 0) {
      this.errorMessage = 'Please add at least one item';
      return;
    }

    for (const item of this.request.requestItems) {
      if (!item.name) {
        this.errorMessage = 'Please enter a name for all items';
        return;
      }
      if (!item.quantity || item.quantity < 1) {
        this.errorMessage = 'Please enter a valid quantity for all items';
        return;
      }
    }

    this.loading = true;

    if (this.id) {
      this.requestService.update(this.id, this.request).subscribe({
        next: () => {
          this.router.navigate(['/requests']);
        },
        error: (error: any) => {
          this.errorMessage = 'Error updating request';
          this.loading = false;
          console.error('Error updating request:', error);
        }
      });
    } else {
      this.requestService.create(this.request).subscribe({
        next: () => {
          this.router.navigate(['/requests']);
        },
        error: (error: any) => {
          this.errorMessage = 'Error creating request';
          this.loading = false;
          console.error('Error creating request:', error);
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/requests']);
  }
} 