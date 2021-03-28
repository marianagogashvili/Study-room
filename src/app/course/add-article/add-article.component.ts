import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { faBold } from '@fortawesome/free-solid-svg-icons';
import { faItalic } from '@fortawesome/free-solid-svg-icons';
import { faListUl } from '@fortawesome/free-solid-svg-icons';
import { faListOl } from '@fortawesome/free-solid-svg-icons';
import { faUnderline } from '@fortawesome/free-solid-svg-icons';
import { faRedoAlt } from '@fortawesome/free-solid-svg-icons';
import { faFont } from '@fortawesome/free-solid-svg-icons';
import { faAlignCenter } from '@fortawesome/free-solid-svg-icons';
import { faAlignLeft } from '@fortawesome/free-solid-svg-icons';
import { faAlignRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-add-article',
  templateUrl: './add-article.component.html',
  styleUrls: ['./add-article.component.css']
})
export class AddArticleComponent implements OnInit {
  @ViewChild("container", {static: false}) container: ElementRef;
  @Input() topicId;
  @Input() courseId;

  boldIcon = faBold; italicIcon = faItalic; underIcon = faUnderline;
  ulIcon = faListUl; olIcon = faListOl;
  centerIcon = faAlignCenter; leftIcon = faAlignLeft; rightIcon = faAlignRight;
  sizeIcon = faFont; redoIcon = faRedoAlt;

  article ="bt";
  defaultFontSize = 3;

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
  	document.execCommand(val, false, null);
  }


  resize(val) {
  	if (this.defaultFontSize + val <= 7 && this.defaultFontSize + val >=1) {
  		this.defaultFontSize = this.defaultFontSize + val;
  	}
  	console.log(this.defaultFontSize);
  	document.execCommand('fontSize', false, this.defaultFontSize.toString());
  }

}
