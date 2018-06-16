import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.scss']
})
export class TrainingComponent implements OnInit, OnDestroy {

  public ongoingTraining = false;
  private exerciseSubscription: Subscription;

  constructor(private trainingService: TrainingService) { }

  public ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exerciseChanged
    .subscribe(exercise => this.ongoingTraining = !!exercise);
  }

  public ngOnDestroy(): void {
    if(this.exerciseSubscription) {
      this.exerciseSubscription.unsubscribe();
    }
  }

}
