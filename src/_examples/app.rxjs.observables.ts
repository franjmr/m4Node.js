import { M4Node }  from "../m4Interfaces/M4Node"
import { M4NodeJS } from "../m4nodejs";

const server = "http://jonsnow:13020";
const user = "JCM_ESS";
const pass = "123";

async function example(){
    const m4NodeJS = new M4NodeJS(server,user,pass);

    await m4NodeJS.load();
    await m4NodeJS.logon();
    await m4NodeJS.loadMetadata(['PLCO_LOAD_ALL_PERSONAL_INFO']);

    const requestResult = await m4NodeJS.executeMethod("PLCO_LOAD_ALL_PERSONAL_INFO", "PLCO_PERSONAL_EMPLOYEE_INFORMT", "PLCO_LOAD_ALL_PERSONAL_INFO", ["","",""]);

    const m4node = requestResult.getObject().getNode("PSCO_EMPLOYEE_RECORD_HEADER");
    const m4NodeObservable = m4NodeJS.rxjs.createObservableByNodeItemChanged(m4node);
    const m4EmployeName = m4node.getValue("PSCO_EMPLOYEE_NAME");

    console.log('EMPLOYE NAME before subscribe: '+m4EmployeName);

    m4NodeObservable.subscribe({
        next(node:M4Node) { console.log('Observale - New value: ' + node.getValue("PSCO_EMPLOYEE_NAME")); },
        error(err) { console.error('Observale - something wrong occurred: ' + err); },
        complete() { console.log('Observale - done'); }
    });

    console.log('EMPLOYE NAME after subscribe...');
    m4node.setValue("PSCO_EMPLOYEE_NAME","Jin Kazama");

    await m4NodeJS.logout();

    console.log("All done!")
}

example();