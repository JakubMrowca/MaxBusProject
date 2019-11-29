// import { OnInit, Component, Input, SimpleChanges, OnChanges, Output, EventEmitter } from "../../../../node_modules/@angular/core";
// import { Course } from "../../models/Course";
// import { AppState } from "../../services/AppState";
// import { LocationService } from "../../services/LocationService";
// import { TraficService } from "../../services/TraficService";
// import { EventService } from "../../services/EventServices";
// import { LocationChanged } from "../../events/LocationChanged";
// import { Stop } from "../../models/Stop";
// import { BusLocationServices } from "../../services/BusLocationServices";
// import * as moment from "moment";
// import { LatAndLngChanged } from "../../events/LatAndLngChanged";
// import { Subscription } from "../../../../node_modules/rxjs";
// import { Time } from "@angular/common";
// declare let cordova: any;
// @Component({
//     selector: 'watched-course',
//     templateUrl: './watched-course.html',
//     styleUrls: ['./watched-course.css']
// })
// export class watchedCourseComponent implements OnInit {
//     allMarkers: Array<google.maps.Marker>;
//     watchCourse: Course;
//     sharing = false;
//     isSharing = "Udostepnij";
//     duration: any;
//     distance: any;
//     stopSubscription: Subscription;
//     latLngSubscriptiom: Subscription;
//     nextStop: any;
//     watchedMap: any;
//     timeToBus: boolean;
//     bounds;
//     directionDispla;
//     nextStopCiti;
//     youMarker: google.maps.Marker;
//     @Output() endWatch = new EventEmitter<Course>();

//     constructor(public appState: AppState, public busService: BusLocationServices, public locationService: LocationService, public eventService: EventService, public traficService: TraficService) {
//         this.watchCourse = new Course();
//         this.stopSubscription = this.eventService.getMessage<LocationChanged>(LocationChanged).subscribe(message => {
//             this.appState.watchCourse = this.watchCourse;
//             this.appState.saveWatchCourse();
//             this.init();
//         });
//         this.latLngSubscriptiom = this.eventService.getMessage<LatAndLngChanged>(LatAndLngChanged).subscribe(message => {
//             this.onLocationChange(message.lat, message.lng);
//         })
//     }

//     addMarkersForCourse(map: google.maps.Map) {
//         var image = {
//             url: 'http://maps.google.com/mapfiles/kml/pal4/icon54.png',
//             labelOrigin: new google.maps.Point(10, -3)
//             // This marker is 20 pixels wide by 32 pixels high.
//         }

//         this.watchCourse.stops.forEach(stop => {
//             var infowindow = new google.maps.InfoWindow({
//                 content: "<div style='color:black'>" + stop.city + ' ' + stop.timeString + "</div>",
//             });
//             var marker = new google.maps.Marker(
//                 {

//                     position: this.locationService.getLatLngForStop(stop),
//                     map: map,
//                     icon: image,
//                     title: stop.city
//                 });
//             google.maps.event.addListener(marker, 'click', function () {
//                 infowindow.open(map, marker);
//             })
//         });
//     }

//     init() {
//         var directionsDisplay = new google.maps.DirectionsRenderer();
//         this.directionDispla = directionsDisplay;
//         var origin = new google.maps.LatLng(this.appState.yourCord.lat, this.appState.yourCord.lng);
//         var firstStopCenter = this.locationService.getLatLngForStop(this.watchCourse.firstStop);
//         var latlng = new google.maps.LatLng(this.appState.yourCord.lat, this.appState.yourCord.lng);
//         var map = new google.maps.Map(
//             document.getElementById('watchedMap'), {
//                 zoom: 10, center: firstStopCenter, zoomControl: false,
//                 mapTypeControl: false,
//                 scaleControl: false,
//                 streetViewControl: false,
//                 rotateControl: false,
//                 fullscreenControl: false
//             });
//         this.watchedMap = map;



//         this.youMarker = new google.maps.Marker({ position: latlng, map: map });
//         this.addMarkersForCourse(map);
//         this.traficService.getTimeAndDistance(this.appState.yourCord.lat, this.appState.yourCord.lng, this.getNextStop()).then(data => {
//             this.assignData(data);
//             let t: Time = { minutes: 1, hours: 1 };
//             this.bounds = new google.maps.LatLngBounds();
//             this.bounds.extend(origin);
//             this.bounds.extend(this.locationService.getLatLngForStop(new Stop(this.getNextStop(),"00",t)));
//             map.fitBounds(this.bounds);
//             directionsDisplay.setDirections(data);
//             directionsDisplay.setMap(map);
//             console.log(data);
//         });
//     }
//     assignData(data) {
//         this.duration = data.routes["0"].legs["0"].duration_in_traffic.text;
//         this.distance = data.routes["0"].legs["0"].distance.text;
//         this.nextStop = data.routes["0"].legs["0"].end_address;
//         // console.log(cordova.plugins);
//         // cordova.plugins.notification.local.schedule({
//         //     title: 'MaxBus',
//         //     text: 'Kolejny przystanek za:' + this.duration,
//         //     foreground: true
//         // });
//     }

