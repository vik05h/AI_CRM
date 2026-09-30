import { Injectable, inject, signal } from '@angular/core';
import { Auth, authState, signInWithPopup, GoogleAuthProvider, signOut, User } from '@angular/fire/auth';
import { Router } from '@angular/router';

export interface AppUser {
  displayName?: string | null;
  email?: string | null;
  photoURL?: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private auth = inject(Auth);
  private router = inject(Router);

  public currentUser = signal<User | AppUser | null | undefined>(undefined);

  constructor() {
    if (typeof localStorage !== 'undefined') {
      const demoUser = localStorage.getItem('crm_demo_user');
      if (demoUser) {
        try {
          this.currentUser.set(JSON.parse(demoUser));
        } catch {
          localStorage.removeItem('crm_demo_user');
        }
      }
    }

    authState(this.auth).subscribe((user) => {
      if (user) {
        this.currentUser.set(user);
        if (typeof localStorage !== 'undefined') {
          localStorage.removeItem('crm_demo_user');
        }
        if (this.router.url === '/') {
          this.router.navigate(['/dashboard']);
        }
      } else if (!this.currentUser()) {
        this.currentUser.set(null);
      }
    });
  }

  enterDemoMode() {
    const demoUser: AppUser = {
      displayName: 'Demo Marketer',
      email: 'marketer@aicrm.demo',
      photoURL: null
    };
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('crm_demo_user', JSON.stringify(demoUser));
    }
    this.currentUser.set(demoUser);
    this.router.navigate(['/dashboard']);
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
      if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('crm_demo_user');
      }
      await signOut(this.auth);
    } catch (error) {
      console.error("Error logging out", error);
    } finally {
      this.currentUser.set(null);
      this.router.navigate(['/']);
    }
  }
}
