/**
 * Test file for when I need to register commands quickly in my test server
 * "npm run register" runs this file
 */

import * as dotenv from "dotenv";
dotenv.config();
import { slashRegister } from "./slashRegistry";

const medlandID = "845215682198896661";

slashRegister(medlandID);

console.log("Registered Commands!");