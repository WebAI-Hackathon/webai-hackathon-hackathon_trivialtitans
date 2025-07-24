import { ref } from 'vue'

export const lastGeneratedCard = ref<{
  imageBase64: string
  description: string
  concept: string
} | null>(null)

export function setLastGeneratedCard(data: {
  imageBase64: string
  description: string
  concept: string
}) {
  lastGeneratedCard.value = data
}

export function resetBuffer() {
  lastGeneratedCard.value = null
}