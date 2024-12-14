import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from "../firebase/StorageFunctions";
import ImageBox from "../components/ImageBox";
import TextInput from "../components/TextInput";

export default function NuestroEspacio() {
  const [espacio, setEspacio] = useState({
    header1: "",
    text1: "",
    img1: "",
    img2: "",
    img3: "",
    img4: "",
    img5: "",
    img6: "",
    imgURL: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null);
  const [backupEspacio, setBackupEspacio] = useState(null);
  const [imageFile, setImageFile] = useState({
    imgURL: null,
    img1: null,
    img2: null,
    img3: null,
    img4: null,
    img5: null,
    img6: null,
  });

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "espacio"), (snapshot) => {
      if (!snapshot.empty) {
        const espacioDoc = snapshot.docs[0];
        setEspacio(espacioDoc.data());
        setBackupEspacio(espacioDoc.data()); // Store original data in backup
        setDocId(espacioDoc.id);
      } else {
        console.error("No espacio document found!");
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  // Handle text change
  const handleTextChange = (field, value) => {
    setEspacio((prev) => ({ ...prev, [field]: value }));
  };

  // Handle image selection
  const handleImageChange = (e, field) => {
    if (e.target.files[0]) {
      setImageFile((prev) => ({ ...prev, [field]: e.target.files[0] }));
    }
  };

  const handleImageSelect = (field) => {
    setEspacio((prev) => ({ ...prev, imgURL: prev[field] }));
  };

  // Upload images and update URLs in state
  const handleImageUpload = async () => {
    const updatedFields = {};

    for (let [field, file] of Object.entries(imageFile)) {
      if (file) {
        try {
          const downloadURL = await uploadImage(file, "espacio", (progress) => {
            console.log(`Upload for ${field} is ${progress}% done`);
          });
          updatedFields[field] = downloadURL; // Save new URL
        } catch (error) {
          console.error(`Error uploading ${field}:`, error);
        }
      }
    }

    setEspacio((prev) => ({ ...prev, ...updatedFields })); // Update state with new URLs
    setImageFile({
      imgURL: null,
      img1: null,
      img2: null,
      img3: null,
      img4: null,
      img5: null,
      img6: null,
    }); // Reset image files
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    if (docId) {
      try {
        await updateDoc(doc(db, "espacio", docId), espacio); // Save all fields to Firestore
        setIsEditing(false);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  // Cancel edits and revert to backup data
  const handleCancelEdit = () => {
    setEspacio(backupEspacio); // Revert to backup data
    setImageFile({
      imgURL: null,
      img1: null,
      img2: null,
      img3: null,
      img4: null,
      img5: null,
      img6: null,
    }); // Clear selected image files
    setIsEditing(false); // Exit edit mode
  };

  return (
    <div className="pagina-dark">
      <img src={espacio.imgURL} alt="Principal" className="foto-principal" />

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
              handleImageChange={handleImageChange}
              handleImageUpload={handleImageUpload}
              editableImg="imgURL"
              bbddImg={espacio.imgURL}
            />

            {/* Editable Header */}
            <TextInput
              value={espacio.header1}
              onChange={(value) => handleTextChange("header1", value)}
              placeholder="Edit header"
            />

            {/* Editable Text 1 */}
            <TextInput
              value={espacio.text1}
              onChange={(value) => handleTextChange("text1", value)}
              placeholder="Edit text 1"
              multiline={true}
              rows={4}
            />

            {/* Editable Images */}
            {["img1", "img2", "img3", "img4", "img5", "img6"].map(
              (field, idx) => (
                <ImageBox
                  key={idx}
                  handleImageChange={handleImageChange}
                  handleImageUpload={handleImageUpload}
                  editableImg={field}
                  bbddImg={espacio[field]}
                />
              )
            )}
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              paddingBottom: "2rem",
            }}
          >
            <h1>{espacio.header1}</h1>
            <p>{espacio.text1}</p>

            <div className="fotos">
              {["img1", "img2", "img3", "img4", "img5", "img6"].map(
                (field, idx) => (
                  <div key={idx} onClick={() => handleImageSelect(field)}>
                    <img src={espacio[field]} className="foto-preview" />
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
