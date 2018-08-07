import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { Stop } from '../models/Stop';
import { LocationService } from '../services/LocationService';
import { Subscriber, Subscription } from 'rxjs';
import { TimeEnum, TimeEnumHelper } from '../helpers/TimeEnum';
import { TraficService } from '../services/TraficService';
import * as moment from "moment";
import { CoursesFiltered } from '../events/CoursesFiltered';
import { EventService } from '../services/EventServices';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() direction: string;
  @Input() isStart: boolean;
  @Input() allCourses: List<Course>;

  timetableIsActual = true;
  timePlus: TimeEnum = TimeEnum.near;
  timeMinus: TimeEnum = TimeEnum.veryNear;
  nearCourses: Array<Course>;
  calculatingDuration = false;
  showLessPlus = false;
  showLessMinus = false;
  constTimeEnum = TimeEnum.near;
  @Output() mapShowed = new EventEmitter<Course>();
  @Output() coursSelected = new EventEmitter<Course>();

  constructor(private traffic: TraficService, public locationService: LocationService, private eventService: EventService) {
    this.eventService.getMessage<CoursesFiltered>(CoursesFiltered).subscribe(message => {
      this.setTimetable();
    })
  }

  getNearCourse(courses: List<Course>, timePlus: TimeEnum, timeMinus: TimeEnum): Array<Course> {
    var cours = courses.Where(x => this.timeIsNear(x, timePlus, timeMinus)).ToList();
    return cours.ToArray();
  }

  moreCourse() {
    var nearCoursesCount = this.nearCourses.length;
    var courses;
    if (this.showLessPlus == false) {
      if (this.timePlus == TimeEnum.old) {
        return;
      }
      this.timePlus = TimeEnumHelper.next(this.timePlus);
      courses = this.getNearCourse(this.allCourses, this.timePlus, this.timeMinus);
      if (nearCoursesCount == courses.length) {
        this.moreCourse();
        return;
      }
      this.showLessPlus = true;
    }
    else {
      this.showLessPlus = false;
      this.timePlus = TimeEnum.near;
      courses = this.getNearCourse(this.allCourses, this.timePlus, this.timeMinus);
    }
    this.nearCourses = courses
  }

  setTimetable() {
    this.nearCourses = this.getNearCourse(this.allCourses, this.timePlus, this.timeMinus);
  }

  calculateTraffic(course: Course) {
    var orderedList:Array<Stop>
    course.traficIsCalculate = true;
    var stops = new Array<Stop>();
    if (course.direction.startsWith("Krk")) {
      let firstStopTime = course.firstStop.time;
      firstStopTime.minutes = firstStopTime.minutes + 2;
      stops.push(new Stop("Plac inw.", this.pad(firstStopTime.hours.toString(), 2) + ":" + this.pad(firstStopTime.minutes.toString(),2),{ minutes: firstStopTime.minutes, hours: firstStopTime.hours }));
      firstStopTime.minutes = firstStopTime.minutes + 2;
      stops.push(new Stop("Mateczne", this.pad(firstStopTime.hours.toString(), 2) + ":" + this.pad(firstStopTime.minutes.toString(),2), { minutes: firstStopTime.minutes, hours: firstStopTime.hours }));
      firstStopTime.minutes = firstStopTime.minutes + 2;
      stops.push(new Stop("Bieżanów", this.pad(firstStopTime.hours.toString(), 2) + ":" + this.pad(firstStopTime.minutes.toString(),2), { minutes: firstStopTime.minutes, hours: firstStopTime.hours }));

      let stopsList = new List(course.stops);
      stopsList.AddRange(stops);
      orderedList = stopsList.OrderBy(x => x.timeString).ToArray();
    }
    if (course.direction.startsWith("Lim")) {
      let lastStopTime = course.stops[course.stops.length - 2].time;
      lastStopTime.minutes = lastStopTime.minutes +2;
      stops.push(new Stop("Bieżanów", this.pad(lastStopTime.hours.toString(), 2) + ":" + this.pad(lastStopTime.minutes.toString(),2), { minutes: lastStopTime.minutes, hours: lastStopTime.hours }));
      lastStopTime.minutes = lastStopTime.minutes + 2;
      stops.push(new Stop("Mateczne", this.pad(lastStopTime.hours.toString(), 2) + ":" + this.pad(lastStopTime.minutes.toString(),2), { minutes: lastStopTime.minutes, hours: lastStopTime.hours }));
      lastStopTime.minutes = lastStopTime.minutes + 2;
      stops.push(new Stop("Plac inw.", this.pad(lastStopTime.hours.toString(), 2) + ":" + this.pad(lastStopTime.minutes.toString(),2), { minutes: lastStopTime.minutes, hours: lastStopTime.hours }));

      let stopsList = new List(course.stops);
      stopsList.AddRange(stops);
      orderedList = stopsList.OrderBy(x => x.timeString).ToArray();
    }

    course.stops = orderedList;

    this.traffic.calculateDurrationForStop(course, 0).then(data => {
      for (let i = 0; i < this.nearCourses.length; i++) {
        if (this.nearCourses[i].direction == course.direction && this.nearCourses[i].firstStop.timeString == course.firstStop.timeString)
          this.nearCourses[i] = course;
      }
    });

  }

  isFirstStop(course: Course, stop: Stop) {
    if (course.firstStop.city == stop.city && this.isStart)
      return true;
    return false;
  }

  timeIsNear(cours: Course, timePlus: TimeEnum, timeMinus: TimeEnum): boolean {

    if (this.isStart == true) {
      var stop = this.getStopForLocation(cours.stops);
      if (stop == null)
        return false
      cours.firstStop = stop;
    }

    var now = new Date();
    var nowTo = new Date();
    var nowFrom = new Date();

    nowTo.setMinutes(now.getMinutes() + timePlus)
    nowFrom.setMinutes(now.getMinutes() - timeMinus)
    var coursDate = new Date();
    coursDate.setHours(cours.firstStop.time.hours, cours.firstStop.time.minutes);

    if (coursDate >= nowFrom && coursDate <= nowTo) {
      return true;
    }
    return false;
  }

  getStopForLocation(stops: Array<Stop>): Stop {
    var stop: Stop = null;
    stops.forEach(element => {
      if (element.city == this.locationService.getCurrentLocation())
        stop = element;
    });
    return stop;
  }

  ngOnInit() {
    this.setTimetable();
  }

  calculateTime(stop: Stop) {
    if (stop.time == null)
      return "";
    var now = new Date();
    var stopDate = new Date();
    stopDate.setHours(stop.time.hours);
    stopDate.setMinutes(stop.time.minutes);
    var difference = stopDate.getTime() - now.getTime();
    var resultInMinutes = Math.round(difference / 60000);
    if (resultInMinutes >= 60) {
      var hourResult = Number.parseInt((resultInMinutes / 60).toString());
      var minResult = resultInMinutes % 60;
      return hourResult.toString() + " h " + minResult.toString() + " min"
    } else
      return resultInMinutes.toString() + " min";
  }

  coursesExist() {
    if (this.nearCourses == undefined)
      return false;
    var courseCount = this.nearCourses.length;
    if (courseCount == 0) {
      return false;
    }
    return true;
  }

  showMap(course: Course) {
    this.mapShowed.emit(course);
  }

  go(course:Course){
    this.coursSelected.emit(course);
  }

  pad(num, size) {
    var s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
  }
}
