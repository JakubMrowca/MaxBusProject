import { Component, Inject, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material";
import { Course } from "../../models/Course";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';
import { AppState } from "../../services/AppState";
import { LocationService } from "../../services/LocationService";


@Component({
    selector: 'map-sheets',
    templateUrl: 'map-sheet.html',
  })
  export class MapSheet {
      course:Course;
 
    constructor(public appState:AppState, private locationServie:LocationService, private bottomSheetRef: MatBottomSheetRef<MapSheet>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
        this.course = data;
       
    }
    
    openLink(event: MouseEvent): void {
      this.bottomSheetRef.dismiss();
      event.preventDefault();
    }

    ngOnInit(){
        var firstStopCenter = this.locationServie.getLatLngForStop(this.course.firstStop); 
        var latlng = new google.maps.LatLng(this.appState.yourCord.lat,this.appState.yourCord.lng);
        var map = new google.maps.Map(
            document.getElementById('map'), {zoom: 10, center: firstStopCenter,zoomControl: false,
                mapTypeControl: false,
                scaleControl: false,
                streetViewControl: false,
                rotateControl: false,
                fullscreenControl: false});
        var marker = new google.maps.Marker({position: latlng, map: map});
        this.addMarkersForCourse(map);
    }

    addMarkersForCourse(map:google.maps.Map){
        var image = {
            url: 'http://maps.google.com/mapfiles/kml/pal4/icon54.png',
            labelOrigin: new google.maps.Point(10, -3)
            // This marker is 20 pixels wide by 32 pixels high.
        }
        this.course.stops.forEach(stop => {
            var marker = new google.maps.Marker(
                {
                    
                    position:this.locationServie.getLatLngForStop(stop),
                    map:map,
                    icon: image,
                    label: {
                        text: stop.city + ' ' + stop.timeString,
                        color: '#5255e0',
                        fontSize: '16px'
                    },
                    title:stop.city});
        });
    }
  }