export enum DB_COLLECTION  {
  localDocs="localDocs",
  users="users"
}

export type LOCAL_DOCS_TYPE = {
    docTitle:string,
    ownerId:string,
    htmlContent:string
}

export type USER_TYPE = {
    docs:string[],
    email:string,
    employeeId:string,
    name:string,
}