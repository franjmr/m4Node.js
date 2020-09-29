import { M4Node } from "../m4Interfaces/M4Node";
import { M4NodeJS } from "../m4nodejs";
import { M4Request } from "../m4Interfaces/M4Request";
import { Observable } from "rxjs";
import { M4Object } from "../m4Interfaces/M4Object";

const server:string = "http://jonsnow:13020";
const user:string = "JCM_ESS";
const pass:string = "123";

/**
 * Use Rxjs Observables to detect node item changes 
 */
async function exampleObservables():Promise<void> {
  const m4NodeJS = new M4NodeJS(server, user, pass);

  await m4NodeJS.load();
  await m4NodeJS.logon();
  await m4NodeJS.loadMetadata(["PLCO_LOAD_ALL_PERSONAL_INFO"]);

  const requestResult: M4Request = await m4NodeJS.executeMethod(
    "PLCO_LOAD_ALL_PERSONAL_INFO",
    "PLCO_PERSONAL_EMPLOYEE_INFORMT",
    "PLCO_LOAD_ALL_PERSONAL_INFO",
    ["", "", ""]
  );

  const m4Object: M4Object = requestResult.getObject();
  const m4Node: M4Node = m4Object.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
  const m4EmployeName: string = m4Node.getValue("PSCO_EMPLOYEE_NAME");

  console.log("Employe Name before subscribe: " + m4EmployeName);

  const m4NodeObservable: Observable<any> = m4NodeJS.rxjs.createObservableByNodeItemChanged(
    m4Node
  );
  m4NodeObservable.subscribe({
    next(node: M4Node) {
      console.log(
        "Observale - New Employe name: " + node.getValue("PSCO_EMPLOYEE_NAME")
      );
    },
    error(err) {
      console.error("Observale - something wrong occurred: " + err);
    },
    complete() {
      console.log("Observale is done!");
    },
  });

  m4Node.setValue("PSCO_EMPLOYEE_NAME", "Jin Kazama");

  await m4NodeJS.logout();

  console.log("All done!");
}

exampleObservables();
