import { M4NodeJS } from "../m4nodejs";
import { M4Request } from "../m4Interfaces/M4Request";
import { M4Executor } from "../m4Interfaces/M4Executor";

const server = "http://jonsnow:13020";
const user = "JCM_ESS";
const pass = "123";

const M4_OBJECT_ID = "PLCO_LOAD_ALL_PERSONAL_INFO";
const M4_NODE_ID = "PLCO_PERSONAL_EMPLOYEE_INFORMT";
const M4_METHOD_ID = "PLCO_LOAD_ALL_PERSONAL_INFO";

function _logout(m4Executor: M4Executor): void{
    m4Executor.logout(()=>{
        console.log("All done!");
    },()=>{
        console.log("All done!");
    })
}

async function example(){
    const m4NodeJS = new M4NodeJS(server);
    await m4NodeJS.load();
    
    const _window = m4NodeJS.getWindow();

    _window.meta4.M4Executor.setServiceBaseUrl(server);
    const m4Executor = new _window.meta4.M4Executor();

    m4Executor.logon(user,pass,"2",()=>{
        m4Executor.loadMetadata([M4_OBJECT_ID],()=>{
            const t3js = new _window.meta4.M4Object(M4_OBJECT_ID);
            const args = ["","",""];
            const m4Request = new _window.meta4.M4Request(t3js,M4_NODE_ID, M4_METHOD_ID, args);
            m4Executor.execute(m4Request,(m4RequestSuccess: M4Request)=> {
                const requestObject = m4RequestSuccess.getObject();
                const requestNode = requestObject.getNode("PSCO_EMPLOYEE_RECORD_HEADER");
                const requestNodeValue = requestNode.getValue("PSCO_EMPLOYEE_NAME");
                console.log("Hi "+requestNodeValue+ "!");
                _logout(m4Executor);
            },(m4RequestFailure: M4Request)=> {
                console.log("Error executing request! Detail: "+m4RequestFailure.getErrorMessage());
                _logout(m4Executor);
            })
        },()=>{
            console.log("Error loading metadata!");
            _logout(m4Executor);
        })
    },()=>{
        console.log("Error logon");
    });
}

example();