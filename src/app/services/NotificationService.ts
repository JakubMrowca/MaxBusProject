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
                    that.localDb.saveAppVersion(notification.appVersion);
                    that.localDb.saveMessage(notification.message);
                    that.localDb.saveSchoolFreeDay(notification.schoolDayFreeFrom, notification.schoolDayFreeTo);

                    that.appVersionEvent.appVersion = notification.appVersion;
                    that.appVersionEvent.timetableVersion = notification.timetableVersion;
                    that.appVersionEvent.schoolFreeDayFrom = notification.schoolDayFreeFrom;
                    that.appVersionEvent.schoolFreeDayTo = notification.schoolDayFreeTo;
                    that.appVersionEvent.sendEvent();
                }
                else {
                    that.internetEvent.sendEvent();
                }
            });
        }
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