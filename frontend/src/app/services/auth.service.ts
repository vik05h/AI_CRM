import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  public currentUser = signal<User | null | undefined>(undefined);

  constructor() {
    authState(this.auth).subscribe((user) => {
      this.currentUser.set(user);
      if (user && this.router.url === '/') {
        this.router.navigate(['/dashboard']);
      }
    });
  }

  async loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(this.auth, provider);
    } catch (error) {
      console.error("Error logging in with Google", error);
    }
  }

  async logout() {
    try {
      await signOut(this.auth);
      this.router.navigate(['/']);
    } catch (error) {
      console.error("Error logging out", error);
    }
  }
}
