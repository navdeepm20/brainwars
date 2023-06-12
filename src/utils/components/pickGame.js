import { storage, BUCKET_ID } from "@/utils/appwrite/appwriteConfig";
import { customToast } from "../utils";

export const getRandomAvatarUrl = async () => {
  try {
    const response = await storage.listFiles(BUCKET_ID);
    const files = response.files;
    // console.log(files);
    // Generate a random index within the range of the files array
    const randomIndex = Math.floor(Math.random() * files.length);
    // console.log(randomIndex);
    // Get the randomly selected file
    const randomFile = files[randomIndex];
    // console.log(randomFile);
    // console.log(storage.getFileView(BUCKET_ID, randomFile?.$id)?.href);
    // Perform further operations with the randomly selected file
    return storage.getFileView(BUCKET_ID, randomFile?.$id)?.href;
  } catch (err) {
    customToast(err?.message, "error");
  }
};
