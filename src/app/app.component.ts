import {Component, ViewChild} from '@angular/core';
import {SignaturePad} from "angular2-signaturepad";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  // @ts-ignore
  @ViewChild(SignaturePad) signaturePad: SignaturePad;
  email = ''; isSubmitted = false;
  signaturePadOptions: Object = {
    minWidth: 5,
    dotSize: .5,
    canvasWidth: window.innerWidth/2 - 48,
    canvasHeight: 300
  }; step = 0;
  rows = [0,1,2,3,4,5,6,7,8,9];
  cols = [0,1,2,3,4,5,6,7,8,9];
  keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  container: any;
  gridNodes: Iterable<unknown> | ArrayLike<unknown> | undefined;
  gridArray: unknown[] | undefined;
  imageCanv: string | undefined;
  circle: HTMLDivElement | undefined;
  position = {x: 0, y: 0};
  firstGridItem: any; gridItem: any;
  constructor() {
  }
  makeTable(rows: number, cols: number) {
    let x = 0;
    for (let r = 0; r < rows; r++) {
      let tr = document.createElement("tr");
      tr.className = 'text-gray-700';
      let y = 0;
      for (let c = 0; c < cols; c++) {
        let td = document.createElement("td")
        td.innerHTML = '[' + x + '' + y + ']';
        tr.appendChild(td).className = 'border p-4 dark:border-dark-5 table_tr table_tr_' + x + '' + y;
        y++;
      }
      this.container.appendChild(tr);
      x++;
    }
  }
  makeGrid(rows: number, cols: number) {
    this.container.style.setProperty("--grid-rows", rows);
    this.container.style.setProperty("--grid-cols", cols);
    let x = 0;
    let y = 0;
    for (let c = 0; c < rows * cols; c++) {
      let cell = document.createElement("div");
      y = c%cols;
      if (y === (rows - 1)) {
        x++;
      }
      this.container.appendChild(cell).className = "grid-item grid-item-" + x + '' + y;
    }
  }
  moveRight(e: any) {
    console.log(this.gridArray);
  }
  handleKey(e: any) {
    switch (e.keyCode) {
      case this.keys.left:
        this.position.y--;
        break;
      case this.keys.up:
        this.position.x--;
        break;

      case this.keys.right:
        this.position.y++;
        break;

      case this.keys.down:
        this.position.x++;
        break;
    }
    this.gridItem = document.querySelector(".grid-item-" + this.position.x + '' + this.position.y);
    this.gridItem.appendChild(this.circle);
  }
  ngAfterViewInit() {
    this.signaturePad.set('minWidth', 5);
    this.signaturePad.clear();
  }
  onUndo() {
    const data = this.signaturePad.toData();
    if (data) {
      data.pop();
      this.signaturePad.fromData(data);
    }
  }
  onNext() {
    this.isSubmitted = true;
    this.signaturePad.isEmpty();
    if (this.email && !this.signaturePad.isEmpty()) {
      this.step = 1;

      setTimeout(() => {
        this.container = document.querySelector('.table-body');
        this.gridNodes = document.querySelectorAll(".table-tr");
        this.gridArray = Array.from(this.gridNodes);
        this.makeTable(10, 10);
        this.imageCanv = document.createElement('img').src = '';



        this.circle = document.createElement("div");
        this.circle.style.width = "20px";
        this.circle.style.height = "20px";
        this.circle.style.backgroundColor = "#000";
        this.firstGridItem = document.querySelector(".grid-item");
        console.log('sdsds', this.firstGridItem)
        this.firstGridItem.appendChild(this.circle);
        window.addEventListener("keydown", (e) => this.handleKey(e));
      }, 100)
    }
  }
}
