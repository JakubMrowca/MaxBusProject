import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class LocationDetected {
    private subject = new Subject<any>();
    public currentLocation: string;

    constructor() {
    }

    sendEvent() {
        this.subject.next(this);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<LocationDetected> {
        return this.subject.asObservable();
    }

}