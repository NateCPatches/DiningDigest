// Reference:
import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
export default app;

// File: `src/components/CsvUploader.jsx`
import React, { useState } from "react";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { storage, db } from "../config/firebase";

export default function CsvUploader() {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
    setProgress(0);
    setStatus("");
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setStatus("No file selected");
      return;
    }
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setStatus("Please select a .csv file");
      return;
    }

    try {
      const path = `csv-uploads/${Date.now()}_${file.name}`;
      const storageRef = ref(storage, path);
      const uploadTask = uploadBytesResumable(storageRef, file, { contentType: "text/csv" });

      setStatus("Uploading...");
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const pct = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
          setProgress(pct);
        },
        (error) => {
          setStatus("Upload failed: " + error.message);
        },
        async () => {
          const url = await getDownloadURL(uploadTask.snapshot.ref);
          await addDoc(collection(db, "uploads"), {
            name: file.name,
            size: file.size,
            storagePath: path,
            downloadURL: url,
            uploadedAt: serverTimestamp()
          });
          setStatus("Upload complete");
          setFile(null);
        }
      );
    } catch (err) {
      setStatus("Error: " + err.message);
    }
  };

  return (
    <div>
      <h2>Upload your CSV File</h2>
      <form onSubmit={onSubmit}>
        <input
          type="file"
          id="csv-select"
          name="csv-select"
          accept=".csv,text/csv"
          onChange={onFileChange}
        />
        <br />
        <button type="submit">Begin</button>
      </form>

      {progress > 0 && <div>Progress: {progress}%</div>}
      {status && <div>{status}</div>}
    </div>
  );
}
