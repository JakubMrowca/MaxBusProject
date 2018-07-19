import { Component, OnInit, Input } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { CoursesFiltered } from '../events/CoursesFiltered';
import { AppState } from '../services/AppState';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css']
})
export class CoursesComponent implements OnInit {
  allCourses:List<Course>
  limCourses: List<Course>;
  krkCourses: List<Course>;
  constructor(private courseEvent:CoursesFiltered, private appState:AppState) { 
    this.allCourses = this.appState.allCourses;
   

  }

  ngOnInit() {
    console.log("courses");
  
    this.getCourseForDirection();
  }

  getCourseForDirection() {
    this.limCourses = this.allCourses.Where(x => x.direction.startsWith("Krk"))
      .OrderBy(x => {
        var now = new Date();
        now.setHours(x.firstStop.time.hours);
        now.setMinutes(x.firstStop.time.minutes);
        return now;
      })
      .ToList();

    this.krkCourses = this.allCourses.Where(x => x.direction.startsWith("Lim"))
      .OrderBy(x => {
        var now = new Date();
        now.setHours(x.firstStop.time.hours);
        now.setMinutes(x.firstStop.time.minutes);
        return now;
      })
      .ToList();

  }

}
