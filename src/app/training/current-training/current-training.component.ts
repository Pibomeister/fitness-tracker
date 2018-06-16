import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { take } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { TrainingService } from './../training.service';
import { StopTrainingComponent } from './stop-training.component';
import * as fromTraining from '../training.reducer';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.scss']
})
export class CurrentTrainingComponent implements OnInit {

  progress = 0;
  timer: number;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService,
    private store: Store<fromTraining.State>
  ) { }

  public ngOnInit(): void {
    this.startOrResumeTimer();
  }

  public startOrResumeTimer(): void {
    this.store.select(fromTraining.getActiveExercise)
        .pipe(take(1))
        .subscribe(ex => {
          const step = ex.duration / 100 * 1000;
          this.timer = window.setInterval(() => {
            this.progress = this.progress + 1;
            if (this.progress >= 100) {
              this.trainingService.completeExercise();
              clearInterval(this.timer);
            }
          }, step);
        });
  }

  public onStop(): void {
    clearInterval(this.timer);
    const dialogRef = this.dialog.open(StopTrainingComponent, {
      data: {
        progress: this.progress
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.trainingService.cancelExercise(this.progress);
      } else {
        this.startOrResumeTimer();
      }
    });
  }

}
