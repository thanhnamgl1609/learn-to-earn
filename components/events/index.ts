import { Web3Dependencies } from "@_types/hooks";
import * as courseEvents from './courses';

export const setupEvents = (deps: Web3Dependencies) => {
  courseEvents.addClassCreatedEvent(deps);
}

export const removeEvents = (deps: Web3Dependencies) => {
  courseEvents.removeEvents(deps);
}
