import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideDatabase, getDatabase } from '@angular/fire/database';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter([]), // Add your routes here
    provideAnimations(),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyCX02FmDR7xueZ4J482hVWTSBV9JyB2SR0",
      authDomain: "test-bookings-project.firebaseapp.com",
      databaseURL: "https://test-bookings-project-default-rtdb.firebaseio.com",
      projectId: "test-bookings-project",
      storageBucket: "test-bookings-project.firebasestorage.app",
      messagingSenderId: "1071663614831",
      appId: "1:1071663614831:web:ff1ef62be4740fd778f69a",
      measurementId: "G-KQRKRS62L2"
    })),
    provideDatabase(() => getDatabase()),
    provideServiceWorker('ngsw-worker.js', {
      enabled: environment.production,
      registrationStrategy: 'registerWhenStable:30000'
    })
  ]
};
