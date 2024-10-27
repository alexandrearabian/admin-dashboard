import React, { useState, useEffect } from 'react';
import { db, storage } from '../firebase/FirebaseConfig';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AdminDashboard = () => {

  const formato = {
    nav_link: '',
    cover: '',
    header1: '',
  }

  const [newShow, setNewShow] = useState({ ...formato, title: '', author: '', description: '', posterUrl: '', bookingUrl: '' });
  const [imageFile, setImageFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [shows, setShows] = useState([]);
  const [editId, setEditId] = useState(null);
  const MAX_DESCRIPTION_LENGTH = 450;

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "cartelera"), (snapshot) => {
      const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setShows(showsData);
    });
    return () => unsubscribe();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewShow({ ...newShow, [name]: value });
  };

  const handleImageChange = (e) => {
    if (e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const addOrUpdateShow = async (bbdd) => {
    try {
      let posterUrl = newShow.posterUrl;

      if (imageFile) {
        const storageRef = ref(storage, `posters/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on('state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            setUploadProgress(progress);
          },
          (error) => console.error('Error uploading image:', error),
          async () => {
            posterUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (editId) {
              await updateDoc(doc(db, bbdd, editId), { ...newShow, posterUrl });
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
    } catch (error) {
      console.error('Error adding/updating show:', error);
    }
  };

  const resetForm = () => {
    setNewShow({ title: '', author: '', description: '', posterUrl: '', bookingUrl: '' });
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
      await deleteDoc(doc(db, "cartelera", id));
    }
  };

  return (
    <div className="admin-dashboard">
      <img src={newShow.posterUrl} alt={newShow.title} />
      <div className="form-container">
        <div className="show-form">
          <h2>{editId ? "Editar Obra" : "Agregar Obra"}</h2>
          <div className="form-group">
            <img src={newShow.posterUrl} alt={newShow.title} />
            <input
              name="title"
              value={newShow.title}
              onChange={handleChange}
              placeholder="Título"
              className="input-field"
            />
            <input
              name="author"
              value={newShow.author}
              onChange={handleChange}
              placeholder="Autor/Director"
              className="input-field"
            />
            <textarea
              name="description"
              value={newShow.description}
              onChange={handleChange}
              placeholder="Descripción"
              className="textarea-field"
            />
            <p className="char-count">
              {newShow.description.length}/{MAX_DESCRIPTION_LENGTH}
            </p>
            <input
              name="bookingUrl"
              value={newShow.bookingUrl}
              onChange={handleChange}
              placeholder="Link de reserva (URL)"
              className="input-field"
            />
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="input-field"
            />
            {uploadProgress > 0 && (
              <div className="progress-bar">
                <div className="progress" style={{ width: `${uploadProgress}%` }}></div>
              </div>
            )}
          </div>
          <button onClick={() => addOrUpdateShow('cartelera')} className="btn">
            {editId ? "Actualizar Obra" : "Subir Obra"}
          </button>
        </div>

        <div className="current-shows">
          <h2>Cartelera Actual</h2>
          <div className="show-list">
            {shows.map(show => (
              <div key={show.id} className="show-item">
                <img src={show.posterUrl} alt={show.title} className='obra' />
                <h3>{show.title}</h3>
                <h4>{show.author}</h4>
                <p>{show.description}</p>
                <a href={show.bookingUrl} target="_blank" rel="noopener noreferrer" className="booking-link">
                  Reserva acá
                </a>
                <div className="action-buttons">
                  <button onClick={() => handleEdit(show)} className="edit-btn">Editar</button>
                  <button onClick={() => handleDelete(show.id)} className="delete-btn">Borrar</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
