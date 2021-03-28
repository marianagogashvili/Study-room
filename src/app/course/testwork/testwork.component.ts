import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router,NavigationStart, NavigationEnd, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';

import { TestService } from '../test.service';
import { filter, map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';


@Component({
  selector: 'app-testwork',
  templateUrl: './testwork.component.html',
  styleUrls: ['./testwork.component.css']
})
export class TestworkComponent implements OnInit, OnDestroy {
  testwork;
  studentAnswer = null;
  available;

  timeRestriction;
  loading;

  workMode = false;
  currentQuestionId;

  answerForm: FormGroup;
  answersForm: FormGroup;

  subscription;

  answers = []; // {question_id: , answer: 'b'}
  timerVal = '';
  timer;

  answer;

  //delete
  a_answ = false; b_answ = false; c_answ = false; d_answ = false; e_answ = false; f_answ = false;

  secondsLeft;
  currentDate = new Date(new Date().setHours(new Date().getHours() + 2));

  sub: Subscription;
  constructor(private testworkService: TestService,
  			  private route: ActivatedRoute,
  			  private cookieService: CookieService,
  			  private router: Router) { }

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
  	if (this.workMode === true) {
  		if (this.answerForm.value.answer.trim() !== '') {
	      	this.answers[this.currentQuestionId] = this.answerForm.value.answer;
	    }  
      if (this.answersForm.value) {
          this.answers[this.currentQuestionId] = this.answersForm.value;        
      }
	    this.cookieService.set('Answers', JSON.stringify(this.answers));
  		this.cookieService.set('Secs', JSON.stringify(this.secondsLeft));
  		clearInterval(this.timer);
  	}
  }

  ngOnInit() {
  	let cookieAnswers = this.cookieService.get('Answers');
  	let cookieSeconds = this.cookieService.get('Secs');

  	if (cookieAnswers || cookieSeconds) {
  		this.workMode = true;
  		this.answers = JSON.parse(cookieAnswers);
  		this.timer = this.startTimer(cookieSeconds);
  	}	

  	this.sub = this.router.events.subscribe((val) => {
      if(this.workMode && (val instanceof NavigationEnd))  {
        if (this.answerForm.value.answer.trim() !== '') {
          this.answers[this.currentQuestionId] = this.answerForm.value.answer;
      }  
      	this.saveTest();
      }
    });

  	this.answerForm = new FormGroup({
  		'answer': new FormControl('', Validators.required)
  	});

    this.answersForm = new FormGroup({
      'a': new FormControl(false, Validators.required),
      'b': new FormControl(false, Validators.required),
      'c': new FormControl(false, Validators.required),
      'd': new FormControl(false, Validators.required),
      'e': new FormControl(false, Validators.required),
      'f': new FormControl(false, Validators.required)
    });

  	this.loading = true;

  	this.route.queryParams.pipe(map(params => {
      let testId = params['testId'];
      if (!testId) {
        this.router.navigate(['../'], {relativeTo: this.route});
      }
  		return testId;
  	}), mergeMap((id):any => {
  		return this.testworkService.getTestwork({testId: id})
  	}), mergeMap((testwork):any => {
  	this.testwork = testwork;
  	this.available = (this.currentDate < new Date(this.testwork.deadline));

  	console.log(this.testwork);

  	this.currentQuestionId = 0;
  	this.timeRestriction = (Math.floor(this.testwork.timeRestriction / 3600) > 0 ? Math.floor(this.testwork.timeRestriction / 3600) + " hrs " : '') + 
  						   (Math.floor(this.testwork.timeRestriction % 3600 / 60) > 0 ? Math.floor(this.testwork.timeRestriction % 3600 / 60) + " min(s) " : '') +
  						   (Math.floor(this.testwork.timeRestriction % 60) > 0 ? Math.floor(this.testwork.timeRestriction % 60) + " secs " : '');
  	
  	return this.testworkService.getAnswers({testId: this.testwork._id})
  	})).subscribe((answer: {answers: [{question}]}) => {
  		
  		this.studentAnswer = answer;
  	  console.log(this.studentAnswer);
  		this.loading = false;
  	});

  }

  startTheTest() {
    this.workMode = true;
    if (this.testwork.timeRestriction) {
      let seconds = this.testwork.timeRestriction;
      this.timerVal = (Math.floor(seconds / 3600) > 0 ? Math.floor(seconds / 3600)+ " hrs " : '') + (Math.floor(seconds % 3600 / 60) > 0 ? Math.floor(seconds % 3600 / 60)+ " mins " : '') + (seconds % 60 > 0 ? seconds % 60 + " secs " : '');

      this.timer = this.startTimer(seconds);
    }
    
  }

  startTimer(seconds) {
    var timer = setInterval(() => {
    this.timerVal = 
    (Math.floor(seconds / 3600) > 0 ? Math.floor(seconds / 3600)+ " hrs " : '') + 
    (Math.floor(seconds % 3600 / 60) > 0 ? Math.floor(seconds % 3600 / 60)+ " mins " : '') + 
    (seconds % 60 > 0 ? seconds % 60 + " secs " : '');

    seconds--;
    this.secondsLeft = seconds;
    if (seconds < 0) {
      clearInterval(timer);
      this.saveTest();
    }

    // console.log(Math.floor(seconds / 3600) + " hrs " + Math.round(seconds % 3600 / 60) + ":" + seconds % 60);
  }, 1000);
  return timer;
  }

  saveTest() {
    let finalAnswers = [];
    this.testwork.questions.forEach((question, i) => {
      finalAnswers.push({question: question._id, answer: this.answers[i] || ''});
    });

    this.testworkService.saveAnswers({answers: JSON.stringify(finalAnswers), testId: this.testwork._id}).subscribe(result => {
      clearInterval(this.timer);
      this.cookieService.delete('Answers');
      this.cookieService.delete('Secs');

      this.testworkService.getAnswers({testId: this.testwork._id})
      .subscribe((answer: {answers: [{question}]}) => {
        this.studentAnswer = answer;
        this.workMode = false;
        this.answers = [];
      });
    });
  }

  addAnswer(answer) {
  // addAnswer() {
    // this.answer = answer;
  	this.answers[this.currentQuestionId] = answer;
    // this.currentQuestionId += 1;
    // this.answer = '';

    console.log(this.answers);
    console.log(this.answerForm.value);
    console.log(this.answersForm.value);

  }

  // addAnswers(answer) {
  addAnswers() {
    console.log("Here" , this.answersForm.value);
    let allFalse = true;
    for (const key in this.answersForm.value) {
      if (this.answersForm.value[key] === true) {
        allFalse = false;
      }
    }
    if (allFalse === false) {
      this.answers[this.currentQuestionId] = this.answersForm.value;
    }
    this.currentQuestionId += 1;
    
    // this.answersForm.reset();
    this.answersForm.patchValue({'a': false, 'b': false, 'c': false, 'd': false, 'e': false, 'f': false });
 
    console.log(this.answers);
    console.log(this.answerForm.value);
    console.log(this.answersForm.value);

  }

  saveAnswer() {
    console.log(this.answerForm.value);
  	this.answers[this.currentQuestionId] = this.answerForm.value.answer;
  	this.currentQuestionId += 1;
  	this.answerForm.patchValue({'answer': this.answers[this.currentQuestionId] || ''});

    this.answerForm.reset();
  	console.log(this.answers);
    console.log(this.answerForm.value);
    console.log(this.answersForm.value);

  }

  

  goToQuestion(i) {
    console.log(this.answerForm.value);
    console.log(this.answersForm.value);

    if (this.answerForm.value.answer !== '') {
      this.answers[this.currentQuestionId] = this.answerForm.value.answer;
      this.answerForm.reset();
    }
    // if(this.answersForm.value) {
      let allFalse = true;
      for (const key in this.answersForm.value) {
        if (this.answersForm.value[key] === true) {
          allFalse = false;
        }
      }
      console.log(allFalse);
      if (!allFalse) {
        this.answers[this.currentQuestionId] = this.answersForm.value;
        // this.answersForm.patchValue({'a': false, 'b': false, 'c': false, 'd': false, 'e': false, 'f': false });
      }
    // }
    // if (this.answer !== '') {
    //   this.answers[this.currentQuestionId] = this.answer;
    // }

  	this.currentQuestionId = i;
  	// this.answerForm.patchValue({'answer': this.answers[i]});
  }

  ngOnDestroy() {
  	if (this.sub && !this.workMode) {
  		this.sub.unsubscribe();
  	}
  }

}
