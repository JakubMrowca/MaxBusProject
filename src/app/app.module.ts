import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
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
import { AppVersionUpdated } from './events/AppVersionUpdated';
import { TimetableUpdated } from './events/TimetableUpdated';
import { TimetableVersionChanged } from './events/TimetableVersionChanged';
import { TraficService } from './services/TraficService';
import { StartComponent } from './start/start.component';
import { TimetableComponent } from './timetable/timetable.component';
import { LegendService } from './services/LegendServices';
import { LocationDetected } from './events/LocationDetected';
import { CoursesFiltered } from './events/CoursesFiltered';
import { CoursesComponent } from './courses/courses.component';
import {
  RouterModule,
  Routes
} from '@angular/router';
import {RoutingEnum} from './helpers/RoutingEnum';
import { AppState } from './services/AppState';
import { NoInternet } from './events/NoInternet';
import { HomeComponent } from './home/home.component';
import { StopsSheets } from './timetable/components/stopsSheets.component';


const path: Routes = [
  { path: '', redirectTo: "home", pathMatch: 'full' },
  { path: "courses", component: CoursesComponent },
  { path: "start", component: StartComponent},
  { path: "timetable", component:TimetableComponent },
  { path: "home", component:HomeComponent }
  
];
@NgModule({
  declarations: [
    AppComponent,
    CourseComponent,
    StartComponent,
    TimetableComponent,
    CoursesComponent,
    HomeComponent,
    StopsSheets

  ],
  imports: [
    RouterModule.forRoot(path),
    BrowserModule,
    MatAutocompleteModule,
    MatBadgeModule,
    MatBottomSheetModule,
    MatButtonModule,
    MatButtonToggleModule,
    FormsModule,
    RouterModule,
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
  entryComponents:[StopsSheets],
  providers: [NotificationService, AppState,NoInternet, LegendService,LocationDetected, CoursesFiltered, LocalStorageHelper, AppVersionUpdated,TimetableUpdated, TimetableVersionChanged, TimetableUpdateService, LocationService,TraficService],
  bootstrap: [AppComponent]
})
export class AppModule { }
