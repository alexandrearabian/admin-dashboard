import React, { useState, useEffect } from 'react';
import { db } from '../firebase/FirebaseConfig';  // Firebase config
import { collection, onSnapshot, query, orderBy } from "firebase/firestore";

const CursosYTalleres = () => {
    const [shows, setShows] = useState([]);

    useEffect(() => {
        const fetchShows = () => {
            // Create a Firestore query for the 'billboard' collection, ordered by a field (like title or date)
            const q = query(collection(db, 'cartelera'), orderBy('title', 'asc'));

            // Use onSnapshot to listen for real-time updates to the collection
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const showsData = snapshot.docs.map(doc => ({
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

    return (
        <div className='pagina'>
            <img src={FotoPrincipal} className='foto-principal' />

            <h1>Cursos y Talleres</h1>
            <div className='cartelera'>
                {shows.map((show) => (
                    <div className='obra' key={show.id}>
                        <img className='obra' src={show.posterUrl} alt={show.titulo} />
                        <h2>{show.title}</h2>
                        <h4 className='obra' >{show.author}</h4>
                        <p className='obra'>{show.description}</p>
                        <a href={show.reserva} target="_blank" rel="noopener noreferrer">
                            <button>Reservar</button>
                        </a>
                    </div>
                ))}
            </div>
            <br />
        </div>
    );
};

export default CursosYTalleres;
