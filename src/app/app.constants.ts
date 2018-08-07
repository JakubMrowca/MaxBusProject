import { NoInternet } from "./events/NoInternet";
import { LocationDetected } from "./events/LocationDetected";
import { AppVersionUpdated } from "./events/AppVersionUpdated";
import { TimetableUpdated } from "./events/TimetableUpdated";
import { TimetableVersionChanged } from "./events/TimetableVersionChanged";
import { CoursesFiltered } from "./events/CoursesFiltered";

export const EVENTS = [
    NoInternet,
    LocationDetected,
    AppVersionUpdated,
    TimetableUpdated,
    TimetableVersionChanged,
    CoursesFiltered
  ];