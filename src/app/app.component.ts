import { Component, NgZone } from '@angular/core';
import { Subscription } from 'rxjs';
import { List } from 'linqts';
import { Course } from './models/Course';
import { NotificationService } from './services/NotificationService';
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
import { AppVersionUpdated } from './events/AppVersionUpdated';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  subscription: Subscription;
  timetableVerSub: Subscription;
  locationSub: Subscription;
  internetSub: Subscription;
  appVersionSub: Subscription;
  limCourses: List<Course>;
  krkCourses: List<Course>;
  allCourses: List<Course>;
  direction: string;
  calculatingDuration = false;
  timetableIsActual = false;
  locationIsDetected = false;
  locationState: any = "test";

  constructor(private appState: AppState, public zone: NgZone, private router: Router, public notService: NotificationService, public locationEvent: LocationDetected,
    public timetableService: TimetableUpdateService, public locationService: LocationService,
    private timetableEvent: TimetableUpdated, private timetableVersionEvent: TimetableVersionChanged,
    private legendService: LegendService, private appVersionEvent: AppVersionUpdated, private internetEvent: NoInternet) {

    this.eventSubscriptionInit();
    var that = this;
    // document.addEventListener('deviceready', () => {
      console.log("deviceIsReady");
      that.notService.updateNotification();
    // });

    document.addEventListener("online", this.connected, false);
  }

  eventSubscriptionInit() {

    this.subscription = this.timetableEvent.getMessage().subscribe(message => {
      console.log("timetable update catch");
      this.setTimetable();
      this.timetableIsActual = true;
    });

    this.appVersionSub = this.appVersionEvent.getMessage().subscribe(message =>{
      this.afterNotificationUpdate();
     });

    this.timetableVerSub = this.timetableVersionEvent.getMessage().subscribe(message => {
      this.timetableIsActual = false;
    });

    this.locationSub = this.locationEvent.getMessage().subscribe(message => {
      console.log("locationIsDetected so navigate to:");
      this.zone.run(() =>{
        this.locationIsDetected = true;
        this.appState.currentLocation = message.currentLocation;
        if (message.currentLocation == null) {
          this.router.navigate(["courses"]);
        }
        else {
          this.appState.direction = this.locationService.getDirection();
          this.router.navigate(["start"]);
        }
      })
     
    });

    this.internetSub = this.internetEvent.getMessage().subscribe(message => {
      console.log("NoInternet catch or app no change");
      this.afterNotificationUpdate();
    });
  }

  connected(){
    this.zone.run(() =>{
      // this.timetableIsActual = false;
      console.log("Connection return");
    });
  }

  afterNotificationUpdate() {
    this.setTimetable();
    this.timetableIsActual = true;
    var that = this;
    this.locationService.locationIsEnabled().then(data => {
      this.zone.run(() => {
        if (data == true)
          this.locationService.getLocationForLatAndLeng();
        else {
          this.locationIsDetected = true;
          console.log("location is disable")
          this.router.navigate(["courses"]);
        }
      })
    });
  }

  setTimetable() {
    this.allCourses = this.timetableService.getTimetable();
    this.appState.allCourses = this.allCourses.Where(x => this.legendService.courseIsInThisDay(x) == true).ToList();

  }
}
