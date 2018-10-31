import { Course } from "../models/Course";
import { List } from 'linqts';
import { Subject, Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { IEvent } from "./IEvent";

@Injectable()
export class TimetableUpdated implements IEvent{
    public timetable:List<Course>;
}