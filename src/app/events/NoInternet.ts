import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';

@Injectable()
export class NoInternet {
    private subject = new Subject<any>();

    constructor() {
    }

    sendEvent() {
        this.subject.next(this);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<NoInternet> {
        return this.subject.asObservable();
    }

}