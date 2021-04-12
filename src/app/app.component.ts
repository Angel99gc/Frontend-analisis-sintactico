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
  @ViewChild('labelPos') labelPos: ElementRef;
  @ViewChild('codeBloc') codeBloc: ElementRef;
  @ViewChild('codeReal') codeReal: ElementRef;

  title = 'Frontend-analisis-sintactico';
  private subscription: Subscription = new Subscription();
  content:any;
  data:any;

  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService
  ) {
  }

  runCode() {
    console.log(this.content);

    let data: any = {
      code: this.content
    }
    this.spinner.show();
    this.subscription.add(this.dataService.GetPrueba(data).subscribe(
      (response) => {
        console.log(response)
        if (this.codeReal.nativeElement.value=="") this.codeReal.nativeElement.value += this.content;
        else this.codeReal.nativeElement.value += "\n"+ this.content;
        this.content = "";
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

  setFilaColumna(event, txt) {
    console.log('ace event', event[1].anchor.row + " - " + event[1].anchor.column);
    console.log(event[1]);
    this.labelPos.nativeElement.innerText = (event[1].anchor.row+1) + " - " + (event[1].anchor.column+1);
  }
}
