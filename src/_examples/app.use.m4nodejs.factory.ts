import { M4NodeJS } from "../m4nodejs";
import { M4NodeJsFactory } from "..";

const server:string = "http://jonsnow:13020";

/**
 * Use M4Node.js factory to create a new instance (Loads M4JSAPI automatically)
 */
async function exampleM4NodejsFactory():Promise<void> {
    const m4NodeJS:M4NodeJS = await M4NodeJsFactory.newInstance(server);

    const apiUrl:string = m4NodeJS.base.getApiUrl();
    console.log("Api URL: ".concat(apiUrl));

    console.log("All done!");
}

exampleM4NodejsFactory();