import { Injectable } from "@angular/core";
import { Stop } from "../models/Stop";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import * as moment from "moment";
import { } from 'googlemaps';
import { Course } from "../models/Course";
import { DirectionEnum } from "../helpers/DirectionEnum";
import { EventService } from "./EventServices";
import { ProgressUpdated } from "../events/ProgressUpdated";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

const stopNameInGoogle = {
    "Kraków": "50.069440, 19.949613",
    "Plac inw.": "50.068904, 19.925932",
    "Mateczne": "50.035941, 19.941330",
    "Bonarka":"50.028882,19.956833",
    "Bieżanów": "50.013463, 20.000331",
    "Wieliczka": "49.987269, 20.065606",
    "Gdów": "49.908338, 20.198642",
    "Łapanów": "49.864574, 20.291420",
    "Trzciana": "49.845080336168024,20.36998420142902",
    "Żegocina": "49.813078229059876,20.420235993276265",
    "Rybie": "49.80746441820928,20.314879417419434",
    "Szyk": "49.789475919461815, 20.29715087385739",
    "Laskowa": "49.76163501912453, 20.45033758454099",
    "Lasocice":"49.811551, 20.230321",
    "Jodłownik":"49.772098, 20.232453",
    "Tymbark": "49.730311, 20.324225",
    "Limanowa": "49.699823079791976, 20.419726967811584"
}

@Injectable()
export class TraficService {

    oldTimeTo;
    constructor(public http: HttpClient, public eventService: EventService) {
    }

    apiLink = "https://maps.googleapis.com/maps/api/directions/json?origin=";
    key = "AIzaSyCKaopCdrGph_N28D9vVRrPsxRnNMqeUMU";

    getTimeAndDistance(lat: any, lng: any, toStop: string,travel?:google.maps.TravelMode) {
        return new Promise<any>((resolve, reject) =>{
            var time = new Date();
            time.setHours(time.getHours() + (Math.floor(Math.random() * 6) + 1))         
            var start = new google.maps.LatLng(lat, lng);
            this.getDirection(start, stopNameInGoogle[toStop], time,travel).then(data => {
                resolve(data);
            },error =>{
                reject();
            });
        })
    }

    calculateDurrationForStop(cours: Course, i) {
        return new Promise((resolve, reject) => {
            this.eventService.sendEvent(ProgressUpdated, new ProgressUpdated(this.calculateProgress(cours, i)));
            if (cours.stops[i + 1] == null || cours.stops[i + 1] == undefined)
                resolve();

            var stop: Stop = cours.stops[i];
            var nextStop: Stop = cours.stops[i + 1];

            var time = new Date();
            time.setHours(stop.time.hours);
            time.setMinutes(stop.time.minutes);

            if (time < new Date())
                resolve();

            var timeTo = new Date();
            timeTo.setHours(nextStop.time.hours);
            timeTo.setMinutes(nextStop.time.minutes);
            this.oldTimeTo = moment(timeTo);
            this.send(stopNameInGoogle[stop.city], stopNameInGoogle[nextStop.city], time).then(resolve5 => {
                this.calculateTime(nextStop, time, timeTo, resolve5);
                this.calculateDurrationForStop(cours, i + 1).then(end => {
                        resolve();
                }, error => {
                    reject();
                });
            }, error => {
                reject();
            });
        });
    }

    calculateProgress(cours: Course, i) {
        var coursLength = cours.stops.length - 1;
        var k = i / coursLength;
        var z = k * 100;
        return z
    }

    calculateTime(nextStop: Stop, timeFrom, timeTo, durationInTraffic) {
        if(durationInTraffic == null)
            durationInTraffic = this.oldTimeTo.diff(timeFrom,"seconds");
        
        var timeMz = moment(timeFrom).add((durationInTraffic), "seconds");
        var dateNew = timeMz.toDate();

        nextStop.time.hours = dateNew.getHours()
        nextStop.time.minutes = dateNew.getMinutes();

        nextStop.timeString = this.pad(nextStop.time.hours.toString(), 2) + ":" + this.pad(nextStop.time.minutes.toString(), 2);
    }

    send(start, end, time) {
        return new Promise((resolve, reject) => {
            var directionsService = new google.maps.DirectionsService;
            directionsService.route({
                origin: start,
                destination: end,
                travelMode: google.maps.TravelMode.DRIVING,
                drivingOptions: {
                    departureTime: time,
                    trafficModel: google.maps.TrafficModel.BEST_GUESS
                }

            }, data => {
                if (data == null) {
                    resolve(null);
                    console.log(start);
                    console.log(end);
                    console.log(time);
                }
                var duration = data.routes["0"].legs["0"].duration_in_traffic.value;
                resolve(duration);
            });
        });

    }

    getDirection(start, end, time, travel?:google.maps.TravelMode) {
        if(!travel)
            travel = google.maps.TravelMode.DRIVING;
        return new Promise((resolve, reject) => {
            var directionsService = new google.maps.DirectionsService;
            directionsService.route({
                origin: start,
                destination: end,
                travelMode: travel,
                drivingOptions: {
                    departureTime: time,
                    trafficModel: google.maps.TrafficModel.BEST_GUESS
                }

            }, data => {
                if (data == null) {
                    reject();
                }
                else{
                resolve(data);
                console.log(data);
                }
            });
        });

    }

    pad(num, size) {
        var s = num + "";
        while (s.length < size) s = "0" + s;
        return s;
    }
}