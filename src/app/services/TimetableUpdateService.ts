import { EventService } from "./EventServices";
import { LocalStorageHelper } from "../helpers/LocalStorageHelper";
import { Subscription } from "rxjs";
import { AppVersionUpdated } from "../events/AppVersionUpdated";
import { Notification } from "../models/Notification";
import { Injectable } from "@angular/core";
import { Course } from "../models/Course";
import { DirectionEnum } from "../helpers/DirectionEnum";
import { Stop } from "../models/Stop";
import { Time } from "@angular/common";
import * as $ from 'jquery';
import { List } from 'linqts';
import { TimetableUpdated } from "../events/TimetableUpdated";
import { TimetableBuilderHelper } from "../helpers/TimetableBuilderHelper";
import { TimetableVersionChanged } from "../events/TimetableVersionChanged";

@Injectable()
export class TimetableUpdateService {
    subscription: Subscription;
    repoLink: string = "https://raw.githubusercontent.com/metinowy15/MaksBusApi/master/data.json";

    constructor(private appVersionEvent: AppVersionUpdated, private timetableVersionEvent: TimetableVersionChanged,private timetableEvent: TimetableUpdated,private localDb: LocalStorageHelper) {
        this.subscription = this.appVersionEvent.getMessage().subscribe(message => {
            this.checkTimetableVersion(message.timetableVersion)
        });
    }

    checkTimetableVersion(timeTableVersion: number) {
        var lastVersion = this.localDb.getTimetableVersion();
        if (timeTableVersion > lastVersion) {
            this.timetableVersionEvent.sendEvent();
            this.localDb.saveTimetableVersion(timeTableVersion);
            this.updateTimetable();
        }

    }

    getTimetable(): List<Course> {
        var timetable = this.localDb.getTimetable();
        return TimetableBuilderHelper.convertTimetableToList(timetable);
    }

    updateTimetable() {
        var that = this;
        $.getJSON(this.repoLink, {
            format: "json"
        }).done(function (data) {
            var timetable = TimetableBuilderHelper.buildTimetableFromJson(data);
            that.localDb.saveTimetable(timetable.ToArray());
            that.timetableEvent.timetable = timetable;
            that.timetableEvent.sendEvent();
        });
    }
}