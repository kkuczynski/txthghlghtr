import { Component } from '@angular/core';
import { exit } from 'process';
import { notEqual } from 'assert';

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
  private added = false;
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
    this.array.push(new ArrayStruct('Z'));
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
      var sel, range: Range, node: Node, range2: Range;
      sel = window.getSelection();
      if (sel.getRangeAt && sel.rangeCount) {
        range = window.getSelection().getRangeAt(0);
        range2 = range;
        if (choice.charCodeAt(0) > 47 && choice.charCodeAt(0) < 58) {  // ascii digits
          var html = '</span><span id="' + this.id + '" style="color: rgb(' + rgb + ');">' + range + '</span><span>';
        }
        else if (choice.charCodeAt(0) > 64 && choice.charCodeAt(0) < 90) { // ascii A-Y
          var html = '</span><span id="' + this.id + '" style="background-color: rgb(' + rgb + '); color: rgb(30,30,30);">' + range + '</span><span>';
        }
        else if (choice.charCodeAt(0) === 90) { } // ascii Z
        var html = '</span><span id="' + this.id + '" style="background-color: rgb(30,30,30); color: rgb(' + rgb + ');">' + range + '</span><span>';
      }

      range.deleteContents();
      var el = document.createElement('div');
      el.innerHTML = html;
      console.log(el);
      var frag = document.createDocumentFragment(),
        lastNode;
      while ((node = el.firstChild)) {
        lastNode = frag.append(node);
        
      }
      range.insertNode(frag);

      this.getPositionInDocument(this.id, range);
      this.addSelection(choice);
      this.id++;
      this.added = false;
    }
  }

  addSelection(choice: string) {
    let newEnd = this.lengthToStart + document.getElementById(this.id.toString()).firstChild.nodeValue.length;
    let newStart = this.lengthToStart + 1;
    this.array.forEach(matchStruct => {
      if (matchStruct.key === choice) {
        //console.log(range);          
        this.array.forEach(struct => {
          struct.ranges.forEach(ranges => {
            
              //inserting new selection into existing one
              if (newStart > ranges.start && newEnd < ranges.end) {
                console.log('insert');
                let tmpEnd = ranges.end;
                ranges.end = this.lengthToStart;
                struct.addRanges(newEnd + 1, tmpEnd);
                console.log('old range: ');
                console.log(struct);
                console.log('new range: ');
                console.log(matchStruct);
               
              }
              //new selection cuts the end of other selection
              else if (newStart > ranges.start && newStart < ranges.end && newEnd >= ranges.end) {
                console.log('cut end');
                ranges.end = newStart - 1;
                //matchStruct.addRanges(newStart, newEnd)
                console.log('old range: ');
                console.log(struct);
                console.log('new range: ');
                console.log(matchStruct);
                
              }
              //new selection cuts the beginning of other selection
              else if (newStart <= ranges.start && ranges.start < newEnd && newEnd < ranges.end) {
                console.log('cut begin');
                ranges.start = newEnd + 1;
                //matchStruct.addRanges(newStart, newEnd)
                console.log('old range: ');
                console.log(struct);
                console.log('new range: ');
                console.log(matchStruct);
                
              }
              //new selection overrides old selection in whole
              else if (newStart <= ranges.start && newEnd >= ranges.end) {
                console.log('override');
                ranges.start = -1;
                ranges.end = -1;
                //matchStruct.addRanges(newStart, newEnd);
                console.log('old range: ');
                console.log(struct);
                console.log('new range: ');
                console.log(matchStruct);
                
              }
            
          });
        });
        //no collision with other selections


        matchStruct.addRanges(newStart, newEnd);
        console.log(newStart, newEnd);
      }
      //console.log(matchStruct);
    });
  }

  jsonOnClick() {
    let counter = 0;
    let stringToJson;
    this.array.forEach(struct => {
      if (struct.key != 'Z') {
        if (counter > 0) {
          stringToJson += ',\n'
        }
        stringToJson += struct.getFancyString;
        counter++;
      }
    });
    const json = JSON.stringify(stringToJson);
    //console.log(json);
    var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(json);
    var downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "derulo.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  }

  getPositionInDocument(id: number, range: Range) {
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
      if (node.previousSibling.nodeName === 'SPAN') {           
        console.log('length:' + node.previousSibling.firstChild.nodeValue.length);
        this.lengthToStart += node.previousSibling.firstChild.nodeValue.length;          
      }
      // else if (node.previousSibling.nodeName === '#text') {        
      //   console.log('length:' + node.previousSibling.nodeValue.length);
      //   this.lengthToStart += node.previousSibling.nodeValue.length;
      // }
      this.getAllPrevChildrenLength(node.previousSibling);
    }
  }
}

class ArrayStruct {
  public ranges: Ranges[] = [];
  public key: string;

  constructor(key: string) {
    this.key = key;
    this.addRanges(-1, -1);
  }

  addRanges(start: number, end: number) {
    const newRanges = new Ranges(start, end);
    this.ranges.push(newRanges);
    //console.log(this.ranges);
  }

  getFancyString() {
    let toJson: string = this.key + ':';
    let counter = 0;
    if (this.ranges.length === 0) {
      toJson += '[]'
    }
    else {
      this.ranges.forEach(range => {
        if (range.start > -1) {
          toJson += '[' + range.start + '-' + range.end + ']'
        }
      });
    }
  }
}

class Ranges {
  public start: number;
  public end: number;
  constructor(start: number, end: number) {
    this.start = start;
    this.end = end;
  }
}
