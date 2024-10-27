import { useEffect, useState } from 'react';
import { db } from '../firebase/FirebaseConfig';
import { collection, onSnapshot, doc, updateDoc } from "firebase/firestore";
import { uploadImage } from '../firebase/StorageFunctions';

export default function CicloTxJ() {
    const [justicia, setJusticia] = useState({
        header1: '',
        text1: '',
        imgURL: '',
        img1: '',
        text2: '',
        text3: '',
        header2: '',
        text4: '',
        header3: '',
        text5: '',
        text6: '',
    });
    const [isEditing, setIsEditing] = useState(false);
    const [docId, setDocId] = useState(null);
    const [backupJusticia, setBackupJusticia] = useState(null);
    const [imageFile, setImageFile] = useState({ imgURL: null, img1: null });

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "justicia"), (snapshot) => {
            if (!snapshot.empty) {
                const justiciaDoc = snapshot.docs[0];
                setJusticia(justiciaDoc.data());
                setBackupJusticia(justiciaDoc.data());
                setDocId(justiciaDoc.id);
            } else {
                console.error("No justicia document found!");
            }
        });
        return () => unsubscribe();
    }, []);

    // Handle text change
    const handleTextChange = (field, value) => {
        setJusticia(prev => ({ ...prev, [field]: value }));
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
                    const downloadURL = await uploadImage(file, 'justicia', (progress) => {
                        console.log(`Upload for ${field} is ${progress}% done`);
                    });
                    updatedFields[field] = downloadURL;
                } catch (error) {
                    console.error(`Error uploading ${field}:`, error);
                }
            }
        }
        setJusticia(prev => ({ ...prev, ...updatedFields }));
        setImageFile({ imgURL: null, img1: null });
    };

    // Save changes to Firestore
    const handleSaveChanges = async () => {
        if (docId) {
            try {
                await updateDoc(doc(db, "justicia", docId), justicia);
                setIsEditing(false);
                alert('Changes saved successfully!');
            } catch (error) {
                console.error('Error updating Firestore:', error);
            }
        }
    };

    // Cancel edits and revert to backup data
    const handleCancelEdit = () => {
        setJusticia(backupJusticia);
        setImageFile({ imgURL: null, img1: null });
        setIsEditing(false);
    };

    return (
        <>
            {isEditing ? (
                <>
                    <input type="file" onChange={(e) => handleImageChange(e, 'imgURL')} />
                    <img src={justicia.imgURL} className='foto-principal' />
                </>
            ) : (
                <img src={justicia.imgURL} className='foto-principal' />
            )}
            {isEditing ? (
                <input
                    type="text"
                    value={justicia.header1}
                    onChange={(e) => handleTextChange('header1', e.target.value)}
                />
            ) : (
                <h1>{justicia.header1}</h1>
            )}
            <div className='formato'>
                <div className='doble-division'>
                    {isEditing ? (
                        <>
                            <textarea
                                value={justicia.text1}
                                onChange={(e) => handleTextChange('text1', e.target.value)}
                            />
                            <input
                                type="file"
                                onChange={(e) => handleImageChange(e, 'img1')}
                            />
                        </>
                    ) : (
                        <>
                            <p>{justicia.text1}</p>
                            <img src={justicia.img1} style={{ width: '30%', marginLeft: '5rem' }} />
                        </>
                    )}
                </div>
                {isEditing ? (
                    <textarea
                        value={justicia.text2}
                        onChange={(e) => handleTextChange('text2', e.target.value)}
                    />
                ) : (
                    <p>{justicia.text2}</p>
                )}
                {isEditing ? (
                    <textarea
                        value={justicia.text3}
                        onChange={(e) => handleTextChange('text3', e.target.value)}
                    />
                ) : (
                    <p>{justicia.text3}</p>
                )}

                <div className='doble-division'>
                    <div>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={justicia.header2}
                                    onChange={(e) => handleTextChange('header2', e.target.value)}
                                />
                                <textarea
                                    value={justicia.text4}
                                    onChange={(e) => handleTextChange('text4', e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <h2>{justicia.header2}</h2>
                                <p>{justicia.text4}</p>
                            </>
                        )}
                    </div>
                    <div>
                        {isEditing ? (
                            <>
                                <input
                                    type="text"
                                    value={justicia.header3}
                                    onChange={(e) => handleTextChange('header3', e.target.value)}
                                />
                                <textarea
                                    value={justicia.text5}
                                    onChange={(e) => handleTextChange('text5', e.target.value)}
                                />
                            </>
                        ) : (
                            <>
                                <h2>{justicia.header3}</h2>
                                <p>{justicia.text5}</p>
                            </>
                        )}
                    </div>
                </div>
                {isEditing ? (
                    <textarea
                        value={justicia.text6}
                        onChange={(e) => handleTextChange('text6', e.target.value)}
                    />
                ) : (
                    <p>{justicia.text6}</p>
                )}

                {isEditing && (
                    <>
                        <button onClick={handleImageUpload}>Subir Imagenes</button>
                        <button onClick={handleSaveChanges}>Guardar Cambios</button>
                        <button onClick={handleCancelEdit}>Cancel</button>
                    </>
                )}
                {!isEditing && <button onClick={() => setIsEditing(true)}>Editar</button>}
            </div>
        </>
    );
}
