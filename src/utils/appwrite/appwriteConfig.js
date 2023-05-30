//libs
import { Client, Account, Databases, ID } from "appwrite";
import { dbIdMappings } from "./dbMapping";
const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("647397b32af423f24577");

export const account = new Account(client);

//Databases
export const databases = new Databases(client);

export const getUniqueId = () => ID.unique();
