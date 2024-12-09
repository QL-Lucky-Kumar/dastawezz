export enum DB_COLLECTION {
  localDocs = "localDocs",
  users = "users",
}

export enum QUERY_DOC_TYPE {
    edit="edit",
    new="new"
}

export enum OPERATION_TYPE {
    delete="delete",
    add="add"
}

//More stuff will me added for tracking doc purposes in future
export type CHANGE_LOG = {
  userId: string;
  time: string;
};

export type LOCAL_DOCS_TYPE = {
  docTitle: string;
  createdBy: string;
  htmlContent: string;
  changeLogs?: CHANGE_LOG[];
  id?:string
};

export type USER_TYPE = {
  docs?: string[];
  email: string;
  qlId?: string;
  name: string;
};

export type AFFECTED_DOC_TYPE = {
  docId:string,
  operationsType:OPERATION_TYPE,
  docCollection:DB_COLLECTION
}