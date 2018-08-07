import { Observable, Subject } from 'rxjs';
import { Injectable } from '@angular/core';
import { IEvent } from './IEvent';

@Injectable()
export class TimetableVersionChanged implements IEvent {
}