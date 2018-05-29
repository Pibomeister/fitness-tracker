import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';

@Component({
selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit {

  @Output() trainingStart = new EventEmitter();
  exercises: Exercise[] = [];

  constructor(private trainingService: TrainingService) { }

  public ngOnInit(): void {
    this.exercises = this.trainingService.getAvailableExercises();
  }

  public onStartTraining(f: NgForm): void {
    this.trainingService.startExercise(f.value.exercise);
  }

}
