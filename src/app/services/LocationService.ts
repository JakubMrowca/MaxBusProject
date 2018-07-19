import { Injectable } from "@angular/core";
import { LocationDetected } from "../events/LocationDetected";
declare let cordova: any;
@Injectable()
export class LocationService {

    constructor(public locationEvent: LocationDetected){

    }
    currentLocation = "Kraków";

    getCurrentLocation(): string {
        return this.currentLocation;
    }

    getDirection(): string {
        switch (this.currentLocation){
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

    locationIsEnabled(){
        return new Promise((resolve,reject)=>{
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
        var options = {enableHighAccuracy:true};  
        
        console.log("location");
        var watchId = navigator.geolocation.getCurrentPosition(data => {
            console.log("user allow location");
            var lat = data.coords.latitude;
            var leng = data.coords.longitude;
            for (let i = 0; i < latitudeRange.length; i++) {
                if (lat < latitudeRange[i].latFrom && lat > latitudeRange[i].latTo && leng > latitudeRange[i].longFrom && leng < latitudeRange[i].longTo) {
                    that.currentLocation = latitudeRange[i].city;
                    that.locationEvent.currentLocation = that.currentLocation;
                    that.locationEvent.sendEvent();
                    return;
                }
            }
        }, error =>{
            console.log("user not allow location");
            that.locationEvent.currentLocation = null;
            that.locationEvent.sendEvent();
        }, options);
    }

}

const latitudeRange = [
    {
        latFrom: 50.0975,
        latTo: 50.0040,
        longFrom: 19.8272,
        longTo: 20.0792,
        city: "Kraków"
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
    }
]