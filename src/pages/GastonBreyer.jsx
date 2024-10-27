import { useEffect, useState } from 'react';
import { db } from '../firebase/FirebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from '../firebase/StorageFunctions';

export default function GastonBreyer() {

    const [breyer, setBreyer] = useState({ header1: '', text1: '', img1: '', text2: '', img2: '', img3: '', text3: '', mail: '', callout: '', imgURL: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [docId, setDocId] = useState(null);
    const [backupBreyer, setBackupBreyer] = useState(null);
    const [imageFile, setImageFile] = useState({ imgURL: null, img1: null, img2: null, img3: null });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "breyer"), (snapshot) => {
            if (!snapshot.empty) {
                const breyerDoc = snapshot.docs[0];
                setBreyer(breyerDoc.data());
                setBackupBreyer(breyerDoc.data()); // Store original data in backup
                setDocId(breyerDoc.id);
            } else {
                console.error("No breyer document found!");
            }
        });
        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    // Handle text change
    const handleTextChange = (field, value) => {
        setBreyer(prev => ({ ...prev, [field]: value }));
    };

    // Handle image selection
    const handleImageChange = (e, field) => {
        if (e.target.files[0]) {
            setImageFile(prev => ({ ...prev, [field]: e.target.files[0] }));
        }
    };

    // Upload images and update URLs in state
    const handleImageUpload = async () => {
        const updatedFields = {};

        for (let [field, file] of Object.entries(imageFile)) {
            if (file) {
                try {
                    const downloadURL = await uploadImage(file, 'breyer', (progress) => {
                        console.log(`Upload for ${field} is ${progress}% done`);
                    });
                    updatedFields[field] = downloadURL; // Save new URL
                } catch (error) {
                    console.error(`Error uploading ${field}:`, error);
                }
            }
        }
        setBreyer(prev => ({ ...prev, ...updatedFields })); // Update state with new URLs
        setImageFile({ imgURL: null, img1: null, img2: null, img3: null }); // Reset image files
    };

    // Save changes to Firestore
    const handleSaveChanges = async () => {
        if (docId) {
            try {
                await updateDoc(doc(db, "breyer", docId), breyer); // Save all fields to Firestore
                setIsEditing(false);
                alert('Changes saved successfully!');
            } catch (error) {
                console.error('Error updating Firestore:', error);
            }
        }
    };

    // Cancel edits and revert to backup data
    const handleCancelEdit = () => {
        setBreyer(backupBreyer); // Revert to backup data
        setImageFile({ imgURL: null, img1: null, img2: null, img3: null }); // Clear selected image files
        setIsEditing(false); // Exit edit mode
    };

    return (
        <>
            {isEditing ? (
                <>
                    <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'imgURL')} />
                    <button onClick={handleImageUpload}>Upload Main Image</button>
                </>
            ) : (
                <img src={breyer.imgURL} className='foto-principal' />
            )}

            {isEditing ? (
                <input
                    type="text"
                    value={breyer.header1}
                    onChange={(e) => handleTextChange('header1', e.target.value)}
                />
            ) : (
                <h1>{breyer.header1}</h1>
            )}

            <div className='formato'>
                <div className='doble-division'>
                    {isEditing ? (
                        <>
                            <textarea
                                value={breyer.text1}
                                onChange={(e) => handleTextChange('text1', e.target.value)}
                                rows="4"
                            />
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'img1')} />
                        </>
                    ) : (
                        <>
                            <p style={{ textAlign: 'left', marginRight: '5rem' }}>{breyer.text1}</p>
                            <img src={breyer.img1} className='img-format-s' />
                        </>
                    )}
                </div>

                {isEditing ? (
                    <textarea
                        value={breyer.callout}
                        onChange={(e) => handleTextChange('callout', e.target.value)}
                        rows="2"
                    />
                ) : (
                    <div>{breyer.callout}</div>
                )}

                <div className='doble-division'>
                    {isEditing ? (
                        <>
                            <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'img2')} />
                            <textarea
                                value={breyer.text2}
                                onChange={(e) => handleTextChange('text2', e.target.value)}
                                rows="4"
                            />
                        </>
                    ) : (
                        <>
                            <img src={breyer.img2} className='img-format-l' />
                            <p style={{ marginLeft: '5rem' }}>{breyer.text2}</p>
                        </>
                    )}
                </div>

                {isEditing ? (
                    <input
                        type="text"
                        value={breyer.header2}
                        onChange={(e) => handleTextChange('header2', e.target.value)}
                    />
                ) : (
                    <h1>{breyer.header2}</h1>
                )}

                {isEditing ? (
                    <>
                        <input type="file" accept="image/*" onChange={(e) => handleImageChange(e, 'img3')} />
                        <textarea
                            value={breyer.text3}
                            onChange={(e) => handleTextChange('text3', e.target.value)}
                            rows="2"
                        />
                        <input
                            type="text"
                            value={breyer.mail}
                            onChange={(e) => handleTextChange('mail', e.target.value)}
                        />
                    </>
                ) : (
                    <>
                        <img src={breyer.img3} style={{ width: '40%' }} />
                        <p style={{ textAlign: 'center' }}>{breyer.text2}</p>
                        <p style={{ textAlign: 'center' }}>
                            {breyer.text3}
                            <a href={`mailto:${breyer.mail}`} target="_blank" rel="noopener noreferrer">
                                <strong>{breyer.mail}</strong>
                            </a>
                        </p>
                    </>
                )}
            </div>

            {/* Edit Mode Controls */}
            {!isEditing ? (
                <button onClick={() => setIsEditing(true)}>Editar</button>
            ) : (
                <div>
                    <button onClick={handleSaveChanges}>Guardar cambios</button>
                    <button onClick={handleCancelEdit}>Cancelar</button>
                </div>
            )}
        </>
    );
}
