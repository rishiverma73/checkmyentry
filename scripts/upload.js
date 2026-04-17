import { initializeApp } from "firebase/app";
import { getFirestore, doc, setDoc } from "firebase/firestore";
import fs from "fs";
import csv from "csv-parser";

const firebaseConfig = {
   apiKey: "AIzaSyCx81vO8jIeTDUnFJIfDDVnn9y93IqquK8",
  authDomain: "checkmyentry-9044f.firebaseapp.com",
  projectId: "checkmyentry-9044f",
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

fs.createReadStream("students.csv")
  .pipe(csv())
  .on("data", async (row) => {
    const regNo = row.regNo;

    await setDoc(doc(db, "valid_students", regNo), {
      name: row.name,
      status: "unused",
    });

    console.log("Uploaded:", regNo);
  })
  .on("end", () => {
    console.log("All data uploaded!");
  });