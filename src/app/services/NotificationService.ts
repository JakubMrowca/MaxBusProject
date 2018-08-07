import * as $ from 'jquery';
import { Injectable } from '@angular/core';
import { Notification } from '../models/Notification';
import { Message } from '../models/Message';
import { LocalStorageHelper } from '../helpers/LocalStorageHelper';
import { EventService } from './EventServices';
import { AppVersionUpdated } from '../events/AppVersionUpdated';
import { TagPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';
import { NoInternet } from '../events/NoInternet';
declare let navigator: any;
@Injectable()
export class NotificationService {

    notificationLink: string = "https://raw.githubusercontent.com/metinowy15/MaksBusApi/master/notification.JSON";

    constructor(private localDb: LocalStorageHelper,private eventService:EventService) {

    }

    updateNotification() {
        var connection = navigator.connection.type;
        console.log(connection);
        if(connection == "none"){
            console.log("notOnline");
            this.eventService.sendEvent(NoInternet);
        }
        else {
            var that = this;
            $.getJSON(this.notificationLink, {
                format: "json"
            }).done(function (data) {
                var notification: Notification = data

                var appVersion = that.localDb.getAppVersion();
                if (notification.appVersion > appVersion) {
                    notification.message.unread = true;
                    that.localDb.saveAppVersion(notification.appVersion);
                    that.localDb.saveMessage(notification.message);
                    that.localDb.saveSchoolFreeDay(notification.schoolDayFreeFrom, notification.schoolDayFreeTo);

                    var appVersionEvent = new AppVersionUpdated();
                    appVersionEvent.appVersion = notification.appVersion;
                    appVersionEvent.timetableVersion = notification.timetableVersion;
                    appVersionEvent.schoolFreeDayFrom = notification.schoolDayFreeFrom;
                    appVersionEvent.schoolFreeDayTo = notification.schoolDayFreeTo;
                    appVersionEvent.message = notification.message;
                    console.log("appVersion change");
                    that.eventService.sendEvent(AppVersionUpdated, appVersionEvent);
                }
                else {
                    console.log("Not app version changes")
                    that.eventService.sendEvent(NoInternet);
                }
            });
        }
    }

    saveMessage(message:Message){
        this.localDb.saveMessage(message);
    }

    getAppVersion(): number {
        var appVersion= this.localDb.getAppVersion();
        return appVersion;
    }

    getMessage(): Message {
        var message: Message = this.localDb.getMessage();
        return message;
    }

}