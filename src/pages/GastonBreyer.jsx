import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../firebase/StorageFunctions";
import TextInput from "../components/TextInput";
import ImageBox from "../components/ImageBox";

export default function GastonBreyer() {
  const [breyer, setBreyer] = useState({
    header1: "",
    text1: "",
    img1: "",
    text2: "",
    img2: "",
    img3: "",
    text3: "",
    text4: "",
    mail: "",
    callout: "",
    imgURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null);
  const [backupBreyer, setBackupBreyer] = useState(null);
  const [imageFile, setImageFile] = useState({
    imgURL: null,
    img1: null,
    img2: null,
    img3: null,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "breyer"), (snapshot) => {
      if (!snapshot.empty) {
        const breyerDoc = snapshot.docs[0];
        setBreyer(breyerDoc.data());
        setBackupBreyer(breyerDoc.data()); // Store original data in backup
        setDocId(breyerDoc.id);
      } else {
        console.error("No breyer document found!");
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle text change
  const handleTextChange = (field, value) => {
    setBreyer((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image selection
  const handleImageChange = (e, field) => {
    if (e.target.files[0]) {
      setImageFile((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  // Upload images and update URLs in state
  const handleImageUpload = async () => {
    const updatedFields = {};

    for (let [field, file] of Object.entries(imageFile)) {
      if (file) {
        try {
          const downloadURL = await uploadImage(file, "breyer", (progress) => {
            console.log(`Upload for ${field} is ${progress}% done`);
          });
          updatedFields[field] = downloadURL; // Save new URL
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }
    setBreyer((prev) => ({ ...prev, ...updatedFields })); // Update state with new URLs
    setImageFile({ imgURL: null, img1: null, img2: null, img3: null }); // Reset image files
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    if (docId) {
      try {
        await updateDoc(doc(db, "breyer", docId), breyer); // Save all fields to Firestore
        setIsEditing(false);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  // Cancel edits and revert to backup data
  const handleCancelEdit = () => {
    setBreyer(backupBreyer); // Revert to backup data
    setImageFile({ imgURL: null, img1: null, img2: null, img3: null }); // Clear selected image files
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="pagina">
      <img src={breyer.imgURL} className="foto-principal" />
      <div className="edit-controls">
        {!isEditing ? (
          <button onClick={() => setIsEditing(true)}>Editar</button>
        ) : (
          <>
            <button onClick={handleSaveChanges}>Guardar cambios</button>
            <button onClick={handleCancelEdit}>Cancelar</button>
          </>
        )}
      </div>
      {isEditing ? (
        <div className="content-box">
          <ImageBox
            bbddImg={breyer.imgURL}
            editableImg="imgURL"
            handleImageChange={handleImageChange}
            handleImageUpload={handleImageUpload}
          />
          <ImageBox
            bbddImg={breyer.img1}
            editableImg="img1"
            handleImageChange={handleImageChange}
            handleImageUpload={handleImageUpload}
          />
          <ImageBox
            bbddImg={breyer.img2}
            editableImg="img2"
            handleImageChange={handleImageChange}
            handleImageUpload={handleImageUpload}
          />
          <ImageBox
            bbddImg={breyer.img3}
            editableImg="img3"
            handleImageChange={handleImageChange}
            handleImageUpload={handleImageUpload}
          />
          <TextInput
            value={breyer.header1}
            onChangeText={(value) => handleTextChange("header1", value)}
          />
          <TextInput
            value={breyer.text1}
            onChangeText={(value) => handleTextChange("text1", value)}
            multiline
            numberOfLines={4}
          />
          <TextInput
            value={breyer.callout}
            onChangeText={(value) => handleTextChange("callout", value)}
            multiline
            numberOfLines={2}
          />

          <TextInput
            value={breyer.text2}
            onChangeText={(value) => handleTextChange("text2", value)}
            multiline
            numberOfLines={4}
          />

          <TextInput
            value={breyer.text3}
            onChangeText={(value) => handleTextChange("text3", value)}
            multiline
            numberOfLines={2}
          />
          <TextInput
            value={breyer.text4}
            onChangeText={(value) => handleTextChange("text4", value)}
            multiline
            numberOfLines={2}
          />
          <TextInput
            value={breyer.mail}
            onChangeText={(value) => handleTextChange("mail", value)}
          />
        </div>
      ) : (
        <>
          <h1>{breyer.header1}</h1>
          <div className="formato">
            <div className="doble-division">
              <p style={{ textAlign: "left", marginRight: "5rem" }}>
                {breyer.text1}
              </p>
              <img src={breyer.img1} className="img-format-s" />
            </div>
            <div className="callout">{breyer.callout}</div>
            <div className="doble-division">
              <img src={breyer.img2} className="img-format-l" />
              <p style={{ marginLeft: "5rem" }}>{breyer.text2}</p>
            </div>
            <img src={breyer.img3} style={{ width: "40%" }} />
            <p style={{ textAlign: "center" }}>{breyer.text3}</p>
            <p style={{ textAlign: "center" }}>
              {breyer.text4}
              <a
                href={`mailto:${breyer.mail}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <strong> {breyer.mail}</strong>
              </a>
            </p>
          </div>
        </>
      )}
    </div>
  );
}
