import { Component, Inject, OnInit } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Course } from "../../models/Course";
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';
import { AppState } from "../../services/AppState";
import { LocationService } from "../../services/LocationService";
import { BusLocationServices } from "../../services/BusLocationServices";


@Component({
    selector: 'map-sheets',
    templateUrl: 'map-sheet.html',
  })
  export class MapSheet {
      course:Course;
 
    constructor(public appState:AppState, private locationServie:LocationService,public busLocation:BusLocationServices, private bottomSheetRef: MatBottomSheetRef<MapSheet>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
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
        this.addBusMarker(map);
    }

    addMarkersForCourse(map:google.maps.Map){
        var image = {
            url: 'http://maps.google.com/mapfiles/kml/pal4/icon54.png',
            labelOrigin: new google.maps.Point(10, -3)
            // This marker is 20 pixels wide by 32 pixels high.
        }
       
        this.course.stops.forEach(stop => {
            var infowindow = new google.maps.InfoWindow({
                content: "<div style='color:black'>"+stop.city + ' ' + stop.timeString+"</div>",
            });
            var marker = new google.maps.Marker(
                {
                    position:this.locationServie.getLatLngForStop(stop),
                    map:map,
                    icon: image,
                    title:stop.city});
            google.maps.event.addListener(marker,'click',function(){
                infowindow.open(map,marker);
            })
        });
    }

    addBusMarker(map){
       this.busLocation.getLocation({direction:this.course.direction,time:this.course.stops[0].timeString}).subscribe(data =>{
        if(data.time != undefined){

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
            var latlng = new google.maps.LatLng(lat,lng);
            var infowindow = new google.maps.InfoWindow({
                content: "<div style='color:black'>O godzinie: "+stamp.toLocaleTimeString()+" był tu</div>",
            });
            var marker = new google.maps.Marker(
                {
                    position:latlng,
                    map:map,
                    icon: image});
            google.maps.event.addListener(marker,'click',function(){
                infowindow.open(map,marker);
            })
        }
       })
        
    }
  }