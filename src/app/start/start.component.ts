import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { LocationDetected } from '../events/LocationDetected';
import { Subscription } from 'rxjs';
import { LocationService } from '../services/LocationService';
import { CoursesFiltered } from '../events/CoursesFiltered';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  startCourses: List<Course>;
  allCourses: List<Course>;
  subscription: Subscription;
  direction: string;
  constructor(private appState: AppState, private locationEvent:LocationDetected,private courseEvent: CoursesFiltered, private locationService:LocationService) {
    this.allCourses = this.appState.allCourses;
    this.subscription = this.locationEvent.getMessage().subscribe(message =>{
      this.direction = this.locationService.getDirection();
      this.getCourseForDirection(true);
      
    });
    this.direction = this.appState.direction == null ? "Lim" : this.appState.direction;
  }

  getCourseForDirection(sendEvent) {
    this.startCourses = this.allCourses.Where(x => x.direction.startsWith(this.direction))
      .OrderBy(x => {
        var now = new Date();
        now.setHours(x.firstStop.time.hours);
        now.setMinutes(x.firstStop.time.minutes);
        return now;
      })
      .ToList();

      if(sendEvent)
        this.courseEvent.sendEvent();
    }

  ngOnInit() {
    this.getCourseForDirection(false);
  }

}
