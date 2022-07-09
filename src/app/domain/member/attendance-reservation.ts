import { Status } from "../attendance";
import { ShiftList } from "../shift-list";


export class AttendanceReservation {
  id: number;
  dayShift: string;
  shiftId: number;
  status: Status;
  shift: ShiftList
}
