import { IEvent } from "./IEvent";

export class LocationChanged implements IEvent{
    location:string;
    constructor(location:string){
        this.location = location;
    }
}