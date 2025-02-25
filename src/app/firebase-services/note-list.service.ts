import { Injectable, inject } from '@angular/core';
import { Note } from '../interfaces/note.interface';
import {
  Firestore,
  collection,
  collectionData,
  doc,
  onSnapshot, addDoc,
  updateDoc,
  deleteDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NoteListService {
  trashNotes: Note[] = [];
  normalNotes: Note[] = [];

  unsubTrash;
  unsubNotes;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubNotes = this.subNotesList();
    this.unsubTrash = this.subTrashList();
  }

  // method for deleting a note
  async deleteNote(colId: "notes" | "trash", docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
      (err) => {console.error(err);}
    )
  }

  // method for editing a note
  async updateNote(note:Note) {
    if (note.id) {
      let docRef = this.getSingleDocRef(this.getColIdFromNote(note), note.id);
      await updateDoc(docRef, this.getCleanJSON(note)).catch(
        (err) => {console.error(err);}
      );
    }
  }

  // helper function for edit note
  getColIdFromNote(note:Note):string {
    if(note.type == "note") {
      return'notes'
    } else {
      return 'trash'
    }
  }

  // helper function for edit note
  // necessary because updateDoc needs type JSON, but note in this case has type Note, 
  // so note used in function updateNote() needs to be converted into basic JSON
  getCleanJSON(note:Note):{} {
    return {
      type: note.type,
      title: note.title,
      content: note.content,
      marked: note.marked
    }
  }

  // method for adding a note
  async addNote(colId: "notes" | "trash", item:Note) {
    if (colId == "notes") {
      await addDoc(this.getNotesRef(), item).catch(
        (err) => { console.error(err);}
      ).then(
        (docRef) => {console.log("Document written with ID: ", docRef?.id);}
      )
    } else {
      await addDoc(this.getTrashRef(), item).catch(
        (err) => { console.error(err);}
      ).then(
        (docRef) => {console.log("Document written with ID: ", docRef?.id);}
      )
    }
  
  }

  ngOnDestroy() {
    this.unsubNotes();
    this.unsubTrash();
  }

  subNotesList() {
    return onSnapshot(this.getNotesRef(), (list) => {
      this.normalNotes = [];
      list.forEach((element) => {
        this.normalNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  subTrashList() {
    return onSnapshot(this.getTrashRef(), (list) => {
      this.trashNotes = [];
      list.forEach((element) => {
        this.trashNotes.push(this.setNoteObject(element.data(), element.id));
      });
    });
  }

  setNoteObject(obj:any, id:string): Note {
    return {
      id: id || "",
      type: obj.type || "note",
      title: obj.title || "",
      content: obj.content || "",
      marked: obj.marked || false,
    }
  }

  getNotesRef() {
    return collection(this.firestore, 'notes');
  }

  getTrashRef() {
    return collection(this.firestore, 'trash');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
