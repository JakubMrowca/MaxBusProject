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

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  startCourses: List<Course>;
  allCourses: List<Course>;
  subscription: Subscription;
  subsVersion: Subscription;
  direction: string;
  hideNotification = true;
  unreadNotification = false;
  message: Message;
  appVersion: number;
  constructor(private appState: AppState, private notService: NotificationService, private locationEvent: LocationDetected, private courseEvent: CoursesFiltered, private locationService: LocationService) {
    this.allCourses = this.appState.allCourses;
    this.subscription = this.locationEvent.getMessage().subscribe(message => {
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

    if (sendEvent)
      this.courseEvent.sendEvent();
  }

  ngOnInit() {
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

}
