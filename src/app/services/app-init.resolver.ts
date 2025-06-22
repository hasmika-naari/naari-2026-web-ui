import { Injectable } from "@angular/core";
import { Resolve } from "@angular/router";
import { SessionInitService } from "./session-init.service";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AppInitResolver implements Resolve<boolean> {
  constructor(private sessionInit: SessionInitService) {}

  resolve(): Observable<boolean> {
    return this.sessionInit.initializeSession();
  }
}
