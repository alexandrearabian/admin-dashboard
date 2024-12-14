import Premios from "../components/Premios";
import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../firebase/StorageFunctions";
import ImageBox from "../components/ImageBox";
import TextInput from "../components/TextInput";

export default function TadronEsTeatro() {
  const [tadron, setTadron] = useState({
    header1: "",
    text1: "",
    img1: "",
    text2: "",
    img2: "",
    callout: "",
    imgURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null);
  const [backupTadron, setBackupTadron] = useState(null);
  const [imageFile, setImageFile] = useState({
    imgURL: null,
    img1: null,
    img2: null,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "tadron"), (snapshot) => {
      if (!snapshot.empty) {
        const tadronDoc = snapshot.docs[0];
        setTadron(tadronDoc.data());
        setBackupTadron(tadronDoc.data()); // Store original data in backup
        setDocId(tadronDoc.id);
      } else {
        console.error("No tadron document found!");
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle text change
  const handleTextChange = (field, value) => {
    setTadron((prev) => ({ ...prev, [field]: value }));
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
          const downloadURL = await uploadImage(file, "tadron", (progress) => {
            console.log(`Upload for ${field} is ${progress}% done`);
          });
          updatedFields[field] = downloadURL; // Save new URL
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }
    setTadron((prev) => ({ ...prev, ...updatedFields })); // Update state with new URLs
    setImageFile({ imgURL: null, img1: null, img2: null }); // Reset image files
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    if (docId) {
      try {
        await updateDoc(doc(db, "tadron", docId), tadron); // Save all fields to Firestore
        setIsEditing(false);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  // Cancel edits and revert to backup data
  const handleCancelEdit = () => {
    setTadron(backupTadron); // Revert to backup data
    setImageFile({ imgURL: null, img1: null, img2: null }); // Clear selected image files
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="pagina">
      <img src={tadron.imgURL} alt="Principal" className="foto-principal" />
      <div className="formato">
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
              bbddImg={tadron.imgURL}
              editableImg="imgURL"
              handleImageChange={handleImageChange}
              handleImageUpload={handleImageUpload}
            />

            <TextInput
              value={tadron.header1}
              onChangeText={(value) => handleTextChange("header1", value)}
            />

            <TextInput
              value={tadron.text1}
              onChangeText={(value) => handleTextChange("text1", value)}
              multiline
              rows={4}
              placeholder="Edit text 1"
            />

            <ImageBox
              bbddImg={tadron.img1}
              editableImg="img1"
              handleImageChange={handleImageChange}
              handleImageUpload={handleImageUpload}
            />

            <TextInput
              value={tadron.callout}
              onChangeText={(value) => handleTextChange("callout", value)}
              multiline
              rows={2}
              placeholder="Edit callout"
            />

            <ImageBox
              bbddImg={tadron.img2}
              editableImg="img2"
              handleImageChange={handleImageChange}
              handleImageUpload={handleImageUpload}
            />

            <TextInput
              value={tadron.text2}
              onChangeText={(value) => handleTextChange("text2", value)}
              multiline
              rows={4}
              placeholder="Edit text 2"
            />
          </div>
        ) : (
          <>
            <h1>{tadron.header1}</h1>
            <div className="doble-division">
              <p style={{ textAlign: "left", marginRight: "5rem" }}>
                {tadron.text1}
              </p>
              <img src={tadron.img1} className="img-format-s" />
            </div>
            <div className="callout">{tadron.callout}</div>
            <div className="doble-division">
              <img src={tadron.img2} className="img-format-l" />
              <p style={{ textAlign: "left", marginLeft: "5rem" }}>
                {tadron.text2}
              </p>
            </div>
          </>
        )}
      </div>
      <Premios />
    </div>
  );
}
