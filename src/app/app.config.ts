import { ApplicationConfig } from "@angular/core";
import { provideRouter, withComponentInputBinding } from "@angular/router";

import { routes } from "./app.routes";
import { provideHttpClient, withInterceptors } from "@angular/common/http";
import { baseUrlInterceptor } from "./interceptors/base-url.interceptor";

export const appConfig: ApplicationConfig = {
    providers: [provideRouter(routes, withComponentInputBinding()), provideHttpClient(withInterceptors([baseUrlInterceptor]))],
};
