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
  isLoadingView = true; email = ''; isSubmitted = false;
  signaturePadOptions: Object = {
    minWidth: 5,
    dotSize: .5,
    canvasWidth: window.innerWidth/1.65,
    canvasHeight: 300
  }; step = 0;
  keys = {
    left: 37,
    up: 38,
    right: 39,
    down: 40
  };
  container: any;
  gridNodes: Iterable<unknown> | ArrayLike<unknown> | undefined;
  gridArray: unknown[] | undefined;
  imageCanvas: HTMLImageElement | undefined;
  gridItem: any;
  x = 0; y = 0; r = 10; c = 10;
  disabledItems = ['02','22','20','31','32','33','34','41','88','98'];
  constructor() {
  }

  ngAfterViewInit() {
    this.isLoadingView = false;
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
  onSubmit() {
    this.isSubmitted = true;
    this.signaturePad.isEmpty();
    if (this.email && !this.signaturePad.isEmpty()) {
      this.imageCanvas = document.createElement('img');
      this.imageCanvas.src = this.signaturePad.toDataURL();
      this.imageCanvas.style.width = '100%';
      this.imageCanvas.style.height = '100%';
      this.step = 1;
      setTimeout(() => {
        this.container = document.querySelector('.table-body');
        this.gridNodes = document.querySelectorAll(".table-tr");
        this.gridArray = Array.from(this.gridNodes);
        this.makeTable(this.r, this.c);
        window.addEventListener("keydown", (e) => this.handleKey(e));
      }, 200)
    }
  }
  makeTable(rows: number, cols: number) {
    let x = 0;
    for (let r = 0; r < rows; r++) {
      let tr = document.createElement("tr");
      tr.className = 'text-gray-700';
      let y = 0;
      for (let c = 0; c < cols; c++) {
        let td = document.createElement("td")
        // td.innerHTML = '[' + x + '' + y + ']';
        if (x === 0 && y === 0) {
          try {
            // @ts-ignore
            td.appendChild(this.imageCanvas)
            td.style.backgroundColor = '#f6b36e'
          } catch (e) {}
        }
        if (x === this.r - 1 && y === this.c - 1) {
          td.style.backgroundColor = '#62c452';
        }
        if (this.disabledItems.includes(x + '' + y)) {
          td.style.backgroundColor = 'rgb(68,67,67)';
        }
        tr.appendChild(td).className = 'border p-1 dark:border-dark-5 table-tr table-tr-' + x + '' + y;
        y++;
      }
      this.container.appendChild(tr);
      x++;
    }
  }
  handleKey(e: any) {
    try {
      // @ts-ignore
      document.querySelector(".table-tr-" + this.x + '' + this.y).style.backgroundColor = '#FFFFFFFF';
    } catch (e) {}
    switch (e.keyCode) {
      case this.keys.left:
        if (this.y > 0) {
          this.disabledItems.push(this.x+''+this.y);
          this.y--;
        }
        break;
      case this.keys.up:
        if (this.x > 0) {
          this.disabledItems.push(this.x+''+this.y);
          this.x--;
        }
        break;
      case this.keys.right:
        if (this.y < this.c - 1) {
          this.y++;
        }
        break;

      case this.keys.down:
        if (this.x < this.r -1) {
          this.x++;
        }
        break;
    }
    console.log('disabledItems', this.disabledItems);
    this.gridItem = document.querySelector(".table-tr-" + this.x + '' + this.y);
    this.gridItem.style.backgroundColor = '#f6b36e'
    this.gridItem.appendChild(this.imageCanvas);
    if (this.x === this.r - 1 && this.y === this.c - 1) {
      alert('Destination reached!');
    }
  }
  onNextItem() {
    let moveDown = '';
    let moveRight = '';
    let moveUp = '';
    let moveLeft = '';
    if (this.x < this.r -1) {
      moveDown = (this.x + 1) + '' + this.y;
    }
    if (this.y < this.c - 1) {
      moveRight = this.x + '' + (this.y + 1);
    }
    if (this.x > 0) {
      moveUp = (this.x - 1) + '' + this.y;
    }
    if (this.y > 0) {
      moveLeft = this.x + '' + (this.y - 1);
    }
    if (!this.disabledItems.includes(moveDown) && moveDown) {
      this.handleKey({keyCode: this.keys.down})
    } else if (!this.disabledItems.includes(moveRight) && moveRight) {
      this.handleKey({keyCode: this.keys.right})
    } else if (!this.disabledItems.includes(moveUp) && moveUp) {
      this.handleKey({keyCode: this.keys.up})
    } else if (!this.disabledItems.includes(moveLeft) && moveLeft) {
      this.handleKey({keyCode: this.keys.left})
    }
  }
}
