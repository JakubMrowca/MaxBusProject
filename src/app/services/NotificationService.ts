import * as $ from 'jquery';
import { Injectable } from '@angular/core';
import { Notification } from '../models/Notification';
import { Message } from '../models/Message';
import { LocalStorageHelper } from '../helpers/LocalStorageHelper';
import { EventService } from './EventServices';
import { AppVersionUpdated } from '../events/AppVersionUpdated';
import { TagPlaceholder } from '@angular/compiler/src/i18n/i18n_ast';
import { NoInternet } from '../events/NoInternet';

@Injectable()
export class NotificationService {

    notificationLink: string = "https://raw.githubusercontent.com/metinowy15/MaksBusApi/master/notification.JSON";

    constructor(private localDb: LocalStorageHelper, private internetEvent: NoInternet, private appVersionEvent: AppVersionUpdated) {

    }

    updateNotification() {
        if (!navigator.onLine) {
            console.log("notOnline");
            this.internetEvent.sendEvent();
            
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

                    that.appVersionEvent.appVersion = notification.appVersion;
                    that.appVersionEvent.timetableVersion = notification.timetableVersion;
                    that.appVersionEvent.schoolFreeDayFrom = notification.schoolDayFreeFrom;
                    that.appVersionEvent.schoolFreeDayTo = notification.schoolDayFreeTo;
                    that.appVersionEvent.message = notification.message;
                    console.log("appVersion change");
                    that.appVersionEvent.sendEvent();
                }
                else {
                    console.log("Not app version changes")
                    that.internetEvent.sendEvent();
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