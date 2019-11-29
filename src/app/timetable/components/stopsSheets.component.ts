import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material/bottom-sheet";
import { Course } from "../../models/Course";
import { MAT_BOTTOM_SHEET_DATA } from '@angular/material/bottom-sheet';

@Component({
    selector: 'stops-sheets',
    templateUrl: 'stops-sheets.html',
  })
  export class StopsSheets {
      course:Course;
      legends:Array<string>;
      symbolLegend = {
        "F": "kursuje w dni robocze",
        "7": "kursuje w niedzielę",
        "S": "nie kursuje w dni wolne od nauki szkolnej",
        "P": "kursuje tylko w piątek",
        "6": "kursuje w soboty"
    }
    constructor(private bottomSheetRef: MatBottomSheetRef<StopsSheets>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
        this.course = data;
        this.legends = this.course.legends.split(" ");
    }
  
    openLink(event: MouseEvent): void {
      this.bottomSheetRef.dismiss();
      event.preventDefault();
    }
  }