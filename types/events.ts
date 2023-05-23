import { Web3Dependencies } from "./hooks"

export type AddEvent = {
  (deps: Web3Dependencies): void;
}
