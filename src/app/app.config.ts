import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), importProvidersFrom(provideFirebaseApp(() => initializeApp({"projectId":"danotes-cc355","appId":"1:41823506081:web:223e6fb3314e1e972beae0","storageBucket":"danotes-cc355.firebasestorage.app","apiKey":"AIzaSyDE155NO-wEyLqrIBjfv_5QDd7opO7ayGk","authDomain":"danotes-cc355.firebaseapp.com","messagingSenderId":"41823506081"}))), importProvidersFrom(provideFirestore(() => getFirestore()))]
};
