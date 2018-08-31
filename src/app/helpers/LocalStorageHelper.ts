import { Injectable } from '@angular/core';
import { Message } from '../models/Message';
import { Course } from '../models/Course';
import { List } from 'linqts';

@Injectable()
export class LocalStorageHelper{

    getWatchCourse(): Course {
        var courseString = localStorage.getItem("watchCourse");
        if(courseString == "undefined")
            return undefined;
        var course = JSON.parse(courseString);
        return course;
    }
    saveWatchCourse(watchCourse: Course){
        localStorage.removeItem("watchCourse");
        localStorage.setItem("watchCourse",JSON.stringify(watchCourse));
    }

    saveTimetable(timetable:Array<Course>){
        localStorage.removeItem("timetable");
        localStorage.setItem("timetable",JSON.stringify(timetable));
    }

    getTimetable():List<Course>{
        var timetableString = localStorage.getItem("timetable");
        var timetable = JSON.parse(timetableString);
        return timetable;
    }

    saveAppVersion(appVersion:number){
        localStorage.removeItem("appVersion");
        localStorage.setItem("appVersion", appVersion.toString());
    }

    getAppVersion():number{
        var appVersion = localStorage.getItem("appVersion");
        if(!appVersion)
            return 0;
        return Number.parseFloat(appVersion);
        
    }

    getTimetableVersion():number{
        var version = localStorage.getItem("timetableVersion");
        if(!version)
            return 0;
        return Number.parseFloat(version);
    }

    saveTimetableVersion(timetableVersion:number){
        localStorage.removeItem("timetableVersion");
        localStorage.setItem("timetableVersion", timetableVersion.toString());
    }

    getMessage(){
       var messageString =  localStorage.getItem("message");
       var message:Message = JSON.parse(messageString); 
       return message;
    }

    saveMessage(message:Message){
        localStorage.removeItem("message");
        localStorage.setItem("message", JSON.stringify(message));
    }

    getSchoolFreeDay():Array<string>{
        var freeDayString =  localStorage.getItem("freeDay");
        if(!freeDayString)
            return null;
        var freDays = freeDayString.split(";"); 
        return freDays;
     }
 
     saveSchoolFreeDay(from:string, to:string){
         localStorage.removeItem("freeDay");
         localStorage.setItem("freeDay", from + ";" + to);
     }
}