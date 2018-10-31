import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { IEvent } from './IEvent';

@Injectable()
export class CoursesFiltered implements IEvent  {
    limCourses: List<Course>;
    krkCourses: List<Course>;

    constructor() {
    }
}