import { M4NodeJS } from "../m4nodejs";

const server:string = "http://jonsnow:13020";

/**
 * Use M4Node.js constructor to create a new instance (NOT Loads M4JSAPI automatically)
 */
async function exampleM4NodejsConstructor():Promise<void> {
    const m4NodeJS:M4NodeJS = new M4NodeJS(server);
    await m4NodeJS.load();

    const apiUrl:string = m4NodeJS.base.getApiUrl();
    console.log("Api URL: ".concat(apiUrl));

    console.log("All done!");
}

exampleM4NodejsConstructor();