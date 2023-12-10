import {IDatesToHour} from "./dates-to-hour";
import {ILocation} from "./location";

export interface IHour {
    id:string,
    location: ILocation,
    locationId:string,
    startHour: string,
    endHour: string,
    datesToHour: IDatesToHour[]
}
