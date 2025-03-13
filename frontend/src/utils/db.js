import { openDB } from 'idb';

const DB_NAME = 'pabellon-literario';
const STORE_LIBRARY = 'library';
const STORE_CHAPTERS = 'chapters'; 

export async function initDB() {
  return openDB(DB_NAME, 1, {
      upgrade(db) {
          if (!db.objectStoreNames.contains('library')) {
              db.createObjectStore('library', { keyPath: '_id' });
          }
          if (!db.objectStoreNames.contains('chapters')) {
              db.createObjectStore('chapters', { keyPath: 'chapterId' });
          }
      },
  });
}

export async function saveLibrary(books) {
  const db = await initDB();
  const tx = db.transaction(STORE_LIBRARY, 'readwrite');
  const store = tx.objectStore(STORE_LIBRARY);
  
  console.log("💾 Guardando en IndexedDB:", books);

  for (const book of books) {
    store.put(book);
  }
  await tx.done;
}


export async function getLibrary() {
  const db = await initDB();
  const library = await db.getAll(STORE_LIBRARY);
  
  console.log("📂 Recuperando biblioteca de IndexedDB:", library);
  
  return library;
}



export async function saveChapters(chapters) {
  const db = await initDB();
  const tx = db.transaction(STORE_CHAPTERS, 'readwrite');
  const store = tx.objectStore(STORE_CHAPTERS);
  for (const chapter of chapters) {
    store.put(chapter);
  }
  await tx.done;
}


export async function getChapter(chapterId) {
  const db = await initDB();
  const chapter = await db.get(STORE_CHAPTERS, chapterId);
  if (!chapter) {
      console.warn(`⚠️ Capítulo ${chapterId} no encontrado en IndexedDB.`);
  }
  return chapter;
}