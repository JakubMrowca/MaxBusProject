import { Component, OnInit, Inject, NgZone } from '@angular/core';
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { MatBottomSheetRef } from "@angular/material";
import { Course } from '../models/Course';
import { MatSnackBar, MatDatepickerToggle } from '@angular/material';
import { TraficService } from '../services/TraficService';
import { ProgressUpdated } from '../events/ProgressUpdated';
import { EventService } from '../services/EventServices';
import { BehaviorSubject } from 'rxjs';
declare let navigator: any;

@Component({
  selector: 'single-course',
  templateUrl: './single-course.component.html',
  styleUrls: ['./single-course.component.css']
})
export class SingleCourseComponent implements OnInit {
  course: Course
  progressW:number = 0;
  calculateInProgress = false;
  testEmitter = new BehaviorSubject<number>(this.progressW);
  legends: Array<string>;
  symbolLegend = {
    "F": "kursuje w dni robocze",
    "7": "kursuje w niedzielę",
    "S": "nie kursuje w dni wolne od nauki szkolnej",
    "P": "kursuje tylko w piątek",
    "6": "kursuje w soboty"
  }
  constructor(private traffic:TraficService,public eventServ:EventService,public zone:NgZone, public matSnackBar: MatSnackBar, private bottomSheetRef: MatBottomSheetRef<SingleCourseComponent>, @Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
    this.course = data;
    this.eventServ.getMessage<ProgressUpdated>(ProgressUpdated).subscribe(message => {
        this.progressW = message.progress;
        this.testEmitter.next(this.progressW);
        console.log(message.progress)
    });
    this.legends = this.course.legends.split(" ");
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  ngOnInit() {

  }
  calculateTravelTime(course: Course) {
    var firstStop = course.stops[0];
    var lastStop = course.stops[course.stops.length -1];
    if (firstStop.time == null)
      return "";
    var lastStopDate = new Date();
    var firstStopDate = new Date();

    firstStopDate.setHours(firstStop.time.hours);
    firstStopDate.setMinutes(firstStop.time.minutes);
    lastStopDate.setHours(lastStop.time.hours);
    lastStopDate.setMinutes(lastStop.time.minutes);

    var difference = lastStopDate.getTime() - firstStopDate.getTime();
    var resultInMinutes = Math.round(difference / 60000);
    if (resultInMinutes >= 60) {
      var hourResult = Number.parseInt((resultInMinutes / 60).toString());
      var minResult = resultInMinutes % 60;
      return hourResult.toString() + " h " + minResult.toString() + " min"
    } else
      return resultInMinutes.toString() + " min";
  }
  resolveDirection(course: Course) {
    switch (course.direction) {
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
  back(){
    this.bottomSheetRef.dismiss();
  }
    calculateTraffic() {
    this.calculateInProgress = true;
    var courseTmp = this.course;
    var connection = navigator.connection.type;
    console.log(connection);
    if (connection == "none") {
      this.matSnackBar.open("Brak połączenia z siecią!", "", {
        duration: 2000,
      });
      this.calculateInProgress = false;
      return;
    }
    courseTmp.traficIsCalculate = true;
    this.traffic.calculateDurrationForStop(courseTmp, 0).then(data => {
      this.course = courseTmp;
      this.calculateInProgress = false;
    }, error => {
      courseTmp.traficIsCalculate = false;
      this.calculateInProgress = false;
    });
  }

}
