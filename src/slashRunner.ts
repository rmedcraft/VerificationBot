import * as dotenv from "dotenv";
dotenv.config();
import { slashRegister } from "./slashRegistry";

const medlandID = "845215682198896661";

slashRegister(medlandID);


console.log("Registered Commands!");