<template>
  <li
    class="border-b py-2 flex justify-between items-start hover:bg-gray-50 px-2 transition-colors flex-col"
  >
    <div class="flex justify-between items-center w-full">
      <strong class="block truncate">{{ note.title }}</strong>
      <div>
        <button
          @click="onEdit(note)"
          class="text-gray-400 hover:text-gray-600 transition-colors p-1"
          :aria-label="`Edit note: ${note.title}`"
        >
          Edit
        </button>
        <button
          @click="onDelete(note)"
          class="text-red-400 hover:text-red-600 transition-colors p-1"
          :aria-label="`Delete note: ${note.title}`"
        >
          Delete
        </button>
      </div>
    </div>
    <div>
      <span class="text-gray-600 text-sm whitespace-pre-line">{{ note.description }}</span>
      <div class="flex flex-col text-xs text-gray-400 mt-1">
        <span>Created: {{ formatDate(note.createdAt) }}</span>
        <span v-if="note.updatedAt && note.updatedAt !== note.createdAt">
          Updated: {{ formatDate(note.updatedAt) }}
        </span>
      </div>
    </div>
  </li>
</template>

<script setup lang="ts">
import type { Note } from './AppNotes.vue'

defineProps<{
  note: {
    id?: number
    title: string
    description: string
    createdAt?: string
    updatedAt?: string
  }
  onEdit: (note: Note) => void
  onDelete: (note: Note) => void
}>()

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
</script>
