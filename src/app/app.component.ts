import {Component, ViewChild} from '@angular/core';
import {SignaturePad} from "angular2-signaturepad";
import * as $ from 'jquery';

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
    dotSize: .25,
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
  disabledItems = ['50', '23','27','35','46','55','51','53','67','87','89','98'];
  canMove = true;
  constructor() {
  }

  ngAfterViewInit() {
    this.isLoadingView = false;
    try {
      this.signaturePad.queryPad()._canvas.width = $('.signature_pad').width();
      this.signaturePad.clear();
    } catch (e) {}
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
      this.imageCanvas.style.backgroundColor = '#f6b36e';
      this.imageCanvas.id = 'img_canvas';
      this.step = 1;
      setTimeout(() => {
        this.container = document.querySelector('.table-body');
        this.gridNodes = document.querySelectorAll(".table-tr");
        this.gridArray = Array.from(this.gridNodes);
        this.makeTable();
        try {
          const tr = $('.table-tr');
          // @ts-ignore
          this.imageCanvas.style.width = tr.width() + 'px';
          // @ts-ignore
          this.imageCanvas.style.height = tr.height() + 'px';
        } catch (e) {}
        // window.addEventListener("keydown", (e) => this.handleKey(e));
      }, 200)
    }
  }
  makeTable() {
    let x = 0;
    for (let r = 0; r < this.r; r++) {
      let tr = document.createElement("tr");
      tr.className = 'text-gray-700';
      let y = 0;
      for (let c = 0; c < this.c; c++) {
        let td = document.createElement("td")
        if (x === 0 && y === 0) {
          try {
            // @ts-ignore
            td.appendChild(this.imageCanvas)
            // td.style.backgroundColor = '#f6b36e'
          } catch (e) {}
        }
        if (x === this.r - 1 && y === this.c - 1) {
          td.style.backgroundColor = '#62c452';
        }
        if (this.disabledItems.includes(x + '' + y)) {
          td.style.backgroundColor = 'rgb(68,67,67)';
        }
        td.id = 'table-tr-' + x + '' + y;
        tr.appendChild(td).className = 'border p-1 dark:border-dark-5 table-tr table-tr-' + x + '' + y;
        y++;
      }
      this.container.appendChild(tr);
      x++;
    }
  }
  handleKey(e: any) {
    let canMove = false;
    switch (e.keyCode) {
      case this.keys.left:
        if (this.y > 0) {
          this.disabledItems.push(this.x+''+this.y);
          this.y--;
          canMove = true;
        }
        break;
      case this.keys.up:
        if (this.x > 0) {
          this.disabledItems.push(this.x+''+this.y);
          this.x--;
          canMove = true;
        }
        break;
      case this.keys.right:
        if (this.y < this.c - 1) {
          this.y++;
          canMove = true;
        }
        break;
      case this.keys.down:
        if (this.x < this.r -1) {
          this.x++;
          canMove = true;
        }
        break;
    }
    if (!canMove) {
      this.canMove = false;
      console.log('Out of moves!!!');
    }
    this.moveAnimate();
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
    } else {
      this.canMove = false;
      console.log('Out of moves0!!!');
    }
  }
  moveAnimate(){
    let newParent: any = "#table-tr-" + this.x + '' + this.y;
    let imgElement: string | JQuery<any> = $('#img_canvas');
    newParent = $(newParent);
    const oldOffset: any = imgElement.offset();
    imgElement.appendTo(newParent);
    const newOffset: any = imgElement.offset();

    const temp = imgElement.clone().appendTo('body');
    temp.css('position', 'absolute')
      .css('left', oldOffset.left)
      .css('top', oldOffset.top)
      .css('zIndex', 1000);
    imgElement.hide();
    temp.animate( {'top': newOffset.top, 'left': newOffset.left}, 250, function(){
      if (typeof imgElement !== "string") {
        imgElement.show();
      }
      temp.remove();
    });
  }
  autoRun() {
    const intr = setInterval(() => {
      this.onNextItem();
      if (!this.canMove) clearInterval(intr);
    }, 500);
  }
  hideAlert() {
    $('.alert_div').hide();
  }
}
