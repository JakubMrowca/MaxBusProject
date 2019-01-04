import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatAutocompleteModule,
  MatBadgeModule,
  MatBottomSheetModule,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatChipsModule,
  MatDatepickerModule,
  MatDialogModule,
  MatDividerModule,
  MatExpansionModule,
  MatGridListModule,
  MatIconModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatNativeDateModule,
  MatPaginatorModule,
  MatProgressBarModule,
  MatProgressSpinnerModule,
  MatRadioModule,
  MatRippleModule,
  MatSelectModule,
  MatSidenavModule,
  MatSliderModule,
  MatSlideToggleModule,
  MatSnackBarModule,
  MatSortModule,
  MatStepperModule,
  MatTableModule,
  MatTabsModule,
  MatToolbarModule,
  MatTooltipModule,
  MatTreeModule,
} from '@angular/material';
import { BrowserModule } from '@angular/platform-browser';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NotificationService } from './services/NotificationService';
import { LocalStorageHelper } from './helpers/LocalStorageHelper';
import { EventService } from './services/EventServices';
import { TimetableUpdateService } from './services/TimetableUpdateService';
import { LocationService } from './services/LocationService';
import { TraficService } from './services/TraficService';
import { StartComponent } from './start/start.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LegendService } from './services/LegendServices';
import {NgxMaterialTimepickerModule} from 'ngx-material-timepicker';
import { CoursesComponent } from './courses/courses.component';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {RoutingEnum} from './helpers/RoutingEnum';
import { AppState } from './services/AppState';
import { HomeComponent } from './home/home.component';
import { StopsSheets } from './timetable/components/stopsSheets.component';
import { MapSheet } from './start/components/mapSheet.component';
import { watchedCourseComponent } from './start/components/watchedCourse.component';
import { BusLocationServices } from './services/BusLocationServices';
import { OptionsSheets } from './start/components/options-sheets.component';
import { SingleCourseComponent } from './single-course/single-course.component';


const path: Routes = [
  { path: '', redirectTo: "home", pathMatch: 'full' },
  { path: "courses/:direction", component: CoursesComponent },
  { path: "start", component: StartComponent},
  { path: "timetable", component:TimetableComponent },
  { path: "home", component:HomeComponent }
  
];
@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    StartComponent,
    watchedCourseComponent,
    TimetableComponent,
    CoursesComponent,
    HomeComponent,
    StopsSheets,
    OptionsSheets,
    MapSheet,
    SingleCourseComponent

  ],
  imports: [
    RouterModule.forRoot(path),
    BrowserModule,
    MatAutocompleteModule,
    MatBadgeModule,
    [NgxMaterialTimepickerModule.forRoot()],
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatStepperModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule,
    HttpClientModule,
    HttpModule,
    MatTreeModule,
    BrowserAnimationsModule
  ],
  entryComponents:[StopsSheets, MapSheet,OptionsSheets],
  providers: [NotificationService, AppState, LegendService, LocalStorageHelper, TimetableUpdateService, LocationService,TraficService, EventService,BusLocationServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
