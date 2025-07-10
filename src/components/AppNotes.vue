<template>
  <div class="flex justify-center">
    <div class="p-4 max-w-3xl w-full">
      <h2 class="text-2xl font-bold mb-4">My Notes</h2>
      <div class="relative mb-4">
        <input
          ref="searchInput"
          v-model="searchQuery"
          placeholder="Search notes... (Press / to focus)"
          class="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
          @keydown.escape="searchQuery = ''"
        />
        <span v-if="searchQuery" class="absolute right-2 top-2 text-gray-400 text-sm">
          {{ filteredNotes.length }} found
        </span>
      </div>

      <div v-if="loading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>

      <div v-else-if="error" class="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
        <p class="text-red-800">{{ error }}</p>
        <button @click="loadNotes" class="mt-2 text-red-600 underline">Try again</button>
      </div>

      <ul v-else-if="filteredNotes.length > 0" class="pb-6">
        <li
          v-for="note in filteredNotes"
          :key="note.id"
          class="border-b py-2 flex justify-between items-start hover:bg-gray-50 px-2 rounded transition-colors"
        >
          <div class="flex-1 min-w-0">
            <strong class="block truncate">{{ note.title }}</strong>
            <span class="text-gray-600 text-sm whitespace-pre-line">{{ note.description }}</span>
            <div class="flex flex-col text-xs text-gray-400 mt-1">
              <span>Created: {{ formatDate(note.createdAt) }} </span>
              <span v-if="note.updatedAt && note.updatedAt !== note.createdAt">
                Updated: {{ formatDate(note.updatedAt) }}
              </span>
            </div>
          </div>
          <div class="flex space-x-2 ml-4">
            <button
              @click="startEdit(note)"
              class="text-gray-400 hover:text-gray-600 transition-colors p-1"
              :aria-label="`Edit note: ${note.title}`"
            >
              Edit
            </button>
            <button
              @click="confirmDelete(note)"
              class="text-red-400 hover:text-red-600 transition-colors p-1"
              :aria-label="`Delete note: ${note.title}`"
            >
              Delete
            </button>
          </div>
        </li>
      </ul>

      <div v-else-if="!loading" class="text-center py-8 text-gray-500">
        <p v-if="searchQuery">No notes found matching "{{ searchQuery }}"</p>
        <p v-else>No notes yet. Create your first note!</p>
      </div>

      <div class="mb-5">
        <button
          class="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-white group px-3 py-2 w-full justify-center rounded-md border border-transparent hover:border-green-600 transition-colors focus:ring-2 focus:ring-green-500"
          @click="toggleForm"
          @keydown.enter="toggleForm"
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
        @keydown.escape="cancelEdit"
      >
        <h2 class="text-2xl font-bold mb-4">
          {{ editingNoteId === null ? 'Add Note' : 'Edit Note' }}
        </h2>

        <div>
          <input
            ref="titleInput"
            v-model.trim="form.title"
            placeholder="Title"
            class="border rounded-md p-2 w-full focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="{ 'border-red-500': formErrors.title }"
            maxlength="100"
            required
          />
          <p v-if="formErrors.title" class="text-red-500 text-sm mt-1">{{ formErrors.title }}</p>
          <p class="text-gray-400 text-xs mt-1">{{ form.title.length }}/100 characters</p>
        </div>

        <div>
          <textarea
            v-model.trim="form.description"
            placeholder="Description"
            class="border rounded-md p-2 w-full h-32 resize-vertical focus:ring-2 focus:ring-green-500 focus:border-transparent"
            :class="{ 'border-red-500': formErrors.description }"
            maxlength="1000"
            required
          ></textarea>
          <p v-if="formErrors.description" class="text-red-500 text-sm mt-1">
            {{ formErrors.description }}
          </p>
          <p class="text-gray-400 text-xs mt-1">{{ form.description.length }}/1000 characters</p>
        </div>

        <div class="flex flex-col gap-2">
          <button
            class="flex items-center gap-2 cursor-pointer bg-green-600 hover:bg-white hover:text-green-600 text-white group px-3 py-2 w-full justify-center rounded-md border border-transparent hover:border-green-600 transition-colors focus:ring-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
            type="submit"
            :disabled="saving"
          >
            <span
              v-if="saving"
              class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
            ></span>
            {{ saving ? 'Saving...' : editingNoteId === null ? 'Save' : 'Update' }}
          </button>
          <button
            v-if="editingNoteId !== null"
            type="button"
            class="flex items-center gap-2 cursor-pointer hover:bg-green-600 text-green-600 hover:text-white group px-3 py-2 w-full justify-center rounded-md border hover:border-transparent border-green-600 transition-colors focus:ring-2 focus:ring-green-500"
            @click="cancelEdit"
          >
            Cancel
          </button>
        </div>
      </form>

      <div
        v-if="noteToDelete"
        class="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
        @click="cancelDelete"
      >
        <div class="bg-white rounded-lg p-6 max-w-sm mx-4" @click.stop>
          <h3 class="text-lg font-semibold mb-2">Delete Note</h3>
          <p class="text-gray-600 mb-4">
            Are you sure you want to delete "{{ noteToDelete.title }}"? This action cannot be
            undone.
          </p>
          <div class="flex gap-2 justify-end">
            <button
              @click="cancelDelete"
              class="px-4 py-2 text-gray-600 border border-gray-300 rounded hover:bg-gray-50 focus:ring-2 focus:ring-gray-300"
            >
              Cancel
            </button>
            <button
              @click="deleteConfirmed"
              class="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:ring-2 focus:ring-red-500"
              :disabled="deleting"
            >
              {{ deleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, nextTick, watch } from 'vue'
import { addNote, getNotes, deleteNote, updateNote } from '../db/index'
import { Plus } from 'lucide-vue-next'

interface Note {
  id?: number
  title: string
  description: string
  createdAt?: string
  updatedAt?: string
}

interface FormErrors {
  title?: string
  description?: string
}

const notes = ref<Note[]>([])
const form = ref<Note>({ title: '', description: '' })
const formErrors = ref<FormErrors>({})
const editingNoteId = ref<number | null>(null)
const searchQuery = ref('')
const showForm = ref(false)
const loading = ref(false)
const saving = ref(false)
const deleting = ref(false)
const error = ref('')
const noteToDelete = ref<Note | null>(null)

const searchInput = ref<HTMLInputElement>()
const titleInput = ref<HTMLInputElement>()

const filteredNotes = computed(() =>
  notes.value.filter(
    (note) =>
      note.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      note.description.toLowerCase().includes(searchQuery.value.toLowerCase()),
  ),
)

const loadNotes = async () => {
  try {
    loading.value = true
    error.value = ''
    notes.value = await getNotes()
  } catch (err) {
    error.value = 'Failed to load notes. Please try again.'
    console.error('Error loading notes:', err)
  } finally {
    loading.value = false
  }
}

const validateForm = (): boolean => {
  const errors: FormErrors = {}

  if (!form.value.title.trim()) {
    errors.title = 'Title is required'
  } else if (form.value.title.length > 100) {
    errors.title = 'Title must be 100 characters or less'
  }

  if (!form.value.description.trim()) {
    errors.description = 'Description is required'
  } else if (form.value.description.length > 1000) {
    errors.description = 'Description must be 1000 characters or less'
  }

  formErrors.value = errors
  return Object.keys(errors).length === 0
}

const handleSave = async () => {
  if (!validateForm()) return

  try {
    saving.value = true
    const noteData = {
      title: form.value.title.trim(),
      description: form.value.description.trim(),
    }

    if (editingNoteId.value !== null) {
      await updateNote({ ...noteData, id: editingNoteId.value })
    } else {
      await addNote(noteData)
    }

    resetForm()
    await loadNotes()
  } catch (err) {
    error.value = 'Failed to save note. Please try again.'
    console.error('Error saving note:', err)
  } finally {
    saving.value = false
  }
}

const startEdit = async (note: Note) => {
  form.value = { title: note.title, description: note.description }
  editingNoteId.value = note.id ?? null
  showForm.value = true

  await nextTick()
  titleInput.value?.focus()
}

const cancelEdit = () => {
  resetForm()
  showForm.value = false
}

const resetForm = () => {
  form.value = { title: '', description: '' }
  editingNoteId.value = null
  formErrors.value = {}
}

const toggleForm = async () => {
  if (editingNoteId.value !== null) {
    cancelEdit()
    return
  }

  showForm.value = !showForm.value
  if (!showForm.value) {
    resetForm()
  } else {
    await nextTick()
    titleInput.value?.focus()
  }
}

const confirmDelete = (note: Note) => {
  noteToDelete.value = note
}

const cancelDelete = () => {
  noteToDelete.value = null
}

const deleteConfirmed = async () => {
  if (!noteToDelete.value?.id) return

  try {
    deleting.value = true
    await deleteNote(noteToDelete.value.id)
    await loadNotes()
    noteToDelete.value = null
  } catch (err) {
    error.value = 'Failed to delete note. Please try again.'
    console.error('Error deleting note:', err)
  } finally {
    deleting.value = false
  }
}

const formatDate = (dateString?: string): string => {
  if (!dateString) return 'N/A'
  const date = new Date(dateString)
  return date.toLocaleDateString('en-GB', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  })
}

const handleKeyDown = (event: KeyboardEvent) => {
  if (event.key === '/' && !showForm.value && editingNoteId.value === null) {
    event.preventDefault()
    searchInput.value?.focus()
  }

  if (event.key === 'Escape') {
    if (noteToDelete.value) {
      cancelDelete()
    } else if (showForm.value || editingNoteId.value !== null) {
      cancelEdit()
    }
  }
}

watch(
  () => form.value.title,
  () => {
    if (formErrors.value.title) {
      formErrors.value.title = ''
    }
  },
)

watch(
  () => form.value.description,
  () => {
    if (formErrors.value.description) {
      formErrors.value.description = ''
    }
  },
)

onMounted(() => {
  loadNotes()
  document.addEventListener('keydown', handleKeyDown)
})

import { onUnmounted } from 'vue'
onUnmounted(() => {
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
