import { Injectable } from "@angular/core";
import { List } from "linqts";
import { Course } from "../models/Course";
import { LocalStorageHelper } from "../helpers/LocalStorageHelper";

@Injectable()
export class AppState{

    constructor(public localDb:LocalStorageHelper){

    }

    directionResponse:any;
    allCourses:List<Course>
    timetable:List<Course>
    internetConnection:boolean;
    direction:string;
    watchCourse:Course;
    currentLocation:string;
    noLocation = false;
    yourCord = {
        lat:0,
        lng:0
    }

    saveWatchCourse(){
        this.localDb.saveWatchCourse(this.watchCourse);
    }

    getWatchCourse(){
        var watchCourse =this.localDb.getWatchCourse();
        this.watchCourse = watchCourse; 
        return watchCourse;
    }
}