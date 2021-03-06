import { Component, OnInit, Input, NgZone } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { switchMap, map, share } from 'rxjs/operators';
import { LocationService } from '../services/LocationService';
import { NgxMaterialTimepickerModule } from 'ngx-material-timepicker';
import { interval, Observable } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
const secondsCounter = interval(1000);
@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  allCourses: List<Course>
  limCourses: List<Course>;
  imgSrc;
  direction: string;
  now = new Date();
  stops: any;
  interval: any;
  dateString = "";
  timeString ="";
  firstStop: string = "Kraków"
  private clock: Observable<string>;
  constructor(private appState: AppState, private route: ActivatedRoute,
    private router: Router, public zone: NgZone, public locationService: LocationService) {
    this.allCourses = this.appState.allCourses;
    this.stops = this.locationService.stopsLatAndLng;
  }

  ngOnInit() {
    this.showTime();
    console.log("courses");
    this.loadDateString()
    this.interval = secondsCounter.subscribe(n => {
      this.showTime();
    });
    this.route.params.subscribe(params => {
      this.direction = params["direction"];
      this.zone.run(() => {
        if (this.direction == "Krk") {
          this.firstStop = "Kraków";
          this.imgSrc = "../../assets/LimHerb.png"
        }
        if (this.direction == "Lim") {
          this.firstStop == "Limanowa";
          this.imgSrc = "../../assets/KrkHerb.png"
        }
        this.getCourseForDirection();
      });
    });
  }

  loadDateString() {
    var today = new Date();
    this.dateString =today.toISOString().substring(0, 10);
  }
  setNow() {
    this.now = new Date();
  }
  getCourseForDirection() {
    this.limCourses = this.allCourses.Where(x => x.direction.startsWith(this.direction))
      .OrderBy(x => {
        var now = new Date();
        now.setHours(x.firstStop.time.hours);
        now.setMinutes(x.firstStop.time.minutes);
        return now;
      })
      .ToList();
  }



  showTime() {
    var date = new Date();
    var h: any = date.getHours(); // 0 - 23
    var m: any = date.getMinutes(); // 0 - 59
    var s: any = date.getSeconds(); // 0 - 59

    h = (h < 10) ? "0" + h : h;
    m = (m < 10) ? "0" + m : m;
    s = (s < 10) ? "0" + s : s;

    var time = h + ":" + m + ":" + s + " ";
    this.timeString = time;
  }
}
