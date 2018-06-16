import { Injectable } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { AngularFirestore } from 'angularfire2/firestore';
import { map } from 'rxjs/operators';

import { Exercise } from './exercise.model';
import { UIService } from '../shared/ui.service';

@Injectable()
export class TrainingService {

    constructor(private db: AngularFirestore, private uiService: UIService) { }

    exerciseChanged = new Subject<Exercise>();
    exercisesChanged = new Subject<Exercise[]>();
    finishedExercisesChanged = new Subject<Exercise[]>();

    private availableExercises: Exercise[] = [];
    private runningExercise: Exercise;
    private fbSubs: Subscription[] = [];


    fetchAvailableExercises() {
        this.uiService.loadingStateChanged.next(true);
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
                    this.uiService.loadingStateChanged.next(false);
                    this.availableExercises = exercises;
                    this.exercisesChanged.next([...this.availableExercises]);
                }, error => {
                    this.uiService.loadingStateChanged.next(false);
                    this.uiService.showSnackbar(
                        'Fetching exercises failed, please try again later',
                        null, 3000
                    );
                    this.exercisesChanged.next(null);
                })
        );
    }

    startExercise(selectedId: string) {
        this.runningExercise = this.availableExercises.find(ex => ex.id === selectedId);
        this.exerciseChanged.next({ ...this.runningExercise });
    }

    completeExercise() {
        this.addDataToDatabase({
            ...this.runningExercise,
            date: new Date(),
            state: 'completed'
        });
        this.runningExercise = undefined;
        this.exerciseChanged.next(undefined);
    }

    cancelExercise(progress: number) {
        this.addDataToDatabase({
            ...this.runningExercise,
            duration: this.runningExercise.duration * (progress / 100),
            calories: this.runningExercise.calories * (progress / 100),
            date: new Date(),
            state: 'cancelled'
        });
        this.runningExercise = undefined;
        this.exerciseChanged.next(undefined);

    }

    getRunningExercise() {
        return { ...this.runningExercise };
    }

    fetchCompletedOrCancelledExercises() {
        this.fbSubs.push(
            this.db.collection('finishedExercises')
                .valueChanges()
                .subscribe((exercises: Exercise[]) => {
                    this.finishedExercisesChanged.next(exercises);
                }, error => {
                    this.uiService.loadingStateChanged.next(false);
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
