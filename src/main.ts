import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}

export function getBaseUrl() {
  //return document.getElementsByTagName('base')[0].href;
  // return "http://antofanari-001-site1.gtempurl.com/"; 
  return "https://localhost:44399/";
}

const providers = [
  { provide: 'BASE_URL', useFactory: getBaseUrl, deps: [] }
];


platformBrowserDynamic(providers).bootstrapModule(AppModule)
  .catch(err => console.log(err));
