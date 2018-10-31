import { Component, Inject } from "@angular/core";
import { MatBottomSheetRef } from "@angular/material";
import { Course } from "../../models/Course";
import {MAT_BOTTOM_SHEET_DATA} from '@angular/material';

@Component({
    selector: 'options-sheets',
    templateUrl: 'options-sheets.html',
  })
  export class OptionsSheets {
    message = "Nowa szkoła";


    constructor(private bottomSheetRef: MatBottomSheetRef<OptionsSheets>,@Inject(MAT_BOTTOM_SHEET_DATA) public data: any) {
      this.message = data;
    }
  
    openLink(event: MouseEvent): void {
      this.bottomSheetRef.dismiss();
      event.preventDefault();
    }

    calculateTrafic(){
      this.bottomSheetRef.dismiss("calculateTrafic");
      event.preventDefault();
    }

    ride(){
      this.bottomSheetRef.dismiss("ride");
      event.preventDefault();
    }

    refresh(){
      this.bottomSheetRef.dismiss("refresh");
      event.preventDefault();
    }
  }