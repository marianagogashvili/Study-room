import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-add-folder',
  templateUrl: './add-folder.component.html',
  styleUrls: ['./add-folder.component.css']
})
export class AddFolderComponent implements OnInit {
  @Input() topicId;
  @Input() courseId;

  constructor() { }

  ngOnInit() {
  }

  saveFile(event) {
  	let files: FileList = event.target.files;
  	console.log(files);
  }

  save() {

  }

}
