import { Injectable } from "@angular/core";
import { Course } from "../models/Course";
import * as moment from "moment";
import { AppVersionUpdated } from "../events/AppVersionUpdated";
import { LocalStorageHelper } from "../helpers/LocalStorageHelper";
import { EventService } from "./EventServices";

@Injectable()
export class LegendService {
    schoolFreeDayFrom;
    schoolFreeDayTo;

    constructor(private eventService: EventService, private localDb: LocalStorageHelper) {
        this.eventService.getMessage<AppVersionUpdated>(AppVersionUpdated).subscribe(message => {
            this.schoolFreeDayFrom = message.schoolFreeDayFrom;
            this.schoolFreeDayTo = message.schoolFreeDayTo;
        });
        this.getSchoolFreeDay();
    }

    getSchoolFreeDay() {
        var freeDays = this.localDb.getSchoolFreeDay();
        if(freeDays == null)
            return;
        this.schoolFreeDayFrom = freeDays[0];
        this.schoolFreeDayTo = freeDays[1];
    }

    courseIsInThisDay(course: Course): Boolean {
        var result = false;
        var result2 = false;
        var result3 = false;
        var result4 = false;
        var result5 = false;
        var legends = course.legends.split(" ");
        var dayOfWeek = moment().weekday();

        for (let i = 0; i < legends.length; i++) {
            if (legends[i] === "S") {
                result = this.isNotShoolFreeDay(moment());
            }
            if (legends[i] === "P") {
                result2 = this.isOnlyFriday(dayOfWeek);
            }
            if (legends[i] === "F") {
                result3 = this.isWorkDay(dayOfWeek);
            }
            if (legends[i] === "6") {
                result4 = this.isSaturday(dayOfWeek);
            }
            if (legends[i] === "7") {
                result5 = this.isSunnday(dayOfWeek);
            }
        };

        if((result5 || result4 || result3) && (!result || !result2))
            return true;
        else
            return false;
    }

    isWorkDay(dayOfWeek: number) {

        if (dayOfWeek < 6 && dayOfWeek > 0)
            return true;
        return false;
    }

    isSunnday(dayOfWeek: number) {
        console.log(dayOfWeek);
        if (dayOfWeek == 0)
            return true;
        return false
    }

    isSaturday(dayOfWeek: number) {
        if (dayOfWeek == 6)
            return true;
        return false
    }

    isOnlyFriday(dayOfWeek: number) {
        if (dayOfWeek == 5)
            return true;
        return false;
    }

    isNotShoolFreeDay(now: any) {
        var start = moment(this.schoolFreeDayTo);
        var end = moment(this.schoolFreeDayTo);
        if (now >= start && now <= end)
            return false;
        return true;
    }
}