import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DepartmentService } from './department.service';
import { Department } from './department.model';

@Component({
  selector: 'app-department-add-edit',
  templateUrl: './add-edit.component.html'
})
export class AddEditComponent implements OnInit {
  id: number | null = null;
  department: Department = {
    id: 0,
    name: '',
    description: '',
    employeeCount: 0
  };
  errorMessage = '';
  loading = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private departmentService: DepartmentService
  ) {}

  ngOnInit() {
    this.id = this.route.snapshot.params['id'];
    if (this.id) {
      this.loading = true;
      this.departmentService.getDepartment(this.id).subscribe({
        next: (department) => {
          this.department = department;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading department:', error);
          this.errorMessage = 'Error loading department';
          this.loading = false;
        }
      });
    }
  }

  save() {
    this.loading = true;
    this.errorMessage = '';

    if (this.id) {
      // Update existing department
      this.departmentService.updateDepartment(this.id, this.department).subscribe({
        next: () => {
          this.router.navigate(['/departments']);
        },
        error: (error) => {
          console.error('Error updating department:', error);
          this.errorMessage = 'Error updating department';
          this.loading = false;
        }
      });
    } else {
      // Create new department
      this.departmentService.createDepartment(this.department).subscribe({
        next: () => {
          this.router.navigate(['/departments']);
        },
        error: (error) => {
          console.error('Error creating department:', error);
          this.errorMessage = 'Error creating department';
          this.loading = false;
        }
      });
    }
  }

  cancel() {
    this.router.navigate(['/departments']);
  }
} 