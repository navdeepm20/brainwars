//libs
import { Client, Account, Databases, ID, Query } from "appwrite";

const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject("647397b32af423f24577");
export const account = new Account(client);
export { client };
//Databases
export const databases = new Databases(client);

export const getUniqueId = () => ID.unique();

export const dbIdMappings = {
  main: "6474f5b1e46fff9d49c8",
};
export const collectionsMapping = {
  game_session: "64763ff90a05163f447c",
  games: "647640695531c7a0dfab",
  rooms: "647a4109bafa10d29c1f",
  gamers: "647b14a97db892ecf839",
  scores: "647b1659eb098ff04c5d",
};
export { Query };
