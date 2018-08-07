import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { EVENTS } from '../app.constants'

export class EventSet<T>{
    constructor(public subject: Subject<T>, public evenType: string) { }
}

@Injectable()
export class EventService {
    events = new Array<EventSet<any>>();

    constructor() {
        this.subscribeEvents(EVENTS);
    }

    subscribeEvents(events: Array<Function>){
        events.forEach(event => {
            this.events.push(new EventSet(new Subject<any>(), event.name));
        });
    }

    sendEvent<T>(x: Function, message: T) {
        var type = x.name;
        var nextEvent: Subject<T>;
        this.events.forEach(event => {
            if (event.evenType == type)
                nextEvent = event.subject
        });
        nextEvent.next(message);
    }

    getMessage<T>(x: Function): Observable<T> {
        var subscribeEvent: Subject<T>;
        var type = x.name;
        this.events.forEach(event => {
            if (event.evenType == type) {
                subscribeEvent = event.subject;
            }
        });
        return subscribeEvent.asObservable();
    }

    clearMessage<T>(x: Function) {
        var type = x.name;
        var nextEvent: Subject<T>;
        this.events.forEach(event => {
            if (event.evenType == type)
                nextEvent = event.subject
        });
        nextEvent.next();
    }
}