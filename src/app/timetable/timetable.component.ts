import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { MatTabChangeEvent, MatBottomSheet } from '@angular/material';
import { StopsSheets } from './components/stopsSheets.component';
import { SingleCourseComponent } from '../single-course/single-course.component';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timetable: List<Course>
  timetableView: Array<Course>

  directionCoursesList: List<Course>
  krkCoursesList: List<Course>

  limCourses: Array<Course>
  krkCourses: Array<Course>


  
  directions = [{ value: 'Lim', viewValue: 'Do Krakowa' },
  { value: 'Krk', viewValue: 'Do Limanowej' }];
  
  stopsView = [{ value: 'Że', viewValue: 'Żegocina' },
  { value: 'Sz', viewValue: 'Szyka' },
  { value: 'Ty', viewValue: 'Tymbark' },
  { value: 'Ry', viewValue: 'Rybie' },
  { value: 'All', viewValue: 'Wszystkie' },];
  hideFilterBar = true;
  zegocinaCourse = true;
  szykCourse = true;
  rybieCourse = true;
  tymbarkCourse = true;
  activeStop =null;
  breakpoint = "3:1";

  constructor(public appState: AppState, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.timetable = this.appState.timetable;
    this.getCoursesForDirection("Lim");
    this.breakpoint = (window.innerWidth <= 450) ? "3:1" : "6:1";
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 450) ? "3:1" : "6:1";
  }

  getCoursesForDirection(direction){
    this.directionCoursesList = this.timetable.Where(x => x.direction.startsWith(direction)).OrderBy(x => x.firstStop.timeString);
    this.timetableView = this.directionCoursesList.ToArray();
    if(this.activeStop != null)
      this.filterCourses(this.activeStop);
  }

  showStops(course:Course){
    this.bottomSheet.open(StopsSheets, {data:course});
  }


  filterBarClick() {
    if (this.hideFilterBar == true) {
      this.hideFilterBar = false;
    }
    else
    {
      this.hideFilterBar = true;
    }
  }

  showDetails(course:Course){
    this.bottomSheet.open(SingleCourseComponent, { data:{ course:course,fullMode:false} });
  }

  filterCourses(stops){
    this.activeStop = stops;
      this.timetableView = this.directionCoursesList.Where(x => x.direction.includes(stops) || stops == "All").ToArray();
  }
}
