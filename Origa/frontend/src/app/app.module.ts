import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { ChartsModule, WavesModule } from 'angular-bootstrap-md'
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
declarations: [
	AppComponent
],
imports: [
	BrowserModule,
	MDBBootstrapModule.forRoot(),
	AppRoutingModule,
	HttpClientModule,
 FontAwesomeModule
],
providers: [],
bootstrap: [AppComponent]
})
export class AppModule { }
