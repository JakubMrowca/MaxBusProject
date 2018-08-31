import { Injectable } from "@angular/core";
import { LocationDetected } from "../events/LocationDetected";
import { AppState } from "./AppState";
import { Stop } from "../models/Stop";
import { EventService } from "./EventServices";
import { LocationChanged } from "../events/LocationChanged";
import { LatAndLngChanged } from "../events/LatAndLngChanged";
import { Course } from "../models/Course";
declare let cordova: any;
@Injectable()
export class LocationService {
    stopsLatAndLng = [{
        latFrom: 50.07013757140309,
        longFrom: 19.949011061307374,
        city: "Kraków"
    },
    {
        latFrom: 50.068826,
        longFrom: 19.925870,
        city: "Plac inw."
    }, {
        latFrom: 50.036917,
        longFrom: 19.939690,
        city: "Mateczne"
    },
    {
        latFrom: 50.028882,
        longFrom: 19.956833,
        city: "Bonarka"
    },
    {
        latFrom: 50.014457,
        longFrom: 19.997265,
        city: "Bieżanów"
    },
    {
        latFrom: 49.98729714024202,
        longFrom: 20.06225824356079,
        city: "Wieliczka"
    },
    {
        latFrom: 49.90803386622939,
        longFrom: 20.198804140090942,
        city: "Gdów"
    },
    {
        latFrom: 49.86477454391063,
        longFrom: 20.29152810573578,
        city: "Łapanów"
    },
    {
        latFrom: 49.80746441820928,
        longFrom: 20.314879417419434,
        city: "Rybie"
    },
    {
        latFrom: 49.845080336168024,
        longFrom: 20.36998420142902,
        city: "Trzciana"
    },
    {
        latFrom: 49.813078229059876,
        longFrom: 20.420235993276265,
        city: "Żegocina"
    },
    {
        latFrom: 49.789475919461815,
        longFrom: 20.29715087385739,
        city: "Szyk"
    },

    {
        latFrom: 49.76163501912453,
        longFrom: 20.45033758454099,
    
        city: "Laskowa"
    },
    {
        latFrom: 49.699823079791976,
        longFrom: 20.419726967811584,
        city: "Limanowa"
    }
    ]

    constructor(public eventService: EventService, public appState: AppState) {

    }
    currentLocation = "Kraków";
    watchId;
    lastState;
    getCurrentLocation(): string {
        return this.currentLocation;
    }

    getDirection(): string {
        switch (this.currentLocation) {
            case "Kraków":
            case "Wieliczka":
                return "Krk";
            case "Żegocina":
            case "Laskowa":
            case "Rybie":
            case "Szyk":
            case "Limanowa":
                return "Lim";
        }
    }

    getNextLocation(location: string): string {
        var locationIndex;
        for (let i = 0; i < this.stopsLatAndLng.length; i++) {
            if (this.stopsLatAndLng[i].city == location) {
                locationIndex = i;
                break;
            }
        }
        if (locationIndex == this.stopsLatAndLng.length - 1) {
            return this.stopsLatAndLng[0].city;
        }
        else
            return this.stopsLatAndLng[locationIndex + 1].city;
    }

    getLatLngForStop(stop: Stop) {
        var latlng;
        this.stopsLatAndLng.forEach(element => {
            if (element.city == stop.city)
                latlng = new google.maps.LatLng(element.latFrom, element.longFrom);
        });
        return latlng;
    }

    locationIsEnabled() {
        return new Promise((resolve, reject) => {
            resolve(true);
            cordova.plugins.diagnostic.isGpsLocationEnabled(function (enabled) {
                resolve(enabled)
                console.log("notError");
            }, function (error) {
                console.log("error");
                console.log(error);
                resolve("błąd")
            });
        })
    }

    getLocationForLatAndLeng() {
        var that = this;
        var options = { enableHighAccuracy: true };

        console.log("location");
        var watchId = navigator.geolocation.getCurrentPosition(data => {
            console.log("user allow location");
            var locationEvent = new LocationDetected();
            locationEvent.currentLocation = null;
            var lat = data.coords.latitude;
            var leng = data.coords.longitude;
            this.appState.yourCord = {
                lat: lat,
                lng: leng
            };
            for (let i = 0; i < latitudeRange.length; i++) {
                if (lat < latitudeRange[i].latFrom && lat > latitudeRange[i].latTo && leng > latitudeRange[i].longFrom && leng < latitudeRange[i].longTo) {
                    that.currentLocation = latitudeRange[i].city;
                    locationEvent.currentLocation = that.currentLocation;
                    break;
                }
            }
            that.eventService.sendEvent(LocationDetected, locationEvent);
        }, error => {
            console.log("user not allow location");
            var locationEvent = new LocationDetected()
            locationEvent.currentLocation = null;
            that.eventService.sendEvent(LocationDetected, locationEvent);
        }, options);
    }

