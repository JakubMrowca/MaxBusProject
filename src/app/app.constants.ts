import { NoInternet } from "./events/NoInternet";
import { LocationDetected } from "./events/LocationDetected";
import { AppVersionUpdated } from "./events/AppVersionUpdated";
import { TimetableUpdated } from "./events/TimetableUpdated";
import { TimetableVersionChanged } from "./events/TimetableVersionChanged";
import { CoursesFiltered } from "./events/CoursesFiltered";
import { ProgressUpdated } from "./events/ProgressUpdated";
import { LocationChanged } from "./events/LocationChanged";
import { LatAndLngChanged } from "./events/LatAndLngChanged";
import { ProgressInfo } from "./events/ProgressInfo";

export const EVENTS = [
    NoInternet,
    LocationDetected,
    AppVersionUpdated,
    TimetableUpdated,
    TimetableVersionChanged,
    CoursesFiltered,
    ProgressUpdated,
    LocationChanged,
    LatAndLngChanged,
    ProgressInfo
  ];