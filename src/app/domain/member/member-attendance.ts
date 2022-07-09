import { Status } from "../attendance";

export class MemberAttendance {
  id: number;
  memberId: number;
  name: string;
  remainingCredit: number;
  expiration: string;
  creditId: number;
  status: Status
}
