import { M4NodeJS } from "../m4nodejs";

const server:string = "http://jonsnow:13020";
const user:string = "JCM_ESS";
const pass:string = "123";

/**
 * Load and get all detail cookies from M4Nodejs instance
 */
async function exampleDebugCookies():Promise<void> {
  const m4NodeJS: M4NodeJS = new M4NodeJS(server, user, pass);
  await m4NodeJS.load();
  await m4NodeJS.logon();
  m4NodeJS.debug.getCookieStore().getAllCookies((error, cookies) => {
    console.log("Total cookies loaded:" + cookies.length);
    cookies.forEach((cookie) => {
      console.log(
        " > Id: ".concat(cookie.key).concat(" - Value: ").concat(cookie.value)
      );
    });
  });

  await m4NodeJS.logout();

  console.log("All done!");
}

exampleDebugCookies();
