import { M4ApiNode } from "./m4apiNode";
import fs from 'fs';
import path from 'path';
import { Subject} from "rxjs";

export class TestUtils {

    /**
     * Create xml file with the M4Object metadata definition
     * @param {string} server 
     * @param {string} user 
     * @param {string} pass 
     * @param {string} m4objectId M4Object ID
     * @param {string} filepath Absolute directory path
     */
    async createXmlMetadataFile(server: string, user: string, pass :string, m4objectId: string, filepath: string): Promise<void> {
        if(!fs.existsSync(filepath )){
            throw new Error("Destination directory does not exist. Check path: '"+ filepath +"'");
        }
        
        fs.access(filepath , fs.constants.W_OK, (err) => {
            if(err){
                throw new Error("No write permissions on the destination directory. Check path: '"+ filepath +"'");
            }
        });

        const m4ApiNode = new M4ApiNode(server,user,pass);
        await m4ApiNode.initializeAsync();
        const logonResult = await m4ApiNode.logon();

        if(!logonResult || !logonResult.getToken()) {
            throw new Error("You must be authenticated to create XML Metadata!");
        }

        const subject = new Subject();
        const m4window = m4ApiNode.__getWindowObject__();
        const oldXHROpen = m4window.XMLHttpRequest.prototype.open;

        m4window.XMLHttpRequest.prototype.open = function() {
            this.addEventListener('load', function(pEvent) {
                if(pEvent && pEvent.target && pEvent.target.m4jsapiURL){
                    const _url : string = pEvent.target.m4jsapiURL;
                    if(_url.includes("/metadata/md/")){
                        const _xmlFilePath = path.join(filepath, m4objectId + ".xml");
                        fs.writeFile(_xmlFilePath, this.responseText, (err) => {
                            if (err) {
                                throw new Error(err.message);
                            }
                            subject.next({id:m4objectId, xmlFilePath: _xmlFilePath});
                        });
                    }
                }
            });
        
            return oldXHROpen.apply(this, arguments);
        }
        
        await m4ApiNode.loadMetadata([m4objectId]);

        subject.subscribe(async (value: { id:string, xmlFilePath:string} )=>{
            console.log("M4Object: "+value.id+" > XML Metadata file created in '"+value.xmlFilePath+"'");
            await m4ApiNode.logout();
        })
    }
}