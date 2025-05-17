import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { AccountService } from '../_services/account.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserService } from '../_services/user.service';
import { DepartmentService } from '../departments/department.service';
import { EmployeeService } from './employee.service';

@Component({
  selector: 'app-employee-add-edit',
  templateUrl: './add-edit.component.html',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule]
})
export class AddEditComponent implements OnInit {
  id: string | null = null;
  employee: any = {
    employeeId: '',
    userId: '',
    position: '',
    departmentId: '',
    hireDate: new Date().toISOString().split('T')[0],
    status: 'Active'  // Set default status
  };
  users: any[] = [];
  departments: any[] = [];
  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private accountService: AccountService,
    private userService: UserService,
    private departmentService: DepartmentService,
    private employeeService: EmployeeService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loading = true;
      this.employeeService.getEmployee(this.id).subscribe({
        next: (emp) => {
          this.employee = {
            ...emp,
            status: emp.status || 'Active'  // Ensure status is set when editing
          };
          this.loading = false;
        },
        error: (err) => {
          this.errorMessage = 'Failed to load employee data';
          this.loading = false;
        }
      });
    }
    // Load users and filter for active accounts only
    this.userService.getUsers().subscribe({
      next: (users) => { 
        this.users = users.filter(user => user.isVerified); 
      },
      error: (err) => { this.errorMessage = 'Failed to load users'; }
    });
    // Load departments
    this.departmentService.getDepartments().subscribe({
      next: (departments) => { this.departments = departments; },
      error: (err) => { this.errorMessage = 'Failed to load departments'; }
    });
  }

  save() {
    this.errorMessage = '';
    this.loading = true;
    
    // Ensure status is properly set before saving
    if (!this.employee.status) {
      this.employee.status = 'Active';
    }

    if (this.id) {
      this.employeeService.updateEmployee(this.id, this.employee).subscribe({
        next: () => {
          this.router.navigate(['/admin/employees']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to update employee';
          this.loading = false;
        }
      });
    } else {
      this.employeeService.createEmployee(this.employee).subscribe({
        next: () => {
          this.router.navigate(['/admin/employees']);
        },
        error: (err) => {
          this.errorMessage = 'Failed to create employee';
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/admin/employees']);
  }
} 