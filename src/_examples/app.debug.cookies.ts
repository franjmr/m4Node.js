import { M4NodeJS } from "../m4nodejs";

const server = "http://jonsnow:13020";
const user = "JCM_ESS";
const pass = "123";

async function example(){
    const m4NodeJS = new M4NodeJS(server,user,pass);
    await m4NodeJS.load();
    await m4NodeJS.logon();
    m4NodeJS.debug.getCookieStore().getAllCookies((error,cookies) =>{
        console.log("Total cookies loaded:"+ cookies.length);
        cookies.forEach((cookie) => {
            console.log(" > Id: ".concat(cookie.key).concat(" - Value: ").concat(cookie.value));
        });
    }); 
    
    await m4NodeJS.logout();

    console.log("All done!");
}

example();