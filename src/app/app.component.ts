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
  @ViewChild('terminal') terminal: ElementRef;
  @ViewChild('codeBloc') codeBloc: ElementRef;
  @ViewChild('codeTxt') codeTxt: ElementRef;
  private codeEditor: ace.Ace.Editor;

  title = 'Frontend-analisis-sintactico';
  private subscription: Subscription = new Subscription();
  content: any;

  constructor(
    private dataService: DataService,
    private spinner: NgxSpinnerService
  ) {
  }

  ngAfterViewInit(): void {
    this.terminal.nativeElement.value = ">> ";
    const editorOptions: Partial<ace.Ace.EditorOptions> = {
      highlightActiveLine: true,
      minLines: 20,
      maxLines: Infinity,
    };
    this.codeEditor = ace.edit(this.codeBloc.nativeElement, editorOptions);
    ace.config.set('basePath', '/assets/ui/');
    ace.config.set('modePath', '/assets/ui/');
    ace.config.set('themePath', '/assets/ui/');
    ace.config.set('workerPath', '/assets/ui/');
    this.codeEditor.setTheme(THEME);
    this.codeEditor.getSession().setMode(LANG);
    this.codeEditor.setShowFoldWidgets(true); // for the scope fold f
    this.codeEditor.focus();
    this.codeEditor.getSession().selection.on('changeCursor', () => {
      this.labelPos.nativeElement.innerText = (this.codeEditor.selection.getCursor().row + 1) + " : " + (this.codeEditor.selection.getCursor().column);
    });
  }
  ngOnDestroy():void{
    this.subscription.unsubscribe();
  }

  getSnippetTerminal(){
    let texto = this.terminal.nativeElement.value;
    let textoVolteado = this.reverse(texto);
    let listaSnippets = textoVolteado.split(" >>")
    return this.reverse(listaSnippets[0]);

  }
  runCode(isTerminal) {
    let data: any = {};
    if (isTerminal) {//en caso de ser terminal y con enter
      let textoTerminal = this.getSnippetTerminal();
      if (textoTerminal == "\n") {
        Swal.fire({
          title: 'Error:',
          text: 'La terminal no se puede ejecutar vacia.',
          icon: 'error',
          timer: 3500,
          showConfirmButton: true,
        });

        this.terminal.nativeElement.value += ">> "
        return;
      }
      data.code = textoTerminal;

    } else {//en caso de ser IDE y con el boton
      if (this.codeEditor.getValue() == "") {
        Swal.fire({
          title: 'Error:',
          text: 'El editor no se puede agregar vacio.',
          icon: 'error',
          timer: 3500,
          showConfirmButton: true,
        });
        return;
      }
      data.code = this.codeEditor.getValue()
    }
    console.log(data)
    this.spinner.show();
    this.subscription.add(this.dataService.PostAnalysis(data.code).subscribe(
      (res) => {
        let response:any = res

        console.log(response);

        if ( response.code != "200"){//muestra errores en la terminal
          this.terminal.nativeElement.value += "\n>>>> " + response.error;
          this.terminal.nativeElement.value += "\n>> ";

        }else{
          if (isTerminal) {//es la terminal con enter
            this.terminal.nativeElement.value += "\n>>>> " + response.data + "\n>> ";
            this.codeTxt.nativeElement.value += "\n" + response.code + "\n";

          } else {//es el ide con boton
            if (this.terminal.nativeElement.value == ">> ") this.terminal.nativeElement.value += "\n\n>>>> "+ response.data + "\n>> ";
            else this.terminal.nativeElement.value += "\n>>>> " + response.data + "\n>> ";
            this.codeTxt.nativeElement.value +=  this.codeEditor.getValue() + "\n";
            this.codeEditor.setValue('');
            this.codeEditor.focus();
          }
        }
        this.spinner.hide();
        this.terminal.nativeElement.scrollTop = this.terminal.nativeElement.scrollHeight;

      },
      (err: HttpErrorResponse) => {
        console.log(err.error);
        if (err.error instanceof Error) {
          console.log('Error desde el Angular')
        } else {
          console.log('Error desde el Servidor')
          Swal.fire({
            title: 'Error al conectar con el servidor.',
            text: 'Inténte de nuevo más tarde.',
            icon: 'error',
            timer: 4000,
            showConfirmButton: false,
          })
        }
        this.spinner.hide();
      }
    ));
  }
  lastLineInTerminal(){
    this.terminal.nativeElement.selectionEnd = this.terminal.nativeElement.value.length;
  }
  reverse(texto){
    return texto.split("").reverse().join("")
  };
}