    startWatchPosition() {
        var that = this;
        var options = { enableHighAccuracy: true };
        that.watchId = navigator.geolocation.getCurrentPosition(data => {
            var lat = data.coords.latitude;
            var newLocation;
            var leng = data.coords.longitude;
            console.log(lat + " : "+leng);

            this.appState.yourCord = {
                lat: lat,
                lng: leng
            };
            for (let i = 0; i < latitudeRange.length; i++) {
                if (lat < latitudeRange[i].latFrom && lat > latitudeRange[i].latTo && leng > latitudeRange[i].longFrom && leng < latitudeRange[i].longTo) {
                    newLocation = latitudeRange[i].city;
                    break;
                }
            }
            if (newLocation != that.currentLocation && newLocation != undefined) {
                that.currentLocation = newLocation;
                console.log(newLocation);
                that.eventService.sendEvent(LocationChanged, new LocationChanged(newLocation));
            }
            else{
                that.eventService.sendEvent(LatAndLngChanged,new LatAndLngChanged(lat,leng))
            }
        },error =>{},options);
    }

    stopWatchPostion() {
        navigator.geolocation.clearWatch(this.watchId);
    }

    findNextStops(course:Course){
        var yourLat = this.appState.yourCord.lat
        var stops = course.stops;
        var index = stops.indexOf(course.firstStop);
        for(let i = index+1;i < stops.length;i++){
            if(course.direction.startsWith("Krk")){
                let stopLat = this.getLatLngForStop(stops[i]).lat();
                if(stopLat > yourLat){
                    course.firstStop = stops[i];
                    break;
                }
            }
            if(course.direction.startsWith("Lim")){
                let stopLat = this.getLatLngForStop(stops[i]).lat();
                if(stopLat < yourLat){
                    course.firstStop = stops[i];
                    break;
                }
            }
        }
    }
}


const latitudeRange = [
    {
        latFrom: 50.063844,
        latTo:50.072000,
        longFrom: 19.818382,
        longTo:19.932884,
        city: "Plac inw."
    },
    {
        latFrom: 50.038299,
        latTo: 50.048633,
        longFrom: 19.985495,
        longTo: 19.908247,
        city: "Mateczne"
    },
    {
        latFrom: 50.007852,
        latTo: 50.01306,
        longFrom: 20.036630,
        longTo:19.57595,
        city: "Bieżanów"
    },
    {
        latFrom: 49.9881,
        latTo: 49.9075,
        longFrom: 19.9944,
        longTo: 20.2615,
        city: "Wieliczka"
    },
    {
        latFrom: 49.9179,
        latTo: 49.8809,
        longFrom: 20.3120,
        longTo: 20.1620,
        city: "Gdów"
    },
    {
        latFrom: 49.8701,
        latTo: 49.8368,
        longFrom: 20.2579,
        longTo: 20.3280,
        city: "Łapanów"
    },
    {
        latFrom: 49.8112,
        latTo: 49.7405,
        longFrom: 20.2921,
        longTo: 20.3910,
        city: "Rybie"
    },
    {
        latFrom: 49.8289,
        latTo: 49.7822,
        longFrom: 20.3800,
        longTo: 20.4775,
        city: "Żegocina"
    },
    {
        latFrom: 49.8341,
        latTo: 49.7775,
        longFrom: 20.2166,
        longTo: 20.3130,
        city: "Szyk"
    },
    {
        latFrom: 49.8548,
        latTo: 49.8311,
        longFrom: 20.3323,
        longTo: 20.4435,
        city: "Trzciana"
    },
    {
        latFrom: 49.7629,
        latTo: 49.7387,
        longFrom: 20.3827,
        longTo: 20.5022,
        city: "Laskowa"
    },
    {
        latFrom: 49.7604,
        latTo: 49.5758,
        longFrom: 20.2866,
        longTo: 20.6450,
        city: "Limanowa"
    },
    {
        latFrom: 50.0975,
        latTo: 50.0040,
        longFrom: 19.8100,
        longTo: 20.0792,
        city: "Kraków"
    }

]