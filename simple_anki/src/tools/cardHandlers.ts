import { decks } from '@/store/deckStore'
import { generateImage } from './generationTools'

export async function handleGenerateNewCard(event: any) {
  if (!event?.detail) {
    console.error('Event or event.detail is undefined')
    return
  }

  const { category, details } = event.detail

  // Validate category exists
  if (!category) {
    event.detail.success = false
    event.detail.message = 'Category is required but was not provided'
    console.error('Category is undefined:', { eventDetail: event.detail })
    return
  }

  console.log('Processing category:', category, 'with details:', details)

  // Find the deck that matches the chosen category (case insensitive).
  const deck = decks.value.find((d) => 
    d.topic && d.topic.toLowerCase() === category.toLowerCase()
  )

  if (!deck) {
    event.detail.success = false
    event.detail.message = `Deck with category "${category}" not found.`
    console.error('No deck found for category:', category)
    return
  }

  try {
    // Build a detailed prompt by combining the category and additional details.
    const prompt = details ? `${category}, ${details}` : category
    console.log('Generated prompt:', prompt)

    // Generate the image using your image-generator tool.
    const b64Image = await generateImage(prompt)
    
    // Create a new card with the generated image and a descriptive caption.
    const newCard = {
      image: b64Image,
      description: details
        ? `New image for ${category}: ${details}`
        : `New image for ${category}`,
      review: {
        lastReviewed: Date.now(),
        nextDue: Date.now() + 3 * 86400000, // next due in 3 days
        interval: 3,
        repetition: 1
      }
    }

    // Ensure the deck has a cards array.
    if (!Array.isArray(deck.cards)) {
      deck.cards = []
    }

    // Add the new card to the deck.
    deck.cards.push(newCard)
    deck.modified = Date.now()

    event.detail.success = true
    event.detail.message = `Generated new card for category "${category}".`
    console.log('Successfully generated new card for category:', category)
  } catch (err: any) {
    event.detail.success = false
    event.detail.message = `Failed to generate new card: ${err.message}`
    console.error('Error generating card:', err)
  }
}