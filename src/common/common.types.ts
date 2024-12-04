export enum DB_COLLECTION {
  localDocs = "localDocs",
  users = "users",
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
};

export type USER_TYPE = {
  docs: string[];
  email: string;
  employeeId: string;
  name: string;
};
