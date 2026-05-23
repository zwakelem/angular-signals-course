import { Injectable, signal } from "@angular/core";

@Injectable({
  providedIn: "root",
})
export class LoadingService {

  #loadingSignal = signal(false);
  loading = this.#loadingSignal.asReadonly();

  public loadingOn() {
    this.#loadingSignal.set(true);
  }

  public loadingOff() {
    this.#loadingSignal.set(false);
  }

}