//     onLocationChange(newLat, newLng) {
//         this.locationService.findNextStops(this.watchCourse);
//         this.appState.watchCourse = this.watchCourse;
//         this.appState.saveWatchCourse();
//         var latlng = new google.maps.LatLng(newLat, newLng);
//         this.traficService.getTimeAndDistance(newLat, newLng, this.getNextStop()).then(data => {

//             this.assignData(data);
//             let t: Time = { minutes: 1, hours: 1 };
//             this.bounds.extend(latlng);
//             this.bounds.extend(this.locationService.getLatLngForStop(new Stop(this.getNextStop(),"00",t)));
//             this.watchedMap.fitBounds(this.bounds);
//             this.directionDispla.setDirections(data);
//             this.directionDispla.setMap(this.watchedMap);
//         });
//         if (this.sharing) {
//             this.busService.insertLocation({
//                 direction: this.watchCourse.direction,
//                 time: this.watchCourse.stops[0].timeString,
//                 stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
//                 lat: newLat,
//                 lng: newLng
//             }).subscribe(data => {
//                 console.log(data + "poszlo");
//             });
//         }
//     }

//     ngOnInit() {
//         this.watchCourse = this.appState.watchCourse;
//         this.appState.saveWatchCourse();
//         this.init();
//     }

//     getStopForLocation(stops: Array<Stop>): Stop {
//         var stop: Stop = null;
//         stops.forEach(element => {
//             if (element.city == this.locationService.getCurrentLocation())
//                 stop = element;
//         });
//         return stop;
//     }

//     resolveTime() {
//         //TODO trzeba obsluzyc inna lokacje niz przystanek
//         return this.duration;
//     }

//     resolveDirection() {
//         switch (this.watchCourse.direction) {
//           case "Krk-Że-Lim":
//             return "Kraków - Zegocina - Limanowa"
//           case "Krk-Ry-Lim":
//             return "Kraków - Stare rybie - Limanowa"
//           case "Krk-Sz-Lim":
//             return "Kraków - Szyk - Limanowa"
//           case "Lim-Sz-Krk":
//             return "Limanowa - Szyk - Kraków"
//           case "Lim-Że-Krk":
//             return "Limanowa - Zegocina - Kraków"
//           case "Lim-Ry-Krk":
//             return "Limanowa - Stare rybie - Kraków"
//           case "Lim-Ty-Krk":
//             return "Limanowa - Tymbark - Kraków"
//           case "Krk-Ty-Lim":
//             return "Kraków - Tymbark - Limanowa"
//           default:
//             break;
//         }
//       }

//     getNextStop(): string {
//         var locationIndex;
//         for (let i = 0; i < this.watchCourse.stops.length; i++) {
//             if (this.watchCourse.stops[i].city == this.watchCourse.firstStop.city) {
//                 locationIndex = i;
//                 break;
//             }
//         }
//         if (locationIndex == this.watchCourse.stops.length - 1) {
//             this.nextStopCiti = this.watchCourse.stops[this.watchCourse.stops.length - 1].city;           
//         }
//         else{
//             this.nextStopCiti = this.watchCourse.stops[locationIndex + 1].city;
//         }
//         return this.nextStopCiti;
//     }

//     end() {
//         this.endWatch.emit(null);
//     }

//     share() {
//         if (this.sharing) {
//             this.isSharing = "Udostepnij"
//             this.sharing = false;
//         }
//         else {
//             this.busService.insertLocation({
//                 direction: this.watchCourse.direction,
//                 time: this.watchCourse.stops[0].timeString,
//                 stamp: moment().format('YYYY-MM-DD HH:mm:ss'),
//                 lat: this.appState.yourCord.lat,
//                 lng: this.appState.yourCord.lng
//             }).subscribe(data => {
//                 console.log(data + "poszlo");
//                 this.sharing = true;
//                 this.isSharing = "Przerwij"
//             });
//         }
//     }

//     ngOnDestroy() {
//         this.stopSubscription.unsubscribe();
//         this.latLngSubscriptiom.unsubscribe();
//     }
// }