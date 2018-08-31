import { Injectable } from "@angular/core";
import { HttpHeaders, HttpClient } from "../../../node_modules/@angular/common/http";
import { Observable } from "../../../node_modules/rxjs";

const httpOptions = {
    headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'my-auth-token'
    })
};

@Injectable()
export class BusLocationServices {

    constructor(private http: HttpClient) {

    }

    getLocation(data): Observable<any>{
        return this.http.post<void>("http://solidarnosclukowica.pl/MaxBus/getLocation.php",data,httpOptions)
    }

    insertLocation(command:any): Observable<void>{
        return this.http.post<void>("http://solidarnosclukowica.pl/MaxBus/insertLocation.php",command,httpOptions)
    }

}