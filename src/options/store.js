import { BehaviorSubject } from "rxjs";

export const optionStore = new BehaviorSubject({
  running: false,
  cylinder: {},
});
