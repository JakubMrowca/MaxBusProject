import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { List } from 'linqts';
import { Course } from './models/Course';
import { NotificationService } from './services/NotificationService';
import { TraficService } from './services/TraficService';
import { TimetableUpdateService } from './services/TimetableUpdateService';
import { LocationService } from './services/LocationService';
import { TimetableUpdated } from './events/TimetableUpdated';
import { TimetableVersionChanged } from './events/TimetableVersionChanged';
import { LocationDetected } from './events/LocationDetected';
import { LegendService } from './services/LegendServices';
import { CoursesFiltered } from './events/CoursesFiltered';
import { Router } from '@angular/router';
import { AppState } from './services/AppState';
import { NoInternet } from './events/NoInternet';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscription: Subscription;
  timetableVerSub: Subscription;
  locationSub: Subscription;
  internetSub:Subscription;
  limCourses: List<Course>;
  krkCourses: List<Course>;
  allCourses: List<Course>;
  direction: string;
  calculatingDuration = false;
  timetableIsActual = false;
  locationIsDetected = false;
  
  constructor(private appState:AppState, private router:Router, public notService: NotificationService, public locationEvent: LocationDetected,
    public timetableService: TimetableUpdateService, public locationService: LocationService,
    private timetableEvent: TimetableUpdated, private timetableVersionEvent: TimetableVersionChanged,
    private legendService: LegendService, private courseEvent:CoursesFiltered,private internetEvent:NoInternet) {
    this.notService.updateNotification();
    this.eventSubscriptionInit();
    document.addEventListener('deviceready', () => {
      locationService.getLocationForLatAndLeng();
    });

    locationService.getLocationForLatAndLeng();
  }

  eventSubscriptionInit() {

    this.subscription = this.timetableEvent.getMessage().subscribe(message => {
      this.setTimetable()
      this.timetableIsActual = true;
    });

    this.timetableVerSub = this.timetableVersionEvent.getMessage().subscribe(message => {
      this.timetableIsActual = false;
    });

    this.locationSub = this.locationEvent.getMessage().subscribe(message => {
      this.locationIsDetected = true;
      if(message.currentLocation == null){
        this.router.navigate(["courses"]);
      }
      else{
        this.appState.direction = this.locationService.getDirection();
        this.router.navigate(["start"]);
      }
    });

    this.internetSub = this.internetEvent.getMessage().subscribe(message =>{
      this.setTimetable();
      this.timetableIsActual = true;
    });
  }

  setTimetable() {
    this.allCourses = this.timetableService.getTimetable();
    this.appState.allCourses = this.allCourses.Where(x => this.legendService.courseIsInThisDay(x) == true).ToList();
   
  }
}
