import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { Message } from '../models/Message';

@Injectable()
export class AppVersionUpdated {
    private subject = new Subject<any>();
    public appVersion: number;
    public timetableVersion: number;
    public schoolFreeDayFrom:string;
    public schoolFreeDayTo:string;
    public message:Message;

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