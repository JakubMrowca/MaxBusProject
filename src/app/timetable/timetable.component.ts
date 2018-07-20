import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { MatTabChangeEvent, MatBottomSheet } from '@angular/material';
import { StopsSheets } from './components/stopsSheets.component';

@Component({
  selector: 'app-timetable',
  templateUrl: './timetable.component.html',
  styleUrls: ['./timetable.component.css']
})
export class TimetableComponent implements OnInit {
  timetable: List<Course>

  limCoursesList: List<Course>
  krkCoursesList: List<Course>

  limCourses: Array<Course>
  krkCourses: Array<Course>

  hideFilterBar = true;
  zegocinaCourse = true;
  szykCourse = true;
  rybieCourse = true;
  activeTab ="Lim";

  constructor(public appState: AppState, private bottomSheet: MatBottomSheet) { }

  ngOnInit() {
    this.timetable = this.appState.timetable;
    this.limCoursesList = this.timetable.Where(x => x.direction.startsWith("Lim")).OrderBy(x => x.firstStop.timeString);
    this.krkCoursesList = this.timetable.Where(x => x.direction.startsWith("Krk")).OrderBy(x => x.firstStop.timeString);
    this.krkCourses = this.krkCoursesList.ToArray();
    this.limCourses = this.limCoursesList.ToArray();
  }

  showStops(course:Course){
    this.bottomSheet.open(StopsSheets, {data:course});
  }

  onTabClick(event: MatTabChangeEvent) {
    console.log(event);
    if(event.index == 0){
      this.activeTab = "Lim";
    }
    else
      this.activeTab = "Krk";

    this.filterCourses();
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

  filterCourses(){
    if(this.activeTab == "Lim")
      this.limCourses = this.limCoursesList.Where(x => this.showForDirection(x.direction) == true).ToArray();
    else
      this.krkCourses = this.krkCoursesList.Where(x => this.showForDirection(x.direction) == true).ToArray();
  }

  showForDirection(direction:string):boolean{
    if(direction.includes("Sz") && this.szykCourse == true)
      return true;
    if(direction.includes("Że") && this.zegocinaCourse == true)
      return true;
    if(direction.includes("Ry") && this.rybieCourse == true)
      return true;

    return false
  }

}
