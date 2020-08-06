import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  private array: ArrayStruct[] = [];
  private lastEndOffset = 0;
  private id = 0;
  private lengthToStart = 0;
  constructor() {
    this.initArray();
    window.addEventListener('keydown', (keyEvent: KeyboardEvent) => {
      switch (keyEvent.key) {
        case '1':
          this.selectedHighlight('250,100,100', '1');
          break;
        case '2':
          this.selectedHighlight('250,150,100', '2');
          break;
        case '3':
          this.selectedHighlight('250,200,100', '3');
          break;
        case '4':
          this.selectedHighlight('250,250,100', '4');
          break;
        case '5':
          this.selectedHighlight('200,250,150', '5');
          break;
        case '6':
          this.selectedHighlight('150,250,200', '6');
          break;
        case '7':
          this.selectedHighlight('100,250,250', '7');
          break;
        case '8':
          this.selectedHighlight('150,200,250', '8');
          break;
        case '9':
          this.selectedHighlight('200,150,250', '9');
          break;
        case '0':
          this.selectedHighlight('250,100,200', '10');
          break;
        case 'q':
          this.selectedHighlight('250,100,100', 'Q');
          break;
        case 'w':
          this.selectedHighlight('250,150,100', 'W');
          break;
        case 'e':
          this.selectedHighlight('250,200,100', 'E');
          break;
        case 'r':
          this.selectedHighlight('250,250,100', 'R');
          break;
        case 't':
          this.selectedHighlight('200,250,150', 'T');
          break;
        case 'y':
          this.selectedHighlight('150,250,200', 'Y');
          break;
        case 'z':
          this.selectedHighlight('240,240,240', 'Z');
      }
    });
  }
  title = 'txthghlghtr';

  fileContent = '';

  private initArray() {
    this.array.push(new ArrayStruct('1'));
    this.array.push(new ArrayStruct('2'));
    this.array.push(new ArrayStruct('3'));
    this.array.push(new ArrayStruct('4'));
    this.array.push(new ArrayStruct('5'));
    this.array.push(new ArrayStruct('6'));
    this.array.push(new ArrayStruct('7'));
    this.array.push(new ArrayStruct('8'));
    this.array.push(new ArrayStruct('9'));
    this.array.push(new ArrayStruct('0'));
    this.array.push(new ArrayStruct('Q'));
    this.array.push(new ArrayStruct('W'));
    this.array.push(new ArrayStruct('E'));
    this.array.push(new ArrayStruct('R'));
    this.array.push(new ArrayStruct('T'));
    this.array.push(new ArrayStruct('Y'));
  }


  public onChange(fileList: FileList): void {
    let file = fileList[0];
    let fileReader: FileReader = new FileReader();
    let self = this;
    fileReader.onloadend = function (x) {
      self.fileContent = fileReader.result as string;
    };
    fileReader.readAsText(file);

  }

  selectedHighlight(rgb: string, choice: string) {
    if (window.getSelection) {
      var sel, range: Range, node: Node, range2;
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = window.getSelection().getRangeAt(0);
        if (choice.charCodeAt(0) > 47 && choice.charCodeAt(0) < 58) {  // ascii digits
          var html = '<span id="' + this.id + '" style="color: rgb(' + rgb + ');">' + range + '</span>';
        }
        else if (choice.charCodeAt(0) > 64 && choice.charCodeAt(0) < 90) { // ascii A-Y
          var html = '<span id="' + this.id + '" style="background-color: rgb(' + rgb + '); color: rgb(30,30,30);">' + range + '</span>';
        }
        else if (choice.charCodeAt(0) === 90) { } // ascii Z
        var html = '<span id="' + this.id + '" style="background-color: rgb(30,30,30); color: rgb(' + rgb + ');">' + range + '</span>';
      }
      this.array.forEach(struct => {
        if (struct.key === choice) {
          console.log(range);

          struct.addRanges(range.startOffset + this.lastEndOffset, range.endOffset + this.lastEndOffset);
          this.lastEndOffset = range.endOffset;
        }
      });
      range.deleteContents();
      var el = document.createElement("div");
      el.innerHTML = html;
      var frag = document.createDocumentFragment(),
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.appendChild(node);
       // console.log(lastNode);
      }
      range.insertNode(frag);
      this.getPositionInDocument(this.id);
      this.id++;
    }
  }


  jsonOnClick() {
    const json = JSON.stringify(this.array);
    console.log(json);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "derulo.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }
  // TODODODODDO
  getPositionInDocument(id: number) {
    //console.log(document.getElementById(id.toString()));
    //console.log(document.getElementById(id.toString()).previousSibling);
    this.lengthToStart = 0;
    if (document.getElementById(id.toString()).previousSibling !== null) {
      this.getAllPrevChildrenLength(document.getElementById(id.toString()));
    }
    //console.log(this.lengthToStart);
  }

  getAllPrevChildrenLength(node: Node) {
    //this.lengthToStart += node.nodeValue.length;
    if (node.previousSibling !== null) {
      if(node.previousSibling.nodeName==='SPAN') {
        console.log(node.previousSibling.firstChild.nodeValue.length);        
      }
      else if (node.previousSibling.nodeName==='#text') {
        console.log(node.previousSibling.nodeValue.length);
      }
      
      //console.log('in if');
      this.getAllPrevChildrenLength(node.previousSibling)
    }
  }
}

class ArrayStruct {
  public ranges = '';
  public key: string;

  constructor(key: string) {
    this.key = key;
  }

  addRanges(start: number, end: number) {
    if (this.ranges.length === 0) {
      this.ranges = this.ranges + '[' + start + ',' + end + ']';
    } else {
      this.ranges = this.ranges + ',[' + start + ',' + end + ']';
    }
  }
}
