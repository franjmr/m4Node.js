export interface M4LogonResult {
    getToken():string
    getLogonStatus():number            		
    getLogonStatusAsString():string	
    getRoleId():string
    getOrganizationId():string	
    getRoles():any[]
}