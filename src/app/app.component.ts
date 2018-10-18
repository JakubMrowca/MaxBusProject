import { Component, NgZone } from '@angular/core';
import { Subscription, interval } from 'rxjs';
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
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { AppState } from './services/AppState';
import { NoInternet } from './events/NoInternet';
import { AppVersionUpdated } from './events/AppVersionUpdated';
import { EventService } from './services/EventServices';
import { MatSnackBar } from '@angular/material';
declare let navigator: any;
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  limCourses: List<Course>;
  krkCourses: List<Course>;
  allCourses: List<Course>;
  direction: string;
  calculatingDuration = false;
  timetableIsActual = false;
  locationIsDetected = false;
  locationState: any = "test";

  constructor(private appState: AppState, public snackBar: MatSnackBar, public zone: NgZone, private router: Router, public notService: NotificationService,
    public timetableService: TimetableUpdateService, public locationService: LocationService,
    private legendService: LegendService, public eventService: EventService) {

    this.eventSubscriptionInit();
    var that = this;
    document.addEventListener('deviceready', () => {
    console.log("deviceIsReady");
    that.notService.updateNotification();
    });

    document.addEventListener("online", this.connected, false);
  }

  eventSubscriptionInit() {
    this.eventService.getMessage<TimetableUpdated>(TimetableUpdated).subscribe(message => {
      console.log("timetable update catch");
      this.setTimetable();
      this.timetableIsActual = true;
    });

    this.eventService.getMessage<AppVersionUpdated>(AppVersionUpdated).subscribe(message => {
      this.afterNotificationUpdate();
    });

    this.eventService.getMessage<TimetableVersionChanged>(TimetableVersionChanged).subscribe(message => {
      this.timetableIsActual = false;
    });

    this.eventService.getMessage<LocationDetected>(LocationDetected).subscribe(message => {
      console.log("locationIsDetected so navigate to:");
      this.zone.run(() => {
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

    this.eventService.getMessage<NoInternet>(NoInternet).subscribe(message => {
      console.log("NoInternet catch or app no change");
      this.afterNotificationUpdate();
    });
  }

  connected() {
    // this.timetableIsActual = false;
    console.log("Connection return");
  }

  checkStart() {
    var connection = navigator.connection.type;
    console.log(connection);
    if (connection == "none") {
      this.snackBar.open("Brak połączenia z siecią!", "", {
        duration: 2000,
      });
    }
    navigator.permissions.query({ 'name': 'geolocation' })
      .then(permission => {

        if (permission.state == "denied"){
          this.snackBar.open("Udostpnij lokalizacje!", "", {
            duration: 2000,
          });
        }else{
          this.router.navigate(["start"]);
        }
      }
      )
    this.locationService.locationIsEnabled().then(data => {
      this.zone.run(() => {
        if (data == true)
          this.router.navigate(["start"]);
        else {
          this.snackBar.open("Udostpnij lokalizacje!", "", {
            duration: 2000,
          });
        }
      })
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
    this.appState.timetable = this.allCourses;
    this.appState.allCourses = this.allCourses.Where(x => this.legendService.courseIsInThisDay(x) == true).ToList();

  }
}
