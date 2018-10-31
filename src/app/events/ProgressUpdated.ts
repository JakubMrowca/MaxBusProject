import { IEvent } from "./IEvent";

export class ProgressUpdated implements IEvent
{

    constructor(public progress:number){

    }
}
