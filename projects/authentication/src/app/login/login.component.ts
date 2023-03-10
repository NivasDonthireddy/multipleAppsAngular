import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  public email = '';
  public password = '';

  constructor(private cookieService: CookieService) {}

  private storageList: {
    name: string;
    role: string;
    email: string;
    password: string;
    isActive: boolean;
  }[] = [];

  public errorMessage = '';

  ngOnInit(): void {
    const userList = this.cookieService.get('userList');
    if (userList) {
      this.storageList = JSON.parse(userList);
      this.checkUserSession();
    }
  }

  static getApplicationUrl(roleName: string): string {
    switch (roleName) {
      case 'Admin':
        return environment.ADMIN_URL;
      case 'Customer':
        return environment.CUSTOMER_URL;
      default:
        return environment.AUTHENTICATION_URL;
    }
  }

  loginHandler(): void {
    const isValidUserCredential: boolean =
      !!this.storageList.length &&
      !!this.storageList.filter(
        (user) => user.email === this.email && user.password === this.password
      );

    if (!isValidUserCredential) {
      this.errorMessage = 'Email or password is incorrect!!';
    } else {
      this.storageList.map((user) => {
        user.isActive = user.email === this.email;
        return user;
      });

      this.cookieService.set('userList', JSON.stringify(this.storageList));
      const getUserDetails = this.storageList.find((user) => user.isActive);
      if (getUserDetails) {
        const getPath = LoginComponent.getApplicationUrl(getUserDetails.role);
        window.location.href = getPath;
      } else {
        window.location.href = environment.AUTHENTICATION_URL;
      }
    }
  }

  checkFormValidity() {
    return !!this.email && !!this.password;
  }

  checkUserSession(): void {
    const getUserDetails = this.storageList.find((user) => user.isActive);
    if (!getUserDetails) {
      return;
    }

    window.location.href = LoginComponent.getApplicationUrl(
      getUserDetails.role
    );
  }
}
