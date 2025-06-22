import { catchError, Observable, of } from "rxjs";
import { LocalStorageService } from "./local-storage.service";
import { AppUtilService } from "./app.util.service";
import { Injectable } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class SessionInitService {
  constructor(
    private storageService: LocalStorageService,
    private appUtilService: AppUtilService
  ) {}

  initializeSession(): Observable<boolean> {
    const userName = this.storageService.getItemByName("userName");
    const passWord = this.storageService.getItemByName("passWord");

    if (!userName || !passWord) {
      return of(false); // Skip login
    }

    let parsedUserName: string;
    let parsedUserPassword: string;

    try {
      parsedUserName = JSON.parse(userName);
    } catch {
      parsedUserName = userName;
    }

    try {
      parsedUserPassword = JSON.parse(passWord);
    } catch {
      parsedUserPassword = passWord;
    }

    // Use updated loginWithCredentials that returns Observable<boolean>
    return this.appUtilService.loginWithCredentials(parsedUserName, parsedUserPassword, '').pipe(
      catchError((error) => {
        console.error('Auto-login failed in session init:', error);
        return of(false); // Resolve to false to let the app continue
      })
    );
  }
}
