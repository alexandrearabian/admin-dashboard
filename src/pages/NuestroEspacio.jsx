import { useEffect, useState } from 'react';
import { db } from '../firebase/FirebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from '../firebase/StorageFunctions';

export default function NuestroEspacio() {
    const [espacio, setEspacio] = useState({ header1: '', text1: '', img1: '', img2: '', img3: '', img4: '', img5: '', img6: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [docId, setDocId] = useState(null);
    const [backupEspacio, setBackupEspacio] = useState(null);
    const [imageFile, setImageFile] = useState({ img6: null, img1: null, img2: null, img3: null, img4: null, img5: null });

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
        setEspacio(prev => ({ ...prev, [field]: value }));
    };

    // Handle image selection
    const handleImageChange = (e, field) => {
        if (e.target.files[0]) {
            setImageFile(prev => ({ ...prev, [field]: e.target.files[0] }));
        }
    };

    // Handle selecting a small image as the main image
    const handleImageSelect = (field) => {
        setEspacio(prev => ({ ...prev, img6: prev[field] }));
    };

    // Upload images and update URLs in state
    const handleImageUpload = async () => {
        const updatedFields = {};

        for (let [field, file] of Object.entries(imageFile)) {
            if (file) {
                try {
                    const downloadURL = await uploadImage(file, 'espacio', (progress) => {
                        console.log(`Upload for ${field} is ${progress}% done`);
                    });
                    updatedFields[field] = downloadURL; // Save new URL
                } catch (error) {
                    console.error(`Error uploading ${field}:`, error);
                }
            }
        }
        setEspacio(prev => ({ ...prev, ...updatedFields })); // Update state with new URLs
        setImageFile({ img6: null, img1: null, img2: null, img3: null, img4: null, img5: null }); // Reset image files
    };

    // Save changes to Firestore
    const handleSaveChanges = async () => {
        if (docId) {
            try {
                await updateDoc(doc(db, "espacio", docId), espacio); // Save all fields to Firestore
                setIsEditing(false);
                alert('Changes saved successfully!');
            } catch (error) {
                console.error('Error updating Firestore:', error);
            }
        }
    };

    // Cancel edits and revert to backup data
    const handleCancelEdit = () => {
        setEspacio(backupEspacio); // Revert to backup data
        setImageFile({ img6: null, img1: null, img2: null, img3: null, img4: null, img5: null }); // Clear selected image files
        setIsEditing(false); // Exit edit mode
    };

    return (
        <>
            {isEditing ? (
                <>
                    <input type="file" onChange={(e) => handleImageChange(e, 'img6')} />
                    <img src={espacio.img6} className='foto-principal' />
                </>
            ) : (
                <img src={espacio.img6} className='foto-principal' />
            )}

            <h1>
                {isEditing ? (
                    <input type="text" value={espacio.header1} onChange={(e) => handleTextChange('header1', e.target.value)} />
                ) : (
                    espacio.header1
                )}
            </h1>

            <div className='formato'>
                <p>
                    {isEditing ? (
                        <textarea value={espacio.text1} onChange={(e) => handleTextChange('text1', e.target.value)} />
                    ) : (
                        espacio.text1
                    )}
                </p>

                <div style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div className='doble-division'>
                        {['img1', 'img2', 'img3'].map((field, idx) => (
                            <div key={idx} onClick={() => !isEditing && handleImageSelect(field)}>
                                {isEditing ? (
                                    <>
                                        <input type="file" onChange={(e) => handleImageChange(e, field)} />
                                        {espacio[field] && <img src={espacio[field]} className='foto-preview' />}
                                    </>
                                ) : (
                                    <img src={espacio[field]} className='foto-preview' />
                                )}
                            </div>
                        ))}
                    </div>
                    <div className='doble-division'>
                        {['img4', 'img5', 'img6'].map((field, idx) => (
                            <div key={idx} onClick={() => !isEditing && handleImageSelect(field)}>
                                {isEditing ? (
                                    <>
                                        <input type="file" onChange={(e) => handleImageChange(e, field)} />
                                        {espacio[field] && <img src={espacio[field]} className='foto-preview' />}
                                    </>
                                ) : (
                                    <img src={espacio[field]} className='foto-preview' />
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {isEditing && (
                <div>
                    <button onClick={handleImageUpload}>Upload Images</button>
                    <button onClick={handleSaveChanges}>Save Changes</button>
                    <button onClick={handleCancelEdit}>Cancel</button>
                </div>
            )}

            {!isEditing && (
                <button onClick={() => setIsEditing(true)}>Edit</button>
            )}
        </>
    )
}
