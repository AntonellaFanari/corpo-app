import { Class } from "./class";

export class Plan {
    id: number;
    name: string;
    credits: number;
    price: number;
    type: number;
    classes: Class[]=[];
  }
  