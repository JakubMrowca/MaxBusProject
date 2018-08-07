import { Injectable } from "@angular/core";
import { List } from "linqts";
import { Course } from "../models/Course";

@Injectable()
export class BusLocationServices {

    allCourses:List<Course>
    timetable:List<Course>
    direction:string;
    currentLocation:string;
    yourCord = {
        lat:0,
        lng:0
    }
}