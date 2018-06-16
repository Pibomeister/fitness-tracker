import { Component, OnInit, Output, EventEmitter, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Exercise } from './../exercise.model';
import { TrainingService } from './../training.service';
import { Observable, Subscription } from 'rxjs';
import { UIService } from '../../shared/ui.service';

@Component({
selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.scss']
})
export class NewTrainingComponent implements OnInit, OnDestroy {

  @Output() trainingStart = new EventEmitter();
  exercises: Exercise[] = [];
  isLoading = true;
  subscriptions: Subscription[] = [];

  constructor(private trainingService: TrainingService, private uiService: UIService) { }

  public ngOnInit(): void {
    this.subscriptions.push(this.trainingService.exercisesChanged.subscribe( 
      exercises => this.exercises = exercises
    ));
    this.subscriptions.push(this.uiService.loadingStateChanged.subscribe(
      isLoading => this.isLoading = isLoading
    ));
    this.fetchExercises();
  }

  public ngOnDestroy(): void {
    if(this.subscriptions && this.subscriptions.length > 0){
      this.subscriptions.forEach(
        sub => sub.unsubscribe()
      );
    }
  }

  public onStartTraining(f: NgForm): void {
    this.trainingService.startExercise(f.value.exercise);
  }

  public fetchExercises(): void {
    this.trainingService.fetchAvailableExercises();
  }

}
