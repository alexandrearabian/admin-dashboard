import React, { useState, useEffect } from 'react';
import { db, storage } from './firebase/FirebaseConfig'; // Firebase setup
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

const AdminDashboard = () => {

    const formato = {
        nav_link: '',
        cover: '',
        header1: '',
    }

    const [principal, setPrincipal] = useState({ ...formato, premiosURL: '' });
    const [tadron, setTadron] = useState({ ...formato, text1: '', imgURL1: '', header2: '', subHeader2: '', imgURL2: '', text2: '', premiosURL: '' });
    const [programaEspectaculo, setProgramaEspectaculo] = useState({ ...formato, text1: '', imgURL1: '', email: '' });
    const [nuestroEspacio, setNuestroEspacio] = useState({ ...formato, text1: '', imgURL1: '', imgURL2: '', imgURL3: '', imgURL4: '', imgURL5: '', imgURL6: '', });
    const [cicloTXJ, setCicloTXJ] = useState({ ...formato, text1: '', imgURL1: '', callout: '', header2: '', header3: '', text2: '', text3: '', text4: '' });
    const [gastonBreyer, setGastonBreyer] = useState({ ...formato, text1: '', imgURL1: '', callout: '', text2: '', imgURL2: '', header2: '', imgURL3: '', text3: '', text4: '', email: '' });

    const [newShow, setNewShow] = useState({ ...formato, title: '', author: '', description: '', posterUrl: '', bookingUrl: '' });
    const [newCourse, setNewCourse] = useState({ ...formato, title: '', author: '', description: '', posterUrl: '', bookingUrl: '' });

    const [imageFile, setImageFile] = useState(null);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [shows, setShows] = useState([]);
    const [editId, setEditId] = useState(null); // For tracking which show is being edited
    const MAX_DESCRIPTION_LENGTH = 450; // Set maximum length for description

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "cartelera"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "cursos"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "portadas"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "tadron-es-teatro"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "programa-tu-espectaculo"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "nuestro-espacio"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "ciclo-txj"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "gaston-breyer"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);
    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "contacto"), (snapshot) => {
            const showsData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setShows(showsData);
        });

        return () => unsubscribe(); // Clean up the listener on unmount
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
                            // Update existing show
                            await updateDoc(doc(db, bbdd, editId), { ...newShow, posterUrl });
                        } else {
                            // Add new show
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
        <div className="min-h-screen flex flex-col items-center justify-center py-6 space-y-6">
            <div className="min-h-screen flex items-center justify-evenly py-6 space-y-6">
                <div className="bg-gray-700 shadow-md rounded-lg p-8 max-w-lg w-full">
                    <h2 className="text-2xl font-semibold text-white mb-6">{editId ? "Editar Obra" : "Agregar Obra"}</h2>
                    <div className="space-y-4">
                        <input
                            name="title"
                            value={newShow.title}
                            onChange={handleChange}
                            placeholder="Título"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            name="author"
                            value={newShow.author}
                            onChange={handleChange}
                            placeholder="Autor/Director"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <textarea
                            name="description"
                            value={newShow.description}
                            onChange={handleChange}
                            placeholder="Descripción"
                            className="w-full p-2 border border-gray-300 rounded-lg h-40" // Set height to 40
                        />
                        {/* Character count for description */}
                        <p className="text-gray-400">
                            {newShow.description.length}/{MAX_DESCRIPTION_LENGTH}
                        </p>
                        <input
                            name="bookingUrl"
                            value={newShow.bookingUrl}
                            onChange={handleChange}
                            placeholder="Link de reserva (URL)"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => addOrUpdateShow('cartelera')}
                        className="mt-6 w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                    >
                        {editId ? "Actualizar Obra" : "Subir Obra"}
                    </button>
                </div>
                <div className="bg-gray-700 shadow-md rounded-lg p-8 max-w-lg w-full">
                    <h2 className="text-2xl font-semibold text-white mb-6">{editId ? "Editar Curso/Taller" : "Agregar Curso/Taller"}</h2>
                    <div className="space-y-4">
                        <input
                            name="title"
                            value={newShow.title}
                            onChange={handleChange}
                            placeholder="Título"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            name="author"
                            value={newShow.author}
                            onChange={handleChange}
                            placeholder="Impartido por"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <textarea
                            name="description"
                            value={newShow.description}
                            onChange={handleChange}
                            placeholder="Descripción"
                            className="w-full p-2 border border-gray-300 rounded-lg h-40" // Set height to 40
                        />
                        {/* Character count for description */}
                        <p className="text-gray-400">
                            {newShow.description.length}/{MAX_DESCRIPTION_LENGTH}
                        </p>
                        <input
                            name="bookingUrl"
                            value={newShow.bookingUrl}
                            onChange={handleChange}
                            placeholder="Link de reserva (URL)"
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full p-2 border border-gray-300 rounded-lg"
                        />
                        {uploadProgress > 0 && (
                            <div className="w-full bg-gray-200 rounded-full h-2.5">
                                <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${uploadProgress}%` }}></div>
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => addOrUpdateShow('cursos')}
                        className="mt-6 w-full bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700"
                    >
                        {editId ? "Actualizar Obra" : "Subir Obra"}
                    </button>
                </div>
            </div>

            <div className="w-full max-w-4xl">
                <h2 className="text-xl font-semibold mb-4">Cartelera Actual</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {shows.map(show => (
                        <div key={show.id} className="bg-gray-800 p-4 rounded-lg shadow-lg">
                            <img src={show.posterUrl} alt={show.title} className="h-48 w-full object-cover mb-4" />
                            <h3 className="text-xl font-semibold mb-2">{show.title}</h3>
                            <h4 className="text-xl font-semibold mb-2">{show.author}</h4>
                            <p className="text-gray-400 mb-2">{show.description}</p>
                            <a href={show.bookingUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400">Book here</a>
                            <div className="flex space-x-4 mt-4">
                                <button
                                    onClick={() => handleEdit(show)}
                                    className="bg-yellow-500 text-white p-2 rounded-lg hover:bg-yellow-600"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(show.id)}
                                    className="bg-red-500 text-white p-2 rounded-lg hover:bg-red-600"
                                >
                                    Borrar
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
