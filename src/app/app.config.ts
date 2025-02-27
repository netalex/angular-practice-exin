import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { it_IT, provideNzI18n } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';
import { registerLocaleData } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import it from '@angular/common/locales/it';

registerLocaleData(it);

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideAnimations(),
    provideNzI18n(it_IT),
    importProvidersFrom(FormsModule),
    provideHttpClient()
  ]
};
