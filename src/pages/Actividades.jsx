import React, { useState, useEffect } from "react";
import { db, storage } from "../firebase/FirebaseConfig";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
} from "firebase/firestore";
import {
  uploadImage,
  updateImageInFirestore,
} from "../firebase/StorageFunctions";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import TextInput from "../components/TextInput";
import ImageBox from "../components/ImageBox";
import { height } from "@fortawesome/free-brands-svg-icons/fa42Group";

const Actividades = ({ actividad, datos }) => {
  const formato = {
    imgURL: "",
    header1: "",
  };

  const [newShow, setNewShow] = useState({
    title: "",
    author: "",
    description: "",
    posterUrl: "",
    bookingUrl: "",
  });
  const [actividades, setActividades] = useState({ ...formato });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shows, setShows] = useState([]);
  const [editId, setEditId] = useState(null);
  const [docId, setDocId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [backupActividades, setBackupActividades] = useState(null);
  const MAX_DESCRIPTION_LENGTH = 450;

  useEffect(() => {
    const fetchShows = () => {
      // Create a Firestore query for the 'billboard' collection, ordered by a field (like title or date)
      const q = query(collection(db, actividad), orderBy("title", "asc"));

      // Use onSnapshot to listen for real-time updates to the collection
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const showsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setShows(showsData);
      });

      // Cleanup the listener when the component is unmounted
      return () => unsubscribe();
    };

    fetchShows();
  }, []);

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, datos), (snapshot) => {
      if (!snapshot.empty) {
        const actividadesDoc = snapshot.docs[0]; // Assuming there's only one document
        setActividades(actividadesDoc.data());
        setBackupActividades(actividadesDoc.data()); // Store original data in backup
        setDocId(actividadesDoc.id);
      } else {
        console.error("No actividades document found!");
      }
    });
    return () => unsubscribe(); // Clean up the listener on unmount
  }, []);

  const handleChange = (value, name) => {
    setNewShow({ ...newShow, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleImageUpload = async () => {
    if (imageFile) {
      try {
        const storageRef = ref(storage, `posters/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            const progress =
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => {
            console.error("Error uploading image:", error);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            setActividades((prev) => ({ ...prev, imgURL: downloadURL }));
            setUploadProgress(0);
          }
        );
      } catch (error) {
        console.error("Error uploading image:", error);
      }
    }
  };

  const handleSaveChanges = async () => {
    handleImageUpload(); // Upload image first
    if (docId) {
      try {
        await updateImageInFirestore(datos, docId, actividades.imgURL); // Update Firestore with the new image URL
        await updateDoc(doc(db, datos, docId), {
          header1: actividades.header1,
        });

        setIsEditing(false); // Exit edit mode
        alert("Changes saved successfully!");
      } catch (error) {
        console.error("Error updating Firestore:", error);
      }
    }
  };

  // Update this function to restore the backup image and text correctly
  const handleCancelEdit = () => {
    setActividades(backupActividades); // Revert to backup data
    setImageFile(null); // Clear selected image file
    setIsEditing(false); // Exit edit mode
  };

  const addOrUpdateShow = async (bbdd) => {
    try {
      let posterUrl = newShow.posterUrl;
      if (newShow.description.length <= MAX_DESCRIPTION_LENGTH) {
        if (imageFile) {
          const storageRef = ref(storage, `posters/${imageFile.name}`);
          const uploadTask = uploadBytesResumable(storageRef, imageFile);

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              const progress =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setUploadProgress(progress);
            },
            (error) => console.error("Error uploading image:", error),
            async () => {
              posterUrl = await getDownloadURL(uploadTask.snapshot.ref);
              if (editId) {
                await updateDoc(doc(db, bbdd, editId), {
                  ...newShow,
                  posterUrl,
                });
              } else {
                await addDoc(collection(db, bbdd), { ...newShow, posterUrl });
              }
              resetForm();
            }
          );
        } else {
          if (editId) {
            await updateDoc(doc(db, bbdd, editId), newShow);
          } else {
            await addDoc(collection(db, bbdd), newShow);
          }
          resetForm();
        }
      } else {
        alert("Número de caracteres inválido.");
      }
    } catch (error) {
      console.error("Error adding/updating show:", error);
    }
  };

  const resetForm = () => {
    setNewShow({
      title: "",
      author: "",
      description: "",
      posterUrl: "",
      bookingUrl: "",
    });
    setImageFile(null);
    setUploadProgress(0);
    setEditId(null);
  };

  const handleEdit = (show) => {
    setNewShow(show);
    setEditId(show.id);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this show?")) {
      await deleteDoc(doc(db, actividad, id));
    }
  };

  return (
    <>
      <div className="pagina">
        <img src={actividades.imgURL} className="foto-principal" />
        <div>
          {!isEditing ? (
            <>
              <button onClick={() => setIsEditing(true)}>Editar portada</button>
              <h1>{actividades.header1}</h1>
            </>
          ) : (
            <>
              <div className="edit-zone">
                <input
                  type="text"
                  value={actividades.header1}
                  onChange={(e) =>
                    setActividades((prev) => ({
                      ...prev,
                      header1: e.target.value,
                    }))
                  }
                  className="input-field"
                />
                <div style={{ display: "flex" }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="input-field"
                  />
                </div>
              </div>
              {uploadProgress > 0 && (
                <div className="progress-bar">
                  <div
                    className="progress"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              <button onClick={handleSaveChanges}>Guardar cambios</button>
              <button onClick={handleCancelEdit}>Cancelar</button>
            </>
          )}
        </div>
        <div className="content-box">
          <h2>{editId ? "Editar" : "Publicar actividad"}</h2>

          <img src={newShow.posterUrl} alt={newShow.title} />
          <TextInput
            value={newShow.title} // Pass the controlled value
            onChange={(value) => handleChange(value, "title")} // Pass the handler
            placeholder="Título" // Optional placeholder
          />
          <TextInput
            value={newShow.author}
            onChange={(value) => handleChange(value, "author")}
            placeholder={"Autor/Director"}
          />

          <TextInput
            value={newShow.description}
            onChange={(value) => handleChange(value, "description")}
            placeholder={"Descripción"}
            multiline={true}
          />
          <p className="char-count">
            {newShow.description.length}/{MAX_DESCRIPTION_LENGTH}
          </p>

          <TextInput
            value={newShow.bookingUrl}
            onChange={(value) => handleChange(value, "title")}
            placeholder={"Link de reserva (URL)"}
          />
          <ImageBox
            bbddImg={newShow.imgURL}
            editableImg="imgURL"
            handleImageChange={handleImageChange}
            handleImageUpload={handleImageUpload}
          />

          {uploadProgress > 0 && (
            <div className="progress-bar">
              <div
                className="progress"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
          <button onClick={() => addOrUpdateShow(actividad)} className="btn">
            {editId ? "Actualizar" : "Publicar"}
          </button>
        </div>

        <h1>Actividades actualmente</h1>
        <div className="cartelera">
          {shows.map((show) => (
            <div key={show.id} className="obra">
              <div className="image-wrapper">
                <img src={show.posterUrl} alt={show.title} className="obra" />
              </div>
              <h2 className="obra">{show.title}</h2>
              <h4 className="obra">{show.author}</h4>
              <p className="obra">{show.description}</p>
              <a
                href={show.bookingUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="booking-link"
              >
                Reserva acá
              </a>
              <div className="action-buttons">
                <button onClick={() => handleEdit(show)} className="edit-btn">
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(show.id)}
                  className="delete-btn"
                >
                  Borrar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Actividades;
