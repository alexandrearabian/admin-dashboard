import { useEffect, useState } from 'react';
import { db } from '../firebase/FirebaseConfig';
import { collection, doc, onSnapshot, updateDoc } from "firebase/firestore";

export default function Contacto() {
    const [contacto, setContacto] = useState({ header1: '', text1: '', header2: '', mapURL: '' });
    const [isEditing, setIsEditing] = useState(false);
    const [docId, setDocId] = useState(null);
    const [backupContacto, setBackupContacto] = useState(null);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "contacto"), (snapshot) => {
            if (!snapshot.empty) {
                const contactDoc = snapshot.docs[0]; // Assuming there's only one document
                setContacto(contactDoc.data());
                setBackupContacto(contactDoc.data()); // Store original data in backup
                setDocId(contactDoc.id); // Save the document ID for updating
            } else {
                console.error("No contact document found!");
            }
        });

        return () => unsubscribe(); // Clean up the listener on unmount
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setContacto(prev => ({ ...prev, [name]: value })); // Update the state
    };

    const saveChanges = async () => {
        if (docId) {
            try {
                // Update the Firestore document with the new content
                await updateDoc(doc(db, "contacto", docId), {
                    header1: contacto.header1,
                    text1: contacto.text1,
                    header2: contacto.header2,
                    mapURL: contacto.mapURL // If you also want to update the map URL
                });
                setIsEditing(false); // Exit edit mode
                alert('Changes saved successfully!');
            } catch (error) {
                console.error('Error updating document:', error);
            }
        }
    };

    const cancelEdit = () => {
        // Revert to the backup data and exit edit mode
        setContacto(backupContacto);
        setIsEditing(false);
    };

    return (
        <div style={{ width: '100vw' }}>
            {/* Editable Inputs */}
            {isEditing ? (
                <div style={{ width: '100vw', marginTop: '10rem' }}>
                    <input
                        type="text"
                        name="header1"
                        value={contacto.header1}
                        onChange={handleInputChange}
                        placeholder="Header 1"
                        style={{ display: 'block', margin: '1rem auto', width: '80%' }}
                    />
                    <textarea
                        name="text1"
                        value={contacto.text1}
                        onChange={handleInputChange}
                        placeholder="Text 1"
                        rows={4}
                        style={{ display: 'block', margin: '1rem auto', width: '80%' }}
                    />
                    <input
                        type="text"
                        name="header2"
                        value={contacto.header2}
                        onChange={handleInputChange}
                        placeholder="Header 2"
                        style={{ display: 'block', margin: '1rem auto', width: '80%' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                        <button
                            onClick={saveChanges}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'green',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            Guardar Cambios
                        </button>
                        <button
                            onClick={cancelEdit}
                            style={{
                                padding: '0.5rem 1rem',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '5px',
                            }}
                        >
                            Cancelar
                        </button>
                    </div>
                </div>
            ) : (
                <div style={{ width: '100vw', marginTop: '10rem' }}>

                    <h1 >{contacto.header1}</h1>
                    <p style={{ textAlign: 'center' }}>{contacto.text1}</p>
                    <h1>{contacto.header2}</h1>
                    <button
                        onClick={() => setIsEditing(true)}

                    >
                        Editar
                    </button>
                </div>
            )}

            <div style={{ margin: '3rem 6rem 3rem 6rem' }}>
                <iframe
                    src={contacto.mapURL}
                    width='100%'
                    height="600px"
                    style={{ border: 0 }}
                    allowFullScreen=""
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                />
            </div>
        </div>
    );
}
