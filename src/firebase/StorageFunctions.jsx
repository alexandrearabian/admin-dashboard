import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { updateDoc, doc } from "firebase/firestore";
import { db, storage } from '../firebase/FirebaseConfig';

// Function to upload an image to Firebase Storage
export const uploadImage = (imageFile, storagePath, onProgress) => {
    return new Promise((resolve, reject) => {
        if (!imageFile) return reject('No image file provided');

        const storageRef = ref(storage, `${storagePath}/${imageFile.name}`);
        const uploadTask = uploadBytesResumable(storageRef, imageFile);

        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                if (onProgress) onProgress(progress); // Callback for upload progress
            },
            (error) => {
                reject(error);
            },
            async () => {
                try {
                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                    resolve(downloadURL); // Return the URL after upload
                } catch (error) {
                    reject(error);
                }
            }
        );
    });
};

// Function to update Firestore document with image URL
export const updateImageInFirestore = async (collectionName, docId, imgURL) => {
    if (!docId) throw new Error('No document ID provided');

    try {
        await updateDoc(doc(db, collectionName, docId), {
            imgURL: imgURL,
        });
        return true;
    } catch (error) {
        throw new Error('Error updating Firestore document: ' + error.message);
    }
};
