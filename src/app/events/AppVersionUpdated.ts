import { Observable, Subject } from 'rxjs';
import { Message } from '../models/Message';
import{IEvent} from './IEvent';

export class AppVersionUpdated implements IEvent {
    public appVersion: number;
    public timetableVersion: number;
    public schoolFreeDayFrom:string;
    public schoolFreeDayTo:string;
    public message:Message;

    constructor() {
    }
}