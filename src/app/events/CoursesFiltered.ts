import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';

@Injectable()
export class CoursesFiltered {
    private subject = new Subject<any>();
    limCourses: List<Course>;
    krkCourses: List<Course>;

    constructor() {
    }

    sendEvent() {
        this.subject.next(this);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<CoursesFiltered> {
        return this.subject.asObservable();
    }

}