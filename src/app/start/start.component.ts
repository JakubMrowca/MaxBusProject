import { Component, OnInit, NgZone } from '@angular/core';
import { List } from 'linqts';
import { Course } from '../models/Course';
import { AppState } from '../services/AppState';
import { LocationDetected } from '../events/LocationDetected';
import { Subscription, interval, Observable } from 'rxjs';
import { LocationService } from '../services/LocationService';
import { CoursesFiltered } from '../events/CoursesFiltered';
import { NotificationService } from '../services/NotificationService';
import { Message } from '../models/Message';
import { AppVersionUpdated } from '../events/AppVersionUpdated';
import { MatTabChangeEvent, MatBottomSheet, MatSnackBar } from '@angular/material';
import { MapSheet } from './components/mapSheet.component';
import { EventService } from '../services/EventServices';
import { LocationChanged } from '../events/LocationChanged';
import { TraficService } from '../services/TraficService';
import { ProgressUpdated } from '../events/ProgressUpdated';
import { initDomAdapter } from '../../../node_modules/@angular/platform-browser/src/browser';
import { BusLocationServices } from '../services/BusLocationServices';
import { OptionsSheets } from './components/options-sheets.component';
const secondsCounter = interval(15000);

@Component({
  selector: 'app-start',
  templateUrl: './start.component.html',
  styleUrls: ['./start.component.css']
})
export class StartComponent implements OnInit {
  startCourses: List<Course>;
  allCourses: List<Course>;
  direction: string;
  watchCourse: Course;
  hideNotification = true;
  unreadNotification = false;
  message: Message;
  appVersion: number;
  interval: any;

  nearStop = undefined;
  prommises = [];
  distances = [];
  progressWidth = 0;
  travelMode = 'walk';
  travelModeEnum;
  nearCourse: Course;
  searchEnd = false;
  nearCourses: List<Course>;
  courseSkip = 0;
  bounds;
  map;

  subscription: Subscription;
  location: string;
  constructor(private appState: AppState,public snackBar: MatSnackBar, public traficService: TraficService, public busLocation: BusLocationServices, public zone: NgZone, private bottomSheet: MatBottomSheet, private notService: NotificationService, private eventServ: EventService, private locationService: LocationService) {
    this.allCourses = this.appState.allCourses;
    this.travelModeEnum = google.maps.TravelMode.WALKING;
    this.eventServ.getMessage<LocationDetected>(LocationDetected).subscribe(message => {
      this.direction = this.locationService.getDirection();
      this.getCourseForDirection(true);
    });
    this.eventServ.getMessage<LocationChanged>(LocationChanged).subscribe(message => {
      this.location = message.location;
    })
    this.eventServ.getMessage<ProgressUpdated>(ProgressUpdated).subscribe(message => {
      this.progressWidth = message.progress;
    });
    this.direction = this.appState.direction == null ? "Lim" : this.appState.direction;
    this.location = this.appState.currentLocation;
    if (this.location == null || this.location == undefined)
      this.location = "Limanowa";
    this.watchCourse = this.appState.getWatchCourse();
    this.subscription = this.eventServ.getMessage<LocationChanged>(LocationChanged).subscribe(message => {
      // this.getCourseForDirection(true);
    })
  }

  searchCourse() {
    this.courseSkip = 0;
    this.progressWidth = 1;
    this.searchRecuretion(0);
  }

  searchRecuretion(index: number) {
    var stops = this.locationService.stopsLatAndLng;
    var coursLength = stops.length - 1;
    var k = index / coursLength;
    var z = k * 100;
    this.progressWidth = z;
    console.log(this.progressWidth);

    if (index == stops.length) {
      this.calculateTime();
      return;
    }
    this.traficService.getTimeAndDistance(this.appState.yourCord.lat, this.appState.yourCord.lng, stops[index].city, this.travelModeEnum).then(resolve => {
      this.distances.push({ city: stops[index].city, data: resolve.routes["0"].legs["0"], response: resolve });
      this.searchRecuretion(index + 1);
    }, error => {
      this.searchRecuretion(index + 1);
    });
  }
  changeTravelMode(mode) {
    if (this.travelMode == mode)
      return;
    this.travelMode = mode;
    if (mode == "WALKING")
      this.travelModeEnum = google.maps.TravelMode.WALKING;
    if (mode == "BICYCLING")
      this.travelModeEnum = google.maps.TravelMode.BICYCLING;
    if (mode == "DRIVING")
      this.travelModeEnum = google.maps.TravelMode.DRIVING;

    this.searchEnd = false;
    this.nearStop = undefined;
    this.distances = [];
    this.searchCourse();
  }

  calculateTime() {
    this.distances.forEach(distance => {
      if (this.nearStop == undefined)
        this.nearStop = distance;

      if (distance.data.distance.value < this.nearStop.data.distance.value) {
        this.nearStop = distance;
      }
    });
    this.locationService.currentLocation = this.nearStop.city;
    this.searchNearCourse();
    console.log(this.nearStop);
  }

  calculateTrafic(){
    var that = this;
    this.nearCourse.traficIsCalculate = true;
    this.progressWidth = 1;
    this.traficService.calculateDurrationForStop(this.nearCourse, 0).then(data => {
      this.initMap(this.nearCourse)
    }, error => {
      this.nearCourse.traficIsCalculate = false;
      this.progressWidth = 0;
    });
  }

  showOptions(){
    this.bottomSheet.open(OptionsSheets, {data:this.message.text}).afterDismissed().subscribe(result =>{
        if(result == "calculateTrafic" && this.nearCourse.traficIsCalculate != true){
          this.calculateTrafic();
        }
        if(result == "ride"){
          this.go();
        }
        if(result == "refresh"){
          this.getCourseForDirection(true);
        }
    });
  }

  searchNearCourse(minPlus = 110) {
    var date = new Date();
    date.setSeconds(date.getSeconds() + this.nearStop.data.duration.value);
    this.nearCourses = this.startCourses.Where(x => this.isNear(x, date, minPlus)).ToList();
    if (this.nearCourses)
      var course = this.nearCourses.FirstOrDefault();
    if (minPlus > 120)
      return;
    if (course == undefined || course == null) {
      this.searchNearCourse(minPlus + 10);
    }
    if (course) {
      this.initMap(course);
    }
  }

  initMap(course: Course) {
    this.nearCourse = course;
    this.searchEnd = true;
    var directionsDisplay = new google.maps.DirectionsRenderer();
    var origin = new google.maps.LatLng(this.appState.yourCord.lat, this.appState.yourCord.lng);
    var nearStopLatLng = this.locationService.getLatLngForStop(this.nearCourse.firstStop);
    this.map = new google.maps.Map(document.getElementById('mapStart'), {
      zoom: 11,
      center: nearStopLatLng,
      zoomControl: false,
      mapTypeControl: false,
      scaleControl: false,
      streetViewControl: false,
      rotateControl: false,
      fullscreenControl: false
    });

    this.bounds = new google.maps.LatLngBounds();
    this.bounds.extend(origin);
    this.bounds.extend(nearStopLatLng);
    this.map.fitBounds(this.bounds);
    directionsDisplay.setDirections(this.nearStop.response);
    directionsDisplay.setMap(this.map);
    this.addMarkersForCourse(this.map)
    this.addBusMarker(this.map);
  }

  addMarkersForCourse(map: google.maps.Map) {
    var image = {
      url: 'https://maps.google.com/mapfiles/kml/pal4/icon54.png',
      labelOrigin: new google.maps.Point(10, -3)
      // This marker is 20 pixels wide by 32 pixels high.
    }

    this.nearCourse.stops.forEach(stop => {
      var infowindow = new google.maps.InfoWindow({
        content: "<div style='color:black'>" + stop.city + ' ' + stop.timeString + "</div>",
      });
      var marker = new google.maps.Marker(
        {
          position: this.locationService.getLatLngForStop(stop),
          map: map,
          icon: image,
          title: stop.city
        });
      google.maps.event.addListener(marker, 'click', function () {
        infowindow.open(map, marker);
      })
    });
  }

  isNear(x: Course, date: Date, minPlus: number): boolean {
    for (let i = 0; i < x.stops.length; i++) {
      if (x.stops[i].city == this.nearStop.city) {
        x.firstStop = x.stops[i];
        break
      }
    }
    var dateTo = new Date(date);
    dateTo.setMinutes(date.getMinutes() + minPlus);
    var dateFrom = new Date(date);
    dateFrom.setMinutes(date.getMinutes() - 10);

    var coursDate = new Date();
    coursDate.setHours(x.firstStop.time.hours, x.firstStop.time.minutes);

    if (coursDate > dateFrom && coursDate < dateTo) {
      return true;
    }
    return false;
  }

  getCourseForDirection(sendEvent) {
    console.log("tak")
    var that = this;
    this.startCourses = this.allCourses.Where(x => x.direction.startsWith(this.direction))
      .OrderBy(x => {
        var now = new Date();
        now.setHours(x.firstStop.time.hours);
        now.setMinutes(x.firstStop.time.minutes);
        return now;
      })
      .ToList();
    setTimeout(function () {
      if (that.nearCourse) {
        that.searchCourse();
      }
      if (sendEvent)
        that.eventServ.sendEvent(CoursesFiltered);
    }, 100);
  }

  changeDirection() {
    if (this.direction == "Krk") {
      this.direction = "Lim"
    }
    else {
      this.direction = "Krk"
    }

    this.zone.run(() => { this.getCourseForDirection(true); });
  }

  changeLocation() {
    var nextLocation = this.locationService.getNextLocation(this.location);
    this.locationService.currentLocation = nextLocation;
    this.eventServ.sendEvent(LocationChanged, new LocationChanged(nextLocation));
  }

  getDirection() {
    if (this.direction == "Krk")
      return "LIM";
    else
      return "KRK";
  }

  ngOnInit() {
    this.interval = secondsCounter.subscribe(n => {
          this.locationService.startWatchPosition();
          //  if(this.watchCourse == undefined && this.nearCourse != undefined)
          //    this.initMap(this.nearCourse);
    });
    console.log("start");
    this.getCourseForDirection(false);
    this.appVersion = this.notService.getAppVersion();
    this.message = this.notService.getMessage();
    this.hideNotification = !this.message.unread;
  }

  ngOnDestroy(): void {
    this.interval.unsubscribe();
    clearInterval(this.interval);
    this.subscription.unsubscribe();
    if (this.interval) {
      this.interval.unsubscribe();
    }
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

  go() {
    
    if(this.checkDate()){
      this.snackBar.open("Bus jeszcze nie wyjechał!", "", {
        duration: 2000,
      });
      return;
    }
    if(this.nearStop.data.distance.value > 2000){
      this.snackBar.open("Jesteś za daleko!", "", {
        duration: 2000,
      });
      return;
    }
    this.appState.watchCourse = this.nearCourse;
    this.watchCourse = this.nearCourse;

  }

  onWatchEnd(course: Course) {
    this.appState.watchCourse = undefined;
    this.watchCourse = undefined;
    this.nearCourse = undefined;
    this.nearStop = undefined
    this.searchEnd = false;
    this.appState.saveWatchCourse();
  }

  checkDate(){
    var now = new Date();
    var coursDate = new Date();
    coursDate.setHours(this.nearCourse.stops[0].time.hours);
    coursDate.setMinutes(this.nearCourse.stops[0].time.minutes);
    if(now < coursDate)
      return false;
    return true;
  }

  resolveDirection() {
    switch (this.nearCourse.direction) {
      case "Krk-Że-Lim":
        return "Kraków - Zegocina - Limanowa"
      case "Krk-Ry-Lim":
        return "Kraków - Stare rybie - Limanowa"
      case "Krk-Sz-Lim":
        return "Kraków - Szyk - Limanowa"
      case "Lim-Sz-Krk":
        return "Limanowa - Szyk - Kraków"
      case "Lim-Że-Krk":
        return "Limanowa - Zegocina - Kraków"
      case "Lim-Ry-Krk":
        return "Limanowa - Stare rybie - Kraków"
      case "Lim-Ty-Krk":
        return "Limanowa - Tymbark - Kraków"
      case "Krk-Ty-Lim":
        return "Kraków - Tymbark - Limanowa"
      default:
        break;
    }
  }

  addBusMarker(map) {
    this.busLocation.getLocation({ direction: this.nearCourse.direction, time: this.nearCourse.stops[0].timeString }).subscribe(data => {
      if (data.time != undefined) {

        var image = {
          url: 'http://maps.google.com/mapfiles/kml/shapes/bus.png',
          labelOrigin: new google.maps.Point(10, -3)
          // This marker is 20 pixels wide by 32 pixels high.
        }

        var lat = Number.parseFloat(data.time[0].Lat);
        var lng = Number.parseFloat(data.time[0].Lng);
        var stamp = new Date(data.time[0].Stamp);
        console.log(stamp);
        console.log(data.time[0].stamp);
        var latlng = new google.maps.LatLng(lat, lng);
        var infowindow = new google.maps.InfoWindow({
          content: "<div style='color:black'>O godzinie: " + stamp.toLocaleTimeString() + " był tu</div>",
        });
        var marker = new google.maps.Marker(
          {
            position: latlng,
            map: map,
            icon: image
          });
        google.maps.event.addListener(marker, 'click', function () {
          infowindow.open(map, marker);
        })
      }
    })

  }

  getPrevCourse() {
    console.log(this.courseSkip);
    this.courseSkip--;
    var course = this.nearCourses.Skip(this.courseSkip).FirstOrDefault();
    if (course) {
      this.nearCourse = course;
      this.initMap(course);
    }
    else {
      this.courseSkip++;
    }
  }

  checkNext() {
    if (this.nearCourses.Count() - 1 > this.courseSkip) {
      return true;
    }
    return false;
  }
  checkPrev() {
    if (this.courseSkip == 0) {
      return false;
    }
    return true;
  }

  getNextCourse() {
    console.log(this.nearCourses.Count());
    this.courseSkip++;
    var course = this.nearCourses.Skip(this.courseSkip).FirstOrDefault();
    if (course) {
      this.nearCourse = course;
      this.initMap(course);
    }
    else {
      this.courseSkip--;
    }
  }

}
