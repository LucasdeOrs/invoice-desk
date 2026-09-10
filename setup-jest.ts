import { setupZonelessTestEnv } from 'jest-preset-angular/setup-env/zoneless';

// Initialise the Angular TestBed in zoneless mode to match the application's
// runtime change-detection strategy (see src/app/app.config.ts).
setupZonelessTestEnv();
