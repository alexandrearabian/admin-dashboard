import { useEffect, useState } from "react";
import { db } from "../firebase/FirebaseConfig";
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";
import TextInput from "../components/TextInput"; // Import the new TextInput component

export default function Contacto() {
  const [contacto, setContacto] = useState({
    header1: "",
    text1: "",
    header2: "",
    mapURL: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [docId, setDocId] = useState(null);
  const [backupContacto, setBackupContacto] = useState(null);

  // Fetch data from Firestore
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "contacto"), (snapshot) => {
      if (!snapshot.empty) {
        const contactDoc = snapshot.docs[0];
        setContacto(contactDoc.data());
        setBackupContacto(contactDoc.data());
        setDocId(contactDoc.id);
      } else {
        console.error("No contact document found!");
      }
    });

    return () => unsubscribe();
  }, []);

  // Unified change handler for TextInput
  const handleInputChange = (fieldName, value) => {
    setContacto((prev) => ({ ...prev, [fieldName]: value }));
  };

  // Save changes to Firestore
  const handleSaveChanges = async () => {
    if (docId) {
      try {
        await updateDoc(doc(db, "contacto", docId), {
          header1: contacto.header1,
          text1: contacto.text1,
          header2: contacto.header2,
          mapURL: contacto.mapURL,
        });
        setIsEditing(false);
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating document:", error);
      }
    }
  };

  const handleCancelEdit = () => {
    setContacto(backupContacto);
    setIsEditing(false);
  };

  return (
    <div style={{ width: "100vw" }}>
      {isEditing ? (
        <div style={{ width: "100vw", marginTop: "10rem" }}>
          <TextInput
            value={contacto.header1}
            onChange={(value) => handleInputChange("header1", value)}
            placeholder="Header 1"
          />

          <TextInput
            value={contacto.text1}
            onChange={(value) => handleInputChange("text1", value)}
            placeholder="Text 1"
          />

          <TextInput
            value={contacto.header2}
            onChange={(value) => handleInputChange("header2", value)}
            placeholder="Header 2"
          />
        </div>
      ) : (
        <div style={{ width: "100vw", marginTop: "10rem" }}>
          <h1>{contacto.header1}</h1>
          <div
            style={{ textAlign: "center" }}
            dangerouslySetInnerHTML={{ __html: contacto.text1 }}
          />
          <h1>{contacto.header2}</h1>
        </div>
      )}

      <div style={{ margin: "3rem 6rem" }}>
        <iframe
          src={contacto.mapURL}
          width="100%"
          height="600px"
          style={{ border: 0 }}
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
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
    </div>
  );
}
