import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  @ViewChild("container", {static: false}) container: ElementRef;
  @Input() topicId;
  @Input() courseId;

  article ="bt";
  constructor() { }

  ngOnInit() {
  }

  add(val) {
  	const div = document.querySelector('.article');
  	const ul = document.createElement(val); // ul or ol
  	var li = document.createElement('li');
  	ul.appendChild(li);

  	this.container.nativeElement.appendChild(ul);
  }

  change(val) {
  	// if (window.getSelection) {
   //      var sel = window.getSelection();
   //      if (sel.rangeCount) {
   //          var range = sel.getRangeAt(0).cloneRange();
   //          range.surroundContents(val);
   //          sel.removeAllRanges();
   //          sel.addRange(range);
   //      }
   //  }
  	const div = document.querySelector('.article');

  	let selection= window.getSelection().getRangeAt(0);
    let selectedText = selection.extractContents();
    console.log(selectedText);
    
    var bold = document.createElement(val);
    var div2 = document.createElement('p');
    bold.appendChild(selectedText);
    selection.insertNode(bold);
    selection.insertNode(div2);
    this.container.nativeElement.appendChild(div2);
    selection.setStartAfter(bold);
    selection.collapse(true);
	window.getSelection().removeAllRanges();
	window.getSelection().addRange(selection);

	document.getElementById("article").focus();
  }  	

    // const ul = document.createElement('ul');
  	// var li = document.createElement('li');
  	// ul.appendChild(li);
  	// const ul = document.createElement('b');
  	// var li = document.createElement('li');
  	// ul.appendChild(li);
  	// this.container.nativeElement.appendChild(ul);
}
