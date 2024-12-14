import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../firebase/StorageFunctions";
import ImageBox from "../components/ImageBox";
import TextInput from "../components/TextInput";

export default function ProgramaTuEspectaculo() {
  const [programa, setPrograma] = useState({
    header1: "",
    text1: "",
    img1: "",
    text2: "",
    imgURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null);
  const [backupPrograma, setBackupPrograma] = useState(null);
  const [imageFile, setImageFile] = useState({
    imgURL: null,
    img1: null,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "programa"), (snapshot) => {
      if (!snapshot.empty) {
        const programaDoc = snapshot.docs[0];
        setPrograma(programaDoc.data());
        setBackupPrograma(programaDoc.data()); // Store original data in backup
        setDocId(programaDoc.id);
      } else {
        console.error("No programa document found!");
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle text change
  const handleTextChange = (field, value) => {
    setPrograma((prev) => ({ ...prev, [field]: value }));
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
            "programa",
            (progress) => {
              console.log(`Upload for ${field} is ${progress}% done`);
            }
          );
          updatedFields[field] = downloadURL; // Save new URL
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }
    setPrograma((prev) => ({ ...prev, ...updatedFields })); // Update state with new URLs
    setImageFile({ imgURL: null, img1: null }); // Reset image files
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    if (docId) {
      try {
        await updateDoc(doc(db, "programa", docId), programa); // Save all fields to Firestore
        setIsEditing(false);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  // Cancel edits and revert to backup data
  const handleCancelEdit = () => {
    setPrograma(backupPrograma); // Revert to backup data
    setImageFile({ imgURL: null, img1: null }); // Clear selected image files
    setIsEditing(false); // Exit edit mode
  };

  return (
    <>
      <div className="pagina">
        <img src={programa.imgURL} alt="Principal" className="foto-principal" />
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
                bbddImg={programa.imgURL}
                editableImg="imgURL"
                handleImageChange={handleImageChange}
                handleImageUpload={handleImageUpload}
              />

              <TextInput
                value={programa.header1}
                onChangeText={(value) => handleTextChange("header1", value)}
                placeholder="Edit header"
              />

              <TextInput
                value={programa.text1}
                onChangeText={(value) => handleTextChange("text1", value)}
                placeholder="Edit text 1"
                multiline
                rows={4}
              />

              <ImageBox
                bbddImg={programa.img1}
                editableImg="img1"
                handleImageChange={handleImageChange}
                handleImageUpload={handleImageUpload}
              />

              <TextInput
                value={programa.text2}
                onChangeText={(value) => handleTextChange("text2", value)}
                placeholder="Edit text 2"
                multiline
                rows={4}
              />
            </div>
          ) : (
            <>
              <h1>{programa.header1}</h1>
              <p>{programa.text1}</p>
              <img src={programa.img1} style={{ width: "100%" }} />
              <p>
                {programa.text2}
                <a
                  href="mailto:tadronteatro@hotmail.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mail"
                >
                  <strong>tadronteatro@hotmail.com</strong>
                </a>
              </p>
            </>
          )}
        </div>
      </div>
    </>
  );
}
