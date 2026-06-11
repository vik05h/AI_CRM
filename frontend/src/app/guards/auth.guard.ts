import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';

export const authGuard: CanActivateFn = async () => {
  const router = inject(Router);
  const auth = inject(Auth);
  
  const user = await firstValueFrom(authState(auth));
  
  if (user) {
    return true;
  }
  
  return router.parseUrl('/');
};
