// node server/exportApkg.js
import express from 'express'
import cors     from 'cors'
import { fileTypeFromBuffer } from 'file-type'
import pkg from 'anki-apkg-export'
const ApkgExporter = pkg.default || pkg

const app = express()
app.use(cors())
app.use(express.json({ limit: '25mb' }))   // handle big base-64 payloads

app.post('/api/export-apkg', async (req, res) => {
  const decks = req.body   //  ← send your decks JSON

  if (!Array.isArray(decks) || !decks.length)
    return res.status(400).json({ error: 'No decks in payload' })

  // Combine all cards into one array
  const allCards = []
  for (const deck of decks) {
    for (const card of deck.cards ?? []) {
      if (card.image) {
        allCards.push({ card, topic: deck.topic })
      }
    }
  }

  if (!allCards.length)
    return res.status(400).json({ error: 'No images found in decks' })

  // Shuffle the cards
  const shuffledCards = allCards.sort(() => Math.random() - 0.5)

  // Create one big deck called "ImageExport"
  const exporter = new ApkgExporter('ImageExport') // Renamed to avoid shadowing
  let mediaIndex = 0

  for (const { card, topic } of shuffledCards) {
    const b64 = card.image.split(',')[1]
    const buf = Buffer.from(b64, 'base64')
    const { ext = 'jpg' } = (await fileTypeFromBuffer(buf)) || {}
  
    const fileName = `${topic.replace(/\s+/g,'_')}_${mediaIndex}.${ext}`
    await exporter.addMedia(fileName, buf)
    mediaIndex++
  
    const front = `<img src="${fileName}">`
    const back  = card.description ?? ''
    exporter.addCard(front, back)
  }

  const apkgBuf = await exporter.save()

  res.set({
    'Content-Type': 'application/apkg',
    'Content-Disposition': 'attachment; filename="export.apkg"'
  })
  res.send(apkgBuf)
})

app.listen(3001, () =>
  console.log('APKG exporter ready → http://localhost:3001')
)
