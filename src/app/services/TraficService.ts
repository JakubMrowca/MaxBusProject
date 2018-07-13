import { Injectable } from "@angular/core";
import { Stop } from "../models/Stop";
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from "rxjs";
import * as moment from "moment";
import { } from '@types/googlemaps';
import { Course } from "../models/Course";
import { DirectionEnum } from "../helpers/DirectionEnum";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

const stopNameInGoogle = {
    "Kraków": "Wita+Stwosza+4",
    "Wieliczka": ["Kraków+Plac+Inwalidów,+30-001+Kraków", "Tesco,+Wielicka+259,+30-663+Kraków", "Galeria+NaCl,+Marszałka+Józefa+Piłsudskiego+73,+32-020+Wieliczka"],
    "Gdów": "Gdów,+32-420",
    "Łapanów": "Łapanów",
    "Trzciana": "Trzciana",
    "Żegocina": "Żegocina,+32-731",
    "Rybie": "Stare+Rybie,+34-652",
    "Szyk": "Krasne-Lasocice",
    "Laskowa": "Laskowa, 34-602",
    "Limanowa": "Limanowa+Ul.+Z.+Augusta"
}

@Injectable()
export class TraficService {


    constructor(public http: HttpClient) {
    }

    apiLink = "https://maps.googleapis.com/maps/api/directions/json?origin=";
    key = "AIzaSyCKaopCdrGph_N28D9vVRrPsxRnNMqeUMU";

    calculateDurrationForStop(cours: Course, i) {
        return new Promise((resolve, reject) => {
            i
            if (cours.stops[i + 1] == null || cours.stops[i + 1] == undefined)
                resolve();

            var stop: Stop = cours.stops[i];
            var nextStop: Stop = cours.stops[i + 1];

            var time = new Date();
            time.setHours(stop.time.hours);
            time.setMinutes(stop.time.minutes);

            if(time < new Date())
                resolve();
                
            var timeTo = new Date();
            timeTo.setHours(nextStop.time.hours);
            timeTo.setMinutes(nextStop.time.minutes);

            if (stop.city === "Kraków" &&
                (cours.direction == DirectionEnum.KRL.toString()
                    || cours.direction == DirectionEnum.KSL.toString()
                    || cours.direction == DirectionEnum.KZL.toString())) {

                this.calculateToKrakowWieliczka(time).then(resolve1 => {
                    this.calculateTime(nextStop, time, timeTo, resolve1);
                    this.calculateDurrationForStop(cours, i + 1).then(end1 => {
                        resolve();
                    });
                });
            }
            else if (stop.city === "Wieliczka" && (
                cours.direction == DirectionEnum.LRK.toString()
                || cours.direction == DirectionEnum.LSK.toString()
                || cours.direction == DirectionEnum.LZK.toString()
            )) {
                this.calculateToWieliczkaKrakow(time).then(resolve2 => {
                    this.calculateTime(nextStop, time,timeTo, resolve2);
                    this.calculateDurrationForStop(cours, i + 1).then(end2 =>{
                        resolve();
                    });
                });
            }
            else if(stop.city === "Gdów" && nextStop.city === "Wieliczka") {
                this.send(stopNameInGoogle[stop.city], stopNameInGoogle[nextStop.city][2], time).then(resolve3 => {
                    this.calculateTime(nextStop, time, timeTo, resolve3);
                    this.calculateDurrationForStop(cours, i + 1).then(end3=>{
                        resolve();
                    });
                });
            }
            else if(stop.city === "Wieliczka" && nextStop.city === "Gdów") {
                this.send(stopNameInGoogle[stop.city][2], stopNameInGoogle[nextStop.city], time).then(resolve4 => {
                    this.calculateTime(nextStop, time, timeTo, resolve4);
                    this.calculateDurrationForStop(cours, i + 1).then(end4=>{
                        resolve();
                    });
                });
            }
            else {
                this.send(stopNameInGoogle[stop.city], stopNameInGoogle[nextStop.city], time).then(resolve5 => {
                    this.calculateTime(nextStop, time, timeTo, resolve5);
                    this.calculateDurrationForStop(cours, i + 1).then(end5=>{
                        resolve();
                    });
                });
            }

        });

    }

    calculateTime(nextStop: Stop, timeFrom, timeTo, durationInTraffic) {
        
        var timeMz = moment(timeFrom).add((durationInTraffic), "seconds");
        var dateNew = timeMz.toDate();

        nextStop.time.hours = dateNew.getHours()
        nextStop.time.minutes = dateNew.getMinutes();

        nextStop.timeString = this.pad(nextStop.time.hours.toString(), 2) + ":" + this.pad(nextStop.time.minutes.toString(),2);
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
                var duration = data.routes["0"].legs["0"].duration_in_traffic.value;
                resolve(duration);
            });
        });

    }

    calculateToKrakowWieliczka(time) {
        return new Promise((resolve, reject) => {
            var first;
            var secoud;
            var third;
            this.send(stopNameInGoogle.Kraków, stopNameInGoogle.Wieliczka[0], time).then(data => {
                first = data;
                this.send(stopNameInGoogle.Wieliczka[0], stopNameInGoogle.Wieliczka[1], time).then(data => {
                    secoud = first + data;
                    this.send(stopNameInGoogle.Wieliczka[1], stopNameInGoogle.Wieliczka[2], time).then(data => {
                        third = secoud + data;
                        resolve(third);
                    });
                });
            });
        });
    }

    calculateToWieliczkaKrakow(time) {
        return new Promise((resolve, reject) => {
            var first;
            var secoud;
            var third;
            this.send(stopNameInGoogle.Wieliczka[2], stopNameInGoogle.Wieliczka[1], time).then(data => {
                first = data;
                this.send(stopNameInGoogle.Wieliczka[1], stopNameInGoogle.Wieliczka[0], time).then(data => {
                    secoud = first + data;
                    this.send(stopNameInGoogle.Wieliczka[0], stopNameInGoogle.Kraków, time).then(data => {
                        third = secoud + data;
                        resolve(third);
                    });
                });
            });
        });
    }

    pad(num, size) {
        var s = num+"";
        while (s.length < size) s = "0" + s;
        return s;
    }
}