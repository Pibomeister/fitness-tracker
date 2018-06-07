import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';
import { Observable, Subscription } from 'rxjs';

@Component({
selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  @Output() trainingStart = new EventEmitter();
  exercises: Exercise[] = [];
  exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  public ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChanged.subscribe(
      exercises => this.exercises = exercises
    );
    this.trainingService.fetchAvailableExercises();
  }

  public ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }

  public onStartTraining(f: NgForm): void {
    this.trainingService.startExercise(f.value.exercise);
  }

}
