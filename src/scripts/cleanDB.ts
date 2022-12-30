import dotenv from 'dotenv'
import { Db, Document, MongoClient } from 'mongodb'
import { exit } from 'process'

dotenv.config()
const { DATABASE_URL } = process.env

if (!DATABASE_URL) exit()

const client = new MongoClient(DATABASE_URL);

const dbName = 'trivia'

console.log(DATABASE_URL)

const nonstandardCharsRegex = /[^a-zA-Z0-9 ]/

const clean = async () => {
    await client.connect();
    console.log('Connected successfully to server')
    const db = client.db(dbName);


    await removeQuotes(db)
    await removeEscapeChars(db)
    await removeLeadingParenthesis(db)
    await removeTrailingParenthesis(db)
    await removeMarkup(db)

    exit()
}

interface BulkWriteOperation {
    updateOne: {
        filter: object;
        update: object;
    }
}

const buildCleaner = (name: string, regex: RegExp, cleaner: (match: RegExpMatchArray, doc: Document) => string) => {
    return async (db: Db) => {
        const collection = db.collection('clues');
        const cursor = collection.find({ answer: { $regex: regex } })

        const updates: BulkWriteOperation[] = []

        for await (const doc of cursor) {
            const match = doc.answer.match(regex)
            const answer = cleaner(match, doc)

            updates.push({
                updateOne: {
                    filter: { _id: doc._id },
                    update: { $set: { answer: answer } }
                }
            })
        }

        if (updates.length < 1){
            console.log(`found 0 updates to ${name}`)
            return
        } 

        await db.collection('clues').bulkWrite(updates)
        console.log(`wrote ${updates.length} updates to ${name}`)
    }
}

const removeMarkup = buildCleaner('remove markup', /<.*>(.*)<.*>/, (match) => match[1])
const removeLeadingParenthesis = buildCleaner('remove leading parenthesis', /\(([^)]+)\) /, (match, doc) => doc.answer.replace(match[0], ''))
const removeTrailingParenthesis = buildCleaner('remove trailing parenthesis', / \(([^)]+)\)/, (match, doc) => doc.answer.replace(match[0], ''))
const removeEscapeChars = buildCleaner('remove escape chars', /\\/, (match, doc) => doc.answer.replace('\\', ''))
const removeQuotes = buildCleaner('remove quotes', /\"/, (match, doc) => doc.answer.replace('\"', ''))

clean()