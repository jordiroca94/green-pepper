<template>
  <div class="p-4 max-w-3xl flex flex-col mx-auto">
    <h2 class="text-2xl font-bold mb-4">My Notes</h2>
    <input
      v-model="searchQuery"
      placeholder="Search notes..."
      class="border rounded-md p-2 mb-4 w-full"
    />
    <ul class="pb-6">
      <li
        v-for="note in filteredNotes"
        :key="note.id"
        class="border-b py-2 flex justify-between items-start"
      >
        <div>
          <strong>{{ note.title }}</strong
          ><br />
          <span>{{ note.description }}</span>
        </div>
        <div class="space-x-2">
          <button @click="startEdit(note)" class="text-blue-600">Edit</button>
          <button @click="removeNote(note.id!)" class="text-red-600">Delete</button>
        </div>
      </li>
    </ul>
    <div class="mb-5">
      <button
        class="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-white group px-3 py-2 w-full justify-center rounded-md border border-transparent hover:border-green-600 transition-colors"
        @click="toggleForm"
      >
        <Plus
          class="w-6 h-6 text-white group-hover:text-green-600 transition-transform duration-300"
          :class="{ 'rotate-45': showForm }"
        />
        <span class="text-white group-hover:text-green-600 font-medium transition-colors">
          {{ showForm ? 'Hide Form' : 'Add Note' }}
        </span>
      </button>
    </div>

    <form
      v-if="showForm || editingNoteId !== null"
      @submit.prevent="handleSave"
      class="mb-4 space-y-2"
    >
      <h2 class="text-2xl font-bold mb-4">Add Note</h2>
      <input v-model="form.title" placeholder="Title" class="border rounded-md p-2 w-full" />
      <textarea
        v-model="form.description"
        placeholder="Description"
        class="border rounded-md p-2 w-full"
      ></textarea>
      <div class="flex flex-col gap-2">
        <button
          class="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-white hover:text-green-600 text-white group px-3 py-2 w-full justify-center rounded-md border border-transparent hover:border-green-600 transition-colors"
          type="submit"
        >
          {{ editingNoteId === null ? 'Save' : 'Update' }}
        </button>
        <button
          v-if="editingNoteId !== null"
          type="button"
          class="flex items-center gap-2 cursor-pointer hover:bg-green-600 text-green-600 hover:text-white group px-3 py-2 w-full justify-center rounded-md border hover:border-transparent border-green-600 transition-colors"
          @click="cancelEdit"
        >
          Cancel
        </button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { addNote, getNotes, deleteNote, updateNote } from '../db/index'
import { Plus } from 'lucide-vue-next'

const showForm = ref(false)

const toggleForm = () => {
  showForm.value = !showForm.value
  if (!showForm.value) resetForm()
}

interface Note {
  id?: number
  title: string
  description: string
}

const notes = ref<Note[]>([])
const form = ref<Note>({ title: '', description: '' })
const editingNoteId = ref<number | null>(null)
const searchQuery = ref('')

const loadNotes = async () => {
  notes.value = await getNotes()
}

const handleSave = async () => {
  if (editingNoteId.value !== null) {
    await updateNote({ ...form.value, id: editingNoteId.value })
  } else {
    await addNote({
      title: form.value.title,
      description: form.value.description,
    })
  }
  resetForm()
  await loadNotes()
}

const startEdit = (note: Note) => {
  form.value = { title: note.title, description: note.description }
  editingNoteId.value = note.id ?? null
}

const cancelEdit = () => {
  resetForm()
}

const resetForm = () => {
  form.value = { title: '', description: '' }
  editingNoteId.value = null
}

const removeNote = async (id: number) => {
  await deleteNote(id)
  await loadNotes()
}

const filteredNotes = computed(() =>
  notes.value.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

onMounted(loadNotes)
</script>
