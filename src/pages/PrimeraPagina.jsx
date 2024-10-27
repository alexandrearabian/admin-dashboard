import { useEffect, useState } from 'react';
import { db } from '../firebase/FirebaseConfig';
import { collection, onSnapshot } from "firebase/firestore";
import { uploadImage, updateImageInFirestore } from '../firebase/StorageFunctions';
import Premios from '../components/Premios';

export default function PrimeraPagina() {
    const [principal, setPrincipal] = useState({ imgURL: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [docId, setDocId] = useState(null);
    const [backupPrincipal, setBackupPrincipal] = useState(null);
    const [imageFile, setImageFile] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "principal"), (snapshot) => {
            if (!snapshot.empty) {
                const principalDoc = snapshot.docs[0]; // Assuming there's only one document
                setPrincipal(principalDoc.data());
                setBackupPrincipal(principalDoc.data()); // Store original data in backup
                setDocId(principalDoc.id); // Save the document ID for updating
            } else {
                console.error("No principal document found!");
            }
        });

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
                const downloadURL = await uploadImage(imageFile, 'principal', (progress) => {
                    console.log(`Upload is ${progress}% done`);
                });
                setPrincipal(prev => ({ ...prev, imgURL: downloadURL })); // Update imgURL in the state
            } catch (error) {
                console.error('Error uploading image:', error);
            }
        }
    };

    const handleSaveChanges = async () => {
        if (docId) {
            try {
                await updateImageInFirestore('principal', docId, principal.imgURL); // Update Firestore with the new image URL
                setIsEditing(false); // Exit edit mode
                alert('Changes saved successfully!');
            } catch (error) {
                console.error('Error updating Firestore:', error);
            }
        }
    };

    const handleCancelEdit = () => {
        setPrincipal(backupPrincipal); // Revert to backup data
        setIsEditing(false); // Exit edit mode
    };

    return (
        <>
            <div>
                <img src={principal.imgURL} alt="Principal" className='foto-principal' />

                {!isEditing ? (
                    <div>
                        <button onClick={() => setIsEditing(true)}>Editar portada</button>
                    </div>
                ) : (
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        <button onClick={handleImageUpload}>Subir Imagenes</button>
                        <button onClick={handleSaveChanges}>Guardar cambios</button>
                        <button onClick={handleCancelEdit}>Cancelar</button>
                    </div>
                )}

                <Premios />
            </div>
        </>
    );
}
