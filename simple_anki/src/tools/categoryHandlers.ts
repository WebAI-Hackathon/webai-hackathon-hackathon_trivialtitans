import { decks } from '../store/deckStore'
import { generateImage } from './generationTools'

export function handleCreateCategory(event: any) {
  const { name } = event.detail

  const alreadyExists = decks.value.some(deck => deck.topic === name)
  if (alreadyExists) {
    event.detail.success = false
    event.detail.error = `Category "${name}" already exists.`
    return
  }

  const newDeck = {
    topic: name,
    created: Date.now(),
    modified: Date.now(),
    id: Date.now().toString(),
    cards: []
  }

  decks.value.push(newDeck)

  event.detail.success = true
  event.detail.message = `Category "${name}" created successfully.`
}

export async function handleCreateImagesByCategory(event: any) {
  console.log('[VOIX] Tool triggered:', event.detail)

  const { category, count } = event.detail

  console.log('[VOIX] category:', category)
  console.log('[VOIX] count:', count)

  const deck = decks.value.find(d => d.topic.toLowerCase() === category.toLowerCase())
  console.log('[VOIX] deck found:', deck)

  if (!deck) {
    console.error('[VOIX] No deck found for category:', category)
    event.detail.success = false
    event.detail.error = `Category "${category}" not found.`
    return
  }

  if (!Array.isArray(deck.cards)) {
    console.warn('[VOIX] Deck has no cards array — initializing it.')
    deck.cards = []
  }

  try {
    for (let i = 0; i < count; i++) {
      const prompt = `${category}, concept ${i + 1}`
      console.log(`[VOIX] Generating image for prompt: ${prompt}`)

      const b64Image = await generateImage(prompt)

      console.log('[VOIX] Image generated.')

      deck.cards.push({
        image: b64Image,
        description: `Generated image for ${category} (${i + 1})`,
        review: {
          lastReviewed: Date.now(),
          nextDue: Date.now() + 3 * 86400000,
          interval: 3,
          repetition: 1
        }
      })
    }

    deck.modified = Date.now()
    event.detail.success = true
    event.detail.message = `${count} images generated for "${category}"`
  } catch (err: any) {
    console.error('[VOIX] Failed during generation:', err)
    event.detail.success = false
    event.detail.error = `Failed to generate images: ${err.message}`
  }
}