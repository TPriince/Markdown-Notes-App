import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Editor from "./components/Editor";
import Split from "react-split";
// import { nanoid } from "nanoid";
import { onSnapshot, addDoc, doc, setDoc, deleteDoc } from "firebase/firestore";
import { db, notesCollectionRef } from "./firebase";

function App() {
  const [notes, setNotes] = useState([]);
  // const [notes, setNotes] = useState(() => JSON.parse(localStorage.getItem("notes")) || []);
  const [currentNoteId, setCurrentNoteId] = useState("");
  const [tempNoteText, setTempNoteText] = useState("");

  const currentNote = notes.find((note) => note.id === currentNoteId) || notes[0];

  const sortedNotes = notes.sort((a, b) => b.updatedAt - a.updatedAt);

  useEffect(() => {
    //localStorage.setItem("notes", JSON.stringify(notes));
    const unsubscribe = onSnapshot(notesCollectionRef, (snapshot) => {
      const notesArray = snapshot.docs.map((doc) => {
        return { id: doc.id, ...doc.data() };
      });
      setNotes(notesArray);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (!currentNoteId) {
      setCurrentNoteId(notes[0]?.id);
    }
  }, [notes]);

  useEffect(() => {
    if (currentNote) {
      setTempNoteText(currentNote.body);
    }
  }, [currentNote]);

  // Create new note function
  async function createNewNote() {
    const newNote = {
      body: "# Type your markdown note's title here. NB: You can resize the sidebar",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    try {
      const newNoteRef = await addDoc(notesCollectionRef, newNote);
      console.log("New note created!");
      setCurrentNoteId(newNoteRef.id);
    } catch (error) {
      console.error("Error adding document: ", error.message);
    }
  }

  // console.log(currentNoteId, currentNote);

  //  Update note function
  async function updateNote(text) {
    const docRef = doc(db, "notes", currentNoteId);
    try {
      await setDoc(
        docRef,
        { body: text, updatedAt: Date.now() },
        { merge: true }
      );
    } catch (error) {
      console.error("Error updating document: ", error.message);
    }
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (tempNoteText !== currentNote.body) {
        updateNote(tempNoteText);
        console.log("Note updated!")
      }
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [tempNoteText]);

  // Delete note function
  async function deleteNote(noteId) {
    const docRef = doc(db, "notes", noteId);
    try {
      await deleteDoc(docRef);
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error.message);
    }
  }

  return (
    <main>
      {notes.length > 0 ? (
        <Split sizes={[30, 70]} direction="horizontal" className="split">
          <Sidebar
            notes={sortedNotes}
            currentNote={currentNote}
            setCurrentNoteId={setCurrentNoteId}
            newNote={createNewNote}
            handleDelete={deleteNote}
          />
          <Editor
            tempNoteText={tempNoteText}
            setTempNoteText={setTempNoteText}
          />
        </Split>
      ) : (
        <div className="no-notes">
          <h1>You have no notes</h1>
          <button className="first-note" onClick={createNewNote}>
            Create one now
          </button>
        </div>
      )}
    </main>
  );
}

export default App;





// function updateNote(text) {
//   // Put the most recently-modified note to be at the top
//   setNotes(prevNotes => {
//     const newArray = [];
//     for (let i = 0; i < prevNotes.length; i++) {
//       let prevNote = prevNotes[i];
//       if (prevNote.id === currentNoteId) {
//         newArray.unshift({...prevNote, body: text});
//       } else {
//         newArray.push(prevNote);
//       }
//     }
//     return newArray;

//     // This works too
//     // const currentNoteIndex = prevNotes.findIndex(note => note.id === currentNoteId)
//     // const currentNote = prevNotes[currentNoteIndex]
//     // const updatedNote = {...currentNote, body: text}
//     // const notesWithoutCurrentNote = prevNotes.filter(note => note.id !== currentNoteId)
//     // return [updatedNote, ...notesWithoutCurrentNote]
//   })

//   // setNotes((oldNotes) =>
//   //   oldNotes.map((oldNote) => {
//   //     return oldNote.id === currentNoteId
//   //       ? { ...oldNote, body: text }
//   //       : oldNote;
//   //   })
//   // );
// }


// function deleteNote(event, noteId) {
//   event.stopPropagation();
//   setNotes((prevNotes) => {
//     const newSetOfNotes = prevNotes.filter((note) => {
//       if (note.id !== id) {
//         return note;
//       }
//     });
//     localStorage.setItem("notes", JSON.stringify(newSetOfNotes));
//     return newSetOfNotes;
//   });
// }