import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { AlertService } from '../../_services/alert.service';
import { AccountService } from '../../_services/account.service';

@Component({ templateUrl: 'list.component.html' })
export class ListComponent implements OnInit {
  accounts!: any[];

  constructor(
    private accountService: AccountService,
    private alertService: AlertService
  ) { }

  ngOnInit() {
    this.loadAccounts(); // Load accounts on initialization
  }

  loadAccounts() {
    this.accountService.getAll()
      .pipe(first())
      .subscribe(accounts => this.accounts = accounts);
  }

  activateAccount(id: string) {
    this.accountService.activate(id).subscribe({
      next: () => {
        this.alertService.success('Account activated and verified successfully');
        const account = this.accounts.find(x => x.id === id);
        if (account) {
          account.isActive = true;
          account.isVerified = true;
        }
      },
      error: error => {
        this.alertService.error(error);
      }
    });
  }

  deactivateAccount(id: string) {
    this.accountService.deactivate(id).subscribe({
      next: () => {
        this.alertService.success('Account deactivated and unverified successfully');
        const account = this.accounts.find(x => x.id === id);
        if (account) {
          account.isActive = false;
          account.isVerified = false;
        }
      },
      error: error => {
        this.alertService.error(error);
      }
    });
  }
}