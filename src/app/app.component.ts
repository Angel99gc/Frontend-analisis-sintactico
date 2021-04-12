import { Component, ElementRef, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';
import { DataService} from "./data.service";
import { NgxSpinnerService } from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  @ViewChild('codeBloc') codeBloc:ElementRef;
  title = 'Frontend-analisis-sintactico';
  private subscription: Subscription = new Subscription();
  datosTextArea = {filas : 0, columnas : 0};

  constructor(
    private dataService:DataService,
    private spinner: NgxSpinnerService
  ) {}

  runCode(){
    console.log('runCode:');
    let data: any = {
      code: this.codeBloc.nativeElement.value
    }
    this.spinner.show();
    this.subscription.add(this.dataService.GetPrueba(data).subscribe(
      (response) => {
        console.log(response)
        this.spinner.hide();
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log('Error desde el Angular')
        } else {
          console.log('Error desde el Servidor')
          Swal.fire({
            title: 'Error al conectar con el servidor.',
            text: 'Inténte de nuevo más tarde.',
            icon: 'error',
            timer: 5000,
            showConfirmButton: false,
          })
        }
        this.spinner.hide();
      }
    ));
  }


}
