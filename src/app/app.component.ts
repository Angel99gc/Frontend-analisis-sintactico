import { Component, ElementRef, ViewChild } from '@angular/core';
import {Subscription} from 'rxjs';
import { DataService} from "./data.service";
import { NgxSpinnerService } from "ngx-spinner";
import {HttpErrorResponse} from "@angular/common/http";
import Swal from 'sweetalert2';
import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-javascript';
import 'ace-builds/src-noconflict/theme-github';

const THEME = 'ace/theme/github';
const LANG = 'ace/mode/javascript';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  @ViewChild('labelPos') labelPos: ElementRef;
  @ViewChild('terminal') codeReal: ElementRef;
  @ViewChild('codeBloc') codeBloc: ElementRef;
  private codeEditor: ace.Ace.Editor;

  title = 'Frontend-analisis-sintactico';
  private subscription: Subscription = new Subscription();
  content:any;
  data:any;

  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService
  ) {
  }
  ngAfterViewInit(): void {
    const element = this.codeBloc.nativeElement;
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 20,
      maxLines: Infinity,
    };
    this.codeEditor = ace.edit(element, editorOptions);
    ace.config.set('basePath', '/assets/ui/');
    ace.config.set('modePath', '/assets/ui/');
    ace.config.set('themePath', '/assets/ui/');
    ace.config.set('workerPath','/assets/ui/');
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold f
    this.codeEditor.getSession().selection.on('changeCursor', ()=>{
      this.labelPos.nativeElement.innerText = (this.codeEditor.selection.getCursor().row+1) + " : " + (this.codeEditor.selection.getCursor().column);
    });

  }

  runCode() {
    if(this.codeEditor.getValue() == ""){
      Swal.fire({
        title: 'Error:',
        text: 'El editor no se puede agregar vacio.',
        icon: 'error',
        timer: 3000,
        showConfirmButton: false,
      });
      return;
    }
    console.log(this.codeEditor.getValue())
    let data: any = {
      code: this.codeEditor.getValue()
    }
    this.spinner.show();
    this.subscription.add(this.dataService.GetPrueba(data).subscribe(
      (response) => {
        console.log(response)
        if (this.codeReal.nativeElement.value=="") this.codeReal.nativeElement.value += ">> " + this.codeEditor.getValue();
        else this.codeReal.nativeElement.value += "\n>> "+ this.codeEditor.getValue();
        this.codeEditor.setValue("");
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
