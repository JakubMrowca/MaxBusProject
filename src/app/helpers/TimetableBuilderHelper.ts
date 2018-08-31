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
            this.additinalStops(cours);
            courses.push(cours);
        });

        return courses;
    }

    private static additinalStops(course:Course){
        var orderedList: Array<Stop>
        var stops = new Array<Stop>();
        
      

        if (course.direction.startsWith("Krk")) {
            let dateNow = new Date();
            dateNow.setHours(course.firstStop.time.hours);
            dateNow.setMinutes(course.firstStop.time.minutes);
            dateNow.setMinutes(dateNow.getMinutes() + 7);
            stops.push(new Stop("Plac inw.", this.pad(dateNow.getHours().toString(), 2) + ":" + this.pad(dateNow.getMinutes().toString(), 2), { minutes: dateNow.getMinutes(), hours: dateNow.getHours() }));
            dateNow.setMinutes(dateNow.getMinutes() + 6);
            stops.push(new Stop("Mateczne", this.pad(dateNow.getHours().toString(), 2) + ":" + this.pad(dateNow.getMinutes().toString(), 2), { minutes: dateNow.getMinutes(), hours: dateNow.getHours() }));
            dateNow.setMinutes(dateNow.getMinutes() + 3);
            stops.push(new Stop("Bonarka", this.pad(dateNow.getHours().toString(), 2) + ":" + this.pad(dateNow.getMinutes().toString(), 2), { minutes: dateNow.getMinutes(), hours: dateNow.getHours() }));
            dateNow.setMinutes(dateNow.getMinutes() + 6);
            stops.push(new Stop("Bieżanów", this.pad(dateNow.getHours().toString(), 2) + ":" + this.pad(dateNow.getMinutes().toString(), 2), { minutes: dateNow.getMinutes(), hours: dateNow.getHours() }));
    
            let stopsList = new List(course.stops);
            stopsList.AddRange(stops);
            orderedList = stopsList.OrderBy(x => x.timeString).ToArray();
          }
          if (course.direction.startsWith("Lim")) {
            let dateLast = new Date();
            dateLast.setMinutes(course.stops[course.stops.length - 2].time.minutes)
            dateLast.setHours(course.stops[course.stops.length - 2].time.hours)

            dateLast.setMinutes(dateLast.getMinutes() + 8);
            stops.push(new Stop("Bieżanów", this.pad(dateLast.getHours().toString(), 2) + ":" + this.pad(dateLast.getMinutes().toString(), 2), { minutes: dateLast.getMinutes(), hours: dateLast.getHours() }));
            dateLast.setMinutes(dateLast.getMinutes() + 5);
            stops.push(new Stop("Bonarka", this.pad(dateLast.getHours().toString(), 2) + ":" + this.pad(dateLast.getMinutes().toString(), 2), { minutes: dateLast.getMinutes(), hours: dateLast.getHours() }));
            dateLast.setMinutes(dateLast.getMinutes() + 3);
            stops.push(new Stop("Mateczne", this.pad(dateLast.getHours().toString(), 2) + ":" + this.pad(dateLast.getMinutes().toString(), 2), { minutes: dateLast.getMinutes(), hours: dateLast.getHours() }));
            dateLast.setMinutes(dateLast.getMinutes() + 6);
            stops.push(new Stop("Plac inw.", this.pad(dateLast.getHours().toString(), 2) + ":" + this.pad(dateLast.getMinutes().toString(), 2), { minutes: dateLast.getMinutes(), hours: dateLast.getHours() }));
    
            let stopsList = new List(course.stops);
            stopsList.AddRange(stops);
            orderedList = stopsList.OrderBy(x => x.timeString).ToArray();
          }
    
          course.stops = orderedList;
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

    
  private static pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }
}