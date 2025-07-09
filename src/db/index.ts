const DB_NAME = 'NotesDB'
const STORE_NAME = 'notes'
const DB_VERSION = 1

interface Note {
  id?: number
  title: string
  description: string
  createdAt?: string
  updatedAt?: string
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION)

    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve(request.result)
    request.onupgradeneeded = () => {
      const db = request.result
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id', autoIncrement: true })
      }
    }
  })
}

export async function addNote(note: Note): Promise<number> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const now = new Date().toISOString()
    const noteWithTimestamp = {
      ...note,
      createdAt: now,
      updatedAt: now,
    }
    const req = store.add(noteWithTimestamp)
    req.onsuccess = () => resolve(req.result as number)
    req.onerror = () => reject(req.error)
  })
}

export async function getNotes(): Promise<Note[]> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly')
    const store = tx.objectStore(STORE_NAME)
    const req = store.getAll()
    req.onsuccess = () => resolve(req.result as Note[])
    req.onerror = () => reject(req.error)
  })
}

export async function deleteNote(id: number): Promise<void> {
  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)
    const req = store.delete(id)
    req.onsuccess = () => resolve()
    req.onerror = () => reject(req.error)
  })
}

export async function updateNote(note: Note): Promise<void> {
  if (!note.id) {
    throw new Error('Note ID is required for update')
  }

  const db = await openDB()
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite')
    const store = tx.objectStore(STORE_NAME)

    // First get the existing note to preserve createdAt
    const getReq = store.get(note.id!)
    getReq.onsuccess = () => {
      const existingNote = getReq.result
      const updatedNote = {
        ...note,
        createdAt: existingNote?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
      const putReq = store.put(updatedNote)
      putReq.onsuccess = () => resolve()
      putReq.onerror = () => reject(putReq.error)
    }
    getReq.onerror = () => reject(getReq.error)
  })
}
