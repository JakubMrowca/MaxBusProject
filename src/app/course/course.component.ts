import { Component, OnInit, Input, Output, EventEmitter, SimpleChange, OnChanges, SimpleChanges } from '@angular/core';
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
import { ProgressUpdated } from '../events/ProgressUpdated';
import { LocationChanged } from '../events/LocationChanged';
import { MatSnackBar, MatDatepickerToggle } from '@angular/material';
declare let navigator: any;
@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit, OnChanges {
  // @Input() direction: string;
  @Input() firstStop: string;
  @Input() allCourses: List<Course>;
  @Input() date:Date;

  timetableIsActual = true;
  timePlus: TimeEnum = TimeEnum.old;
  timeMinus: TimeEnum = TimeEnum.veryNear;
  nearCourses: Array<Course>;
  calculatingDuration = false;
 
  progressWidth = 0;
  @Output() mapShowed = new EventEmitter<Course>();
  @Output() coursSelected = new EventEmitter<Course>();

  constructor(private traffic: TraficService, public matSnackBar: MatSnackBar, public locationService: LocationService, private eventService: EventService) {
    this.eventService.getMessage<CoursesFiltered>(CoursesFiltered).subscribe(message => {
      this.setTimetable();
    });
    this.eventService.getMessage<ProgressUpdated>(ProgressUpdated).subscribe(message => {
      this.progressWidth = message.progress;
    });
    this.eventService.getMessage<LocationChanged>(LocationChanged).subscribe(message => {
      this.setTimetable();
    });
  }

  getNearCourse(courses: List<Course>, timePlus: TimeEnum, timeMinus: TimeEnum): Array<Course> {
    var cours = courses.Where(x => this.timeIsNear(x, timePlus, timeMinus)).ToList();
    return cours.ToArray();
  }

  ngOnChanges(changes: SimpleChanges) {
    if ('allCourses' in changes) {
      this.setTimetable();
    }
    if('firstStop' in changes){
      this.setTimetable();
    }
    if('date' in changes){
      if(typeof changes.date.currentValue.getMonth === 'function'){
      }else{
        var date = new Date();
        var split =changes.date.currentValue.split(':');
        date.setHours(Number.parseInt(split[0].trim()));
        date.setMinutes(Number.parseInt(split[1].trim()));
        this.date = date;
      }
      this.setTimetable();
    }
  }
  setTimetable() {
    this.nearCourses = this.getNearCourse(this.allCourses, this.timePlus, this.timeMinus);
  }

  // calculateTraffic(course: Course) {
  //   var connection = navigator.connection.type;
  //   console.log(connection);
  //   if (connection == "none") {
  //     this.matSnackBar.open("Brak połączenia z siecią!", "", {
  //       duration: 2000,
  //     });
  //     return;
  //   }
  //   course.traficIsCalculate = true;
  //   this.progressWidth = 1;
  //   this.traffic.calculateDurrationForStop(course, 0).then(data => {
  //     for (let i = 0; i < this.nearCourses.length; i++) {
  //       if (this.nearCourses[i].direction == course.direction && this.nearCourses[i].firstStop.timeString == course.firstStop.timeString)
  //         this.nearCourses[i] = course;
  //     }
  //   }, error => {
  //     course.traficIsCalculate = false;
  //     this.progressWidth = 0;
  //   });
  // }

  isFirstStop(course: Course, stop: Stop) {
    if (course.firstStop.city == stop.city)
      return true;
    return false;
  }

  timeIsNear(cours: Course, timePlus: TimeEnum, timeMinus: TimeEnum): boolean {
    var stop = this.getStopForLocation(cours.stops);
    if (stop == null)
        return false
    cours.courseFirstStop = stop;

    var now = this.date;
    var nowTo = new Date();
    var nowFrom = new Date();

    nowTo.setHours(now.getHours());
    nowTo.setMinutes(now.getMinutes() + timePlus)
    nowFrom.setHours(now.getHours());
    nowFrom.setMinutes(now.getMinutes() - timeMinus)

    var coursDate = new Date();
    coursDate.setHours(cours.courseFirstStop.time.hours, cours.courseFirstStop.time.minutes);

    if (coursDate >= nowFrom && coursDate <= nowTo) {
      return true;
    }
    return false;
  }

  getStopForLocation(stops: Array<Stop>): Stop {
    var stop: Stop = null;
    stops.forEach(element => {
      if (element.city == this.firstStop)
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

  go(course: Course) {
    this.coursSelected.emit(course);
  }

  directionResolve(direction) {
    if (direction.includes("Ry"))
      return "Rybie"
    else if (direction.includes("Że"))
      return "Żegocina"
    else if (direction.includes("Ty"))
      return "Tymbark"
    else if (direction.includes("Sz"))
      return "Szyk"
  }
}
