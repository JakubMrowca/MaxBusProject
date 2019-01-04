import { Stop } from "./Stop";

export class Course{
    public direction:string;
    public legends:string;
    public firstStop:Stop;
    public courseFirstStop:Stop;
    public stops:Array<Stop>;
    public traficIsCalculate:Boolean;
    public isTelesfor:Boolean;

    constructor(){
        this.stops = new Array<Stop>();
    }
}
