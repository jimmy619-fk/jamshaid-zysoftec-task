import { Button } from "@mui/material";
import React, { useState } from "react";
import { storage, db } from "./firebase";
import firebase from "firebase/compat/app";
import "./App.css";
export default function ImageUpload({ username }) {
  const [image, setImage] = useState(null);
  const [progress, setProgress] = useState(0);
  const [caption, setCaption] = useState("");
  const handlechange = (e) => {
    if (e.target.files[0]) {
      // this is because if we select multiple file it will select the first one first
      setImage(e.target.files[0]);
    }
  };
  const handleupload = () => {
    // storage=>access storage in firebase
    //ref(images/image.name) =refer to this folder we create new folder here
    // image.name is file name we selected
    // put(image)=>we are putting the image in image folder
    const uploadtask = storage.ref(`images/${image.name}`).put(image);

    uploadtask.on(
      "state_changed",
      (snapshot) => {
        // progress wala function
        const progress = Math.round(
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100
        );
        setProgress(progress);
      },
      // if anything went wrong during upload
      (error) => {
        // error function
        alert(error.message);
      },
      //   when upload completes
      () => {
        // complete function
        // go to images folder than goto imagename child and get me download url
        // it will upload the image in firebase storage
        // getdownloadurl will get the image from storage
        storage
          .ref("images")
          .child(image.name)
          .getDownloadURL()
          .then((url) => {
            // put images inside db
            // previous we were uploading thingsw manually
            db.collection("posts").add({
              // timestamp is used here to figure out the time the image was uploaded, which is gonna determine the order in which we display the posts (latest at the top)
              timestamp: firebase.firestore.FieldValue.serverTimestamp(),
              caption: caption,
              imageUrl: url,
              username: username,
              imagename: image.name,
            });
            // setprogress to zero after it is done
            // Reset everything once upload process is completed
            setProgress(0);
            setCaption("");
            setImage(null);
          });
      }
    );
  };
  return (
    <div className="imageup_section">
      <div className="contentwala">
        <progress value={progress} max="100"  className="progresswala"/>
        <input
          type="text"
          placeholder="Enter a caption..."
          value={caption}
          onChange={(event) => setCaption(event.target.value)}
        />
        <input type="file" onChange={handlechange} />
        <Button onClick={handleupload}>Upload</Button>
      </div>
    </div>
  );
}

// firebase storage problem aye ge first time
// to solve the problem
// goto firebase project
// goto storage tab
// click on rules
// and paste following code
// service firebase.storage {
//     match /b/{bucket}/o {
//       match /{allPaths=**} {
//         allow read, write: if request.auth != null;
//       }
//     }
//   }
