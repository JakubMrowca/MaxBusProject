import { Injectable } from "@angular/core";
import { List } from "linqts";
import { Course } from "../models/Course";

@Injectable()
export class AppState{

    allCourses:List<Course>
    direction:string;
    currentLocation:string;

}