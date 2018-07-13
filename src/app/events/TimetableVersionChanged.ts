import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class TimetableVersionChanged{
    private subject = new Subject<any>();

    sendEvent() {
        this.subject.next(this);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<TimetableVersionChanged> {
        return this.subject.asObservable();
    }
}