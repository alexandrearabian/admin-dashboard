import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../firebase/StorageFunctions";
import ImageBox from "../components/ImageBox";
import TextInput from "../components/TextInput";

export default function CicloTxJ() {
  const [justicia, setJusticia] = useState({
    header1: "",
    text1: "",
    imgURL: "",
    img1: "",
    text2: "",
    text3: "",
    header2: "",
    text4: "",
    header3: "",
    text5: "",
    text6: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null);
  const [backupJusticia, setBackupJusticia] = useState(null);
  const [imageFile, setImageFile] = useState({ imgURL: null, img1: null });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "justicia"), (snapshot) => {
      if (!snapshot.empty) {
        const justiciaDoc = snapshot.docs[0];
        setJusticia(justiciaDoc.data());
        setBackupJusticia(justiciaDoc.data());
        setDocId(justiciaDoc.id);
      } else {
        console.error("No justicia document found!");
      }
    });
    return () => unsubscribe();
  }, []);

  // Handle text change
  const handleTextChange = (field, value) => {
    setJusticia((prev) => ({ ...prev, [field]: value }));
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
          const downloadURL = await uploadImage(
            file,
            "justicia",
            (progress) => {
              console.log(`Upload for ${field} is ${progress}% done`);
            }
          );
          updatedFields[field] = downloadURL;
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }
    setJusticia((prev) => ({ ...prev, ...updatedFields }));
    setImageFile({ imgURL: null, img1: null });
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    handleImageUpload(); // Upload images first
    if (docId) {
      try {
        await updateDoc(doc(db, "justicia", docId), justicia);
        setIsEditing(false);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  // Cancel edits and revert to backup data
  const handleCancelEdit = () => {
    setJusticia(backupJusticia);
    setImageFile({ imgURL: null, img1: null });
    setIsEditing(false);
  };
  return (
    <>
      <img src={justicia.imgURL} className="foto-principal" />
      {isEditing ? (
        <div className="content-box">
          <div>
            <button onClick={handleSaveChanges}>Guardar Cambios</button>
            <button onClick={handleCancelEdit}>Cancel</button>
          </div>
          <ImageBox
            bbddImg={justicia.imgURL}
            editableImg="imgURL"
            handleImageChange={handleImageChange}
            handleImageUpload={handleImageUpload}
          />

          <TextInput
            value={justicia.header1}
            onChangeText={(value) => handleTextChange("header1", value)}
          />

          <TextInput
            value={justicia.text1}
            onChangeText={(value) => handleTextChange("text1", value)}
          />

          <TextInput
            value={justicia.text2}
            onChangeText={(value) => handleTextChange("text2", value)}
          />

          <TextInput
            value={justicia.text3}
            onChangeText={(value) => handleTextChange("text3", value)}
          />

          <TextInput
            value={justicia.header2}
            onChangeText={(value) => handleTextChange("header2", value)}
          />

          <TextInput
            value={justicia.text4}
            onChangeText={(value) => handleTextChange("text4", value)}
          />

          <TextInput
            value={justicia.header3}
            onChangeText={(value) => handleTextChange("header3", value)}
          />

          <TextInput
            value={justicia.text5}
            onChangeText={(value) => handleTextChange("text5", value)}
          />

          <TextInput
            value={justicia.text6}
            onChangeText={(value) => handleTextChange("text6", value)}
          />
        </div>
      ) : (
        <div>
          <button onClick={() => setIsEditing(true)}>Editar</button>
          <h1>{justicia.header1}</h1>

          <div className="formato">
            <div className="doble-division">
              <p>{justicia.text1}</p>
              <img
                src={justicia.img1}
                style={{
                  width: "30%",
                  marginLeft: "5rem",
                  objectFit: "contain",
                }}
              />
            </div>

            <div className="callout">{justicia.text2}</div>
            <div>{justicia.text3}</div>

            <div className="doble-division">
              <div>
                <h2>{justicia.header2}</h2>
                <div>{justicia.text4}</div>
              </div>
              <div>
                <h2>{justicia.header3}</h2>
                <div>{justicia.text5}</div>
              </div>
            </div>

            <p>{justicia.text6}</p>
          </div>
        </div>
      )}
    </>
  );
}
