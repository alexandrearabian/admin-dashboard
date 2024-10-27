import { useEffect, useState } from 'react';
import { db, storage } from '../firebase/FirebaseConfig';
import { collection, onSnapshot, updateDoc, doc } from "firebase/firestore";
import { uploadImage, updateImageInFirestore } from '../firebase/StorageFunctions';
import { ref, getDownloadURL } from "firebase/storage";

export default function Premios() {

    const [premios, setPremios] = useState({ header1: '', text1: '', imgURL: '' });
    const [docId, setDocId] = useState(null);
    const [backupPremios, setBackupPremios] = useState(null);
    const [imageFile, setImageFile] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "premios"), (snapshot) => {
            if (!snapshot.empty) {
                const premiosDoc = snapshot.docs[0]; // Assuming there's only one document
                setPremios(premiosDoc.data());
                setBackupPremios(premiosDoc.data()); // Store original data in backup
                setDocId(premiosDoc.id);
            } else {
                console.error("No premios document found!");
            }
        });

        const fetchImage = async () => {
            try {
                const storageRef = ref(storage, '/posters/PREMIOS-etc.jpg');
                const url = await getDownloadURL(storageRef);
                setPremios(prev => ({ ...prev, imgURL: url }));
            } catch (error) {
                console.error('Error fetching image:', error);
            }
        };

        fetchImage();

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const handleImageChange = (e) => {
        if (e.target.files[0]) {
            setImageFile(e.target.files[0]); // Set the image file when selected
        }
    };

    const handleImageUpload = async () => {
        if (imageFile) {
            try {
                const downloadURL = await uploadImage(imageFile, 'premios', (progress) => {
                    console.log(`Upload is ${progress}% done`);
                });
                setPremios(prev => ({ ...prev, imgURL: downloadURL })); // Update imgURL in the state
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleSaveChanges = async () => {
        if (docId) {
            try {
                await updateImageInFirestore('premios', docId, premios.imgURL); // Update Firestore with the new image URL
                await updateDoc(doc(db, "premios", docId), {
                    header1: premios.header1,
                    text1: premios.text1,
                });

                setIsEditing(false); // Exit edit mode
                alert('Changes saved successfully!');
            } catch (error) {
                console.error('Error updating Firestore:', error);
            }
        }
    };

    // Update this function to restore the backup image and text correctly
    const handleCancelEdit = () => {
        setPremios(backupPremios); // Revert to backup data
        setImageFile(null); // Clear selected image file
        setIsEditing(false); // Exit edit mode
    };

    return (
        <div className='premios'>
            {!isEditing ? (
                <>
                    <h1 style={{ paddingTop: '3rem' }}>
                        {premios.header1}
                    </h1>
                    <p style={{
                        fontFamily: 'Merriweather',
                        fontWeight: '200',
                        textAlign: 'center'
                    }}>
                        {premios.text1}
                    </p>
                    <button onClick={() => setIsEditing(true)}>Editar Premios</button>
                </>
            ) : (
                <>
                    <input
                        type="text"
                        value={premios.header1}
                        onChange={(e) => setPremios(prev => ({ ...prev, header1: e.target.value }))}
                    />
                    <textarea
                        value={premios.text1}
                        onChange={(e) => setPremios(prev => ({ ...prev, text1: e.target.value }))}
                        rows="4"
                        style={{ width: '100%', marginBottom: '1rem' }}
                    />
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                    />
                    <button onClick={handleImageUpload}>Subir nueva Imagen</button>
                    <button onClick={handleSaveChanges}>Guardar cambios</button>
                    <button onClick={handleCancelEdit}>Cancelar</button>
                </>
            )}
            <img src={premios.imgURL} style={{ width: '100%', paddingBottom: '3rem' }} />
        </div>
    );
}
