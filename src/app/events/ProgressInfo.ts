import { IEvent } from "./IEvent";

export class ProgressInfo implements IEvent
{
    constructor(public message:string){
    }
}