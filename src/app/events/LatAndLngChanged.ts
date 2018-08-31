import { IEvent } from "./IEvent";

export class LatAndLngChanged implements IEvent
{
    constructor(lat,lng){
        this.lat = lat;
        this.lng = lng;
    }
    lat:number;
    lng:number;
}