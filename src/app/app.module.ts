import { AppComponent } from './app.component';
import { CourseComponent } from './course/course.component';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import { NgModule, SimpleChange } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatBadgeModule } from '@angular/material/badge';
import { MatBottomSheetModule } from '@angular/material/bottom-sheet';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatChipsModule } from '@angular/material/chips';
import { MatNativeDateModule, MatRippleModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSliderModule } from '@angular/material/slider';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSortModule } from '@angular/material/sort';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatTreeModule } from '@angular/material/tree';
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
// import { watchedCourseComponent } from './start/components/watchedCourse.component';
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
    // AppComponent,
    CourseComponent,
    StartComponent,
    // watchedCourseComponent,
    TimetableComponent,
    CoursesComponent,
    HomeComponent,
    StopsSheets,
    OptionsSheets,
    MapSheet,
    SingleCourseComponent

  ],
  exports: [MatSidenavModule],
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
  entryComponents:[StopsSheets, MapSheet,OptionsSheets,SingleCourseComponent],
  providers: [NotificationService, AppState, LegendService, LocalStorageHelper, TimetableUpdateService, LocationService,TraficService, EventService,BusLocationServices],
  bootstrap: [AppComponent]
})
export class AppModule { }
