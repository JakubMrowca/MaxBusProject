import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class AppVersionUpdated {
    private subject = new Subject<any>();
    public appVersion: number;
    public timetableVersion: number;
    public schoolFreeDayFrom:string;
    public schoolFreeDayTo:string;

    constructor() {
    }

    sendEvent() {
        this.subject.next(this);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<AppVersionUpdated> {
        return this.subject.asObservable();
    }

}