import { Component } from '@angular/core';
import { Account } from './_models/account';
import { AccountService } from './_services/account.service';

@Component({ selector: 'app-root', templateUrl: 'app.component.html' })
export class AppComponent {
  title = 'user-management-system';
  account: Account | null = null;

  constructor(private accountService: AccountService) {
    this.accountService.account.subscribe((x) => (this.account = x));
  }

  logout() {
    this.accountService.logout();
  }
}
