import {IDatesToHour} from "./dates-to-hour";
import {ILocation} from "./location";

export interface IHour {
    id:string,
    location: ILocation,
    locationId:string,
    startHour: Date,
    endHour: Date,
    courseName: string,
    datesToHour: IDatesToHour[],
}
