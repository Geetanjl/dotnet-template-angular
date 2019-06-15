import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { HomeComponent } from './home/home.component';

import {
    AuthModule,
    OidcSecurityService,
    ConfigResult,
    OidcConfigService,
    OpenIdConfiguration
} from 'angular-auth-oidc-client';

import { AutoLoginComponent } from './auto-login/auto-login.component';
import { routing } from './app.routes';
import { ForbiddenComponent } from './forbidden/forbidden.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { ProtectedComponent } from './protected/protected.component';
import { AuthorizationGuard } from './authorization.guard';

export function loadConfig(oidcConfigService: OidcConfigService) {
    console.log('APP_INITIALIZER STARTING');
    return () => oidcConfigService.load_using_stsServer('https://accounts.google.com');
}

@NgModule({
  declarations: [
    AppComponent,
    NavMenuComponent,
    HomeComponent,
    AutoLoginComponent,
    ForbiddenComponent,
    UnauthorizedComponent,
    ProtectedComponent
  ],
  imports: [
    BrowserModule.withServerTransition({ appId: 'ng-cli-universal' }),
    HttpClientModule,
    AuthModule.forRoot(),
    FormsModule,
    routing,
  ],
  providers: [
	  OidcSecurityService,
	  OidcConfigService,
	  {
		  provide: APP_INITIALIZER,
		  useFactory: loadConfig,
		  deps: [OidcConfigService],
		  multi: true
    },
    AuthorizationGuard
	],
  bootstrap: [AppComponent]
})


export class AppModule {
    constructor(
        private oidcSecurityService: OidcSecurityService,
        private oidcConfigService: OidcConfigService,
    ) {
      this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

        const config: OpenIdConfiguration = {
          stsServer: configResult.customConfig.stsServer,
          redirect_url: configResult.customConfig.redirect_url,
          client_id: configResult.customConfig.client_id,
          response_type: configResult.customConfig.response_type,
          scope: configResult.customConfig.scope,
          post_logout_redirect_uri: configResult.customConfig.post_logout_redirect_uri,
          start_checksession: configResult.customConfig.start_checksession,
          silent_renew: configResult.customConfig.silent_renew,
          silent_renew_url: 'https://localhost:44311/silent-renew.html',
          post_login_route: configResult.customConfig.startup_route,
          forbidden_route: configResult.customConfig.forbidden_route,
          unauthorized_route: configResult.customConfig.unauthorized_route,
          log_console_warning_active: configResult.customConfig.log_console_warning_active,
          log_console_debug_active: configResult.customConfig.log_console_debug_active,
          max_id_token_iat_offset_allowed_in_seconds: configResult.customConfig.max_id_token_iat_offset_allowed_in_seconds,
          history_cleanup_off: true
          // iss_validation_off: false
          // disable_iat_offset_validation: true
        };

        this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
      });


        //this.oidcConfigService.onConfigurationLoaded.subscribe(() => {

        //let openIDImplicitFlowConfiguration = new OpenIDImplicitFlowConfiguration();
        //openIDImplicitFlowConfiguration.stsServer = 'https://accounts.google.com';
        //openIDImplicitFlowConfiguration.redirect_url = 'https://localhost:44388';
        //openIDImplicitFlowConfiguration.client_id = '188968487735-b1hh7k87nkkh6vv84548sinju2kpr7gn.apps.googleusercontent.com';
        //openIDImplicitFlowConfiguration.response_type = 'id_token token';
        //openIDImplicitFlowConfiguration.scope = 'openid email profile';
        //openIDImplicitFlowConfiguration.post_logout_redirect_uri = 'https://localhost:44388/unauthorized';
        //openIDImplicitFlowConfiguration.post_login_route = '/home';
        //openIDImplicitFlowConfiguration.forbidden_route = '/forbidden';
        //openIDImplicitFlowConfiguration.unauthorized_route = '/unauthorized';
        //openIDImplicitFlowConfiguration.trigger_authorization_result_event = true;
        //openIDImplicitFlowConfiguration.log_console_warning_active = true;
        //openIDImplicitFlowConfiguration.log_console_debug_active = true;
        //openIDImplicitFlowConfiguration.max_id_token_iat_offset_allowed_in_seconds = 20;

        //const authWellKnownEndpoints = new AuthWellKnownEndpoints();
        //authWellKnownEndpoints.setWellKnownEndpoints(this.oidcConfigService.wellKnownEndpoints);

        //this.oidcSecurityService.setupModule(openIDImplicitFlowConfiguration, authWellKnownEndpoints);

        //});

        console.log('APP STARTING');
    }
}

