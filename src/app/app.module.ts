import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { DataService } from './data.service';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';

import 'brace';
import 'brace/mode/text';
import 'brace/mode/html';
import 'brace/mode/javascript';
import 'brace/mode/css';
import 'brace/theme/github';
import 'brace/theme/clouds';
import { AceModule } from 'ngx-ace-wrapper';

@NgModule({
  declarations: [
    AppComponent

  ],
  imports: [
    NgxSpinnerModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AceModule
  ],
  providers: [DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
