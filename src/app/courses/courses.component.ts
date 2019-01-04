import { Component, OnInit, Input, NgZone } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { LocationService } from '../services/LocationService';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';

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
  firstStop: string = "Kraków"
  constructor(private appState: AppState, private route: ActivatedRoute,
    private router: Router, public zone: NgZone, public locationService: LocationService) {
    this.allCourses = this.appState.allCourses;
    this.stops = this.locationService.stopsLatAndLng;
  }

  ngOnInit() {
    console.log("courses");
    this.route.params.subscribe(params => {
      this.direction = params["direction"];
      this.zone.run(() => {
        if (this.direction == "Krk"){
          this.firstStop = "Kraków";
          this.imgSrc = "images/LimHerb.png"
        }
        if (this.direction == "Lim") {
          this.firstStop == "Limanowa";
          this.imgSrc = "images/KrkHerb.png"
        }
        this.getCourseForDirection();
      });
    });
  }
setNow(){
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

}
