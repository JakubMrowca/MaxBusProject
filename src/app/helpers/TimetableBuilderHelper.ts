import { Stop } from "../models/Stop";
import { Time } from "@angular/common";
import { Course } from "../models/Course";
import { DirectionEnum } from "./DirectionEnum";
import { List } from "linqts";

export class TimetableBuilderHelper {

    static convertTimetableToList(timetable: any): List<Course> {
        var timetableList = new List<Course>();
        if (timetable != undefined && timetable != null) {
            timetable.forEach(coursAny => {
                var cours: Course = coursAny;
                var stops: Array<Stop> = cours.stops;
                timetableList.Add(cours);
            });
        }

        return timetableList;
    }

    static buildTimetableFromJson(timetableJson): List<Course> {
        var courses = new List<Course>();

        timetableJson.forEach(element => {
            if (element.kurs == "Limanowa-Rybie") {
                courses.AddRange(this.createCourses(element.kursy, DirectionEnum.LRK, DirectionEnum.LSK));
            }
            if (element.kurs == "Rybie-Limanowa") {
                courses.AddRange(this.createCourses(element.kursy, DirectionEnum.KRL, DirectionEnum.KSL));
            }
            if (element.kurs == "Krakow-Zegocina") {
                courses.AddRange(this.createCourses(element.kursy, DirectionEnum.KZL));
            }
            if (element.kurs == "Zegocina-Krakow") {
                courses.AddRange(this.createCourses(element.kursy, DirectionEnum.LZK));
            }
        });
        return courses;
    }

    private static createCourses(coursesObject, direction: DirectionEnum, directionOr: DirectionEnum = null): Array<Course> {
        var courses = new Array<Course>();

        coursesObject.forEach(kurs => {
            let cours = new Course();

            if (directionOr == null)
                cours.direction = direction.toString();
            else {
                cours.direction = kurs["Szyk"] == "-" ? direction.toString() : directionOr.toString();
            }
            cours.legends = kurs["legends"];

            var stops = new Array<Stop>();
            for (let name in kurs) {
                if (name != "legends" && kurs[name] != "-") {
                    let stopMinutes = Number.parseInt(kurs[name].substring(3))
                    let stopHours = Number.parseInt(kurs[name].substring(0, 2))

                    let time: Time = { minutes: stopMinutes, hours: stopHours };

                    stops.push(new Stop(name, kurs[name], time));
                }
            }

            cours.stops = stops.sort(this.sortStops);
            cours.firstStop = stops[0];
            courses.push(cours);
        });

        return courses;
    }

    private static sortStops(a: Stop, b: Stop) {
        if (a.time.hours > b.time.hours)
            return 1
        if (a.time.hours == b.time.hours && a.time.minutes > b.time.minutes)
            return 1
        if (a.time.hours == b.time.hours && a.time.minutes == b.time.minutes)
            return 0
        if (a.time.hours < b.time.hours)
            return -1
        if (a.time.hours == b.time.hours && a.time.minutes < b.time.minutes)
            return -1
    }
}