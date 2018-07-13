import { Course } from "../models/Course";
import { List } from 'linqts';
import { Subject, Observable } from "rxjs";
import { Injectable } from "@angular/core";

@Injectable()
export class TimetableUpdated{
    private subject = new Subject<any>();
    public timetable:List<Course>;

    constructor(){

    }

    sendEvent() {
        this.subject.next(this);
    }

    clearMessage() {
        this.subject.next();
    }

    getMessage(): Observable<TimetableUpdated> {
        return this.subject.asObservable();
    }
}