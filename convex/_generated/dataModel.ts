import type { DocumentByName } from "convex/server";
import type { GenericId } from "convex/values";
import type { DataModel as ServerDataModel } from "./server";

export type DataModel = ServerDataModel;
export type TableNames = keyof DataModel & string;
export type Doc<TableName extends TableNames> = DocumentByName<DataModel, TableName>;
export type Id<TableName extends TableNames> = GenericId<TableName>;
