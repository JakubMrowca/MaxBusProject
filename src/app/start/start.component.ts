import { Component, OnInit } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { LocationDetected } from '../events/LocationDetected';
import { Subscription } from 'rxjs';
import { LocationService } from '../services/LocationService';
import { CoursesFiltered } from '../events/CoursesFiltered';
import { NotificationService } from '../services/NotificationService';
import { Message } from '../models/Message';
import { AppVersionUpdated } from '../events/AppVersionUpdated';
import { MatTabChangeEvent, MatBottomSheet } from '@angular/material';
import { MapSheet } from './components/mapSheet.component';
import { EventService } from '../services/EventServices';

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  startCourses: List<Course>;
  allCourses: List<Course>;
  direction: string;
  hideNotification = true;
  unreadNotification = false;
  message: Message;
  appVersion: number;
  location: string;
  constructor(private appState: AppState, private bottomSheet: MatBottomSheet, private notService: NotificationService, private eventServ: EventService, private locationService: LocationService) {
    this.allCourses = this.appState.allCourses;
    this.eventServ.getMessage<LocationDetected>(LocationDetected).subscribe(message => {
      this.direction = this.locationService.getDirection();
      this.getCourseForDirection(true);
    });
    this.direction = this.appState.direction == null ? "Lim" : this.appState.direction;
    this.location = this.appState.currentLocation;
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

    if (sendEvent)
      this.eventServ.sendEvent(CoursesFiltered);
  }

  ngOnInit() {
    console.log("start");
    this.getCourseForDirection(false);
    this.appVersion = this.notService.getAppVersion();
    this.message = this.notService.getMessage();
    this.hideNotification = !this.message.unread;
  }

  notificationClick() {
    if (this.hideNotification == false) {
      if (this.message.unread == true) {
        this.message.unread = false;
        this.notService.saveMessage(this.message);
      }
      this.hideNotification = true;
    } else this.hideNotification = false;
  }

  onMapShowed(course: Course) {
    this.bottomSheet.open(MapSheet, { data: course });
  }

  onCourseSelected(course: Course) {

  }

}
