import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { Store } from '@ngrx/store';
import { map, take } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';
import * as fromTraining from './training.reducer';
import * as UI from '../shared/ui.actions';
import * as Training from './training.actions';

@Injectable()
export class TrainingService {
    private fbSubs: Subscription[] = [];

    constructor(
        private db: AngularFirestore,
        private uiService: UIService,
        private store: Store<fromTraining.State>
    ) {}

    fetchAvailableExercises() {
        this.store.dispatch( new UI.StartLoading());
        this.fbSubs.push(
            this.db.collection('availableExercises')
                .snapshotChanges()
                .pipe(
                    map(docArray =>
                        docArray.map(doc => {
                            return {
                                id: doc.payload.doc.id,
                                name: doc.payload.doc.data()['name'],
                                duration: doc.payload.doc.data()['duration'],
                                calories: doc.payload.doc.data()['calories']
                            };
                        })
                    ))
                .subscribe((exercises: Exercise[]) => {
                    this.store.dispatch(new UI.StopLoading());
                    this.store.dispatch(new Training.SetAvailableExercises(exercises));
                }, error => {
                    this.store.dispatch(new UI.StopLoading());
                    this.uiService.showSnackbar(
                        'Fetching exercises failed, please try again later',
                        null, 3000
                    );
                })
        );
    }

    startExercise(selectedId: string) {
        this.store.dispatch(new Training.StartExercise(selectedId));
    }

    completeExercise() {
        this.store.select(fromTraining.getActiveExercise).pipe(
            take(1)
        ).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'completed'
            });
            this.store.dispatch(new Training.StopExercise());
        });
    }

    cancelExercise(progress: number) {
        this.store.select(fromTraining.getActiveExercise).pipe(
            take(1)
        ).subscribe(ex => {
            this.addDataToDatabase({
                ...ex,
                date: new Date(),
                state: 'cancelled'
            });
            this.store.dispatch(new Training.StopExercise());
        });

    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db.collection('finishedExercises')
                .valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    this.store.dispatch(new Training.SetFinishedExercises(exercises));
                }, error => {
                    this.uiService.showSnackbar(
                        'Failed to load completed exercises, please try again later',
                        null, 3000
                    );
                })
        );
    }

    cancelSubscriptions() {
        this.fbSubs.forEach(sub => sub.unsubscribe());
    }

    private addDataToDatabase(exercise: Exercise) {
        this.db.collection('finishedExercises').add(exercise);
    }
}
