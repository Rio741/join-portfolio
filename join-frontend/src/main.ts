import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideHttpClient, withFetch } from '@angular/common/http'; // Importiere HttpClient und withFetch

// Erweiterung der appConfig, um den HttpClient mit fetch zu konfigurieren
const updatedAppConfig = {
  ...appConfig,
  providers: [
    ...appConfig.providers, // Behalte die bestehenden Provider bei
    provideHttpClient(withFetch()) // Füge die HttpClient-Konfiguration hinzu
  ]
};

bootstrapApplication(AppComponent, updatedAppConfig)
  .catch((err) => console.error(err));
