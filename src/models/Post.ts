import mongoose from 'mongoose'

const PostSchema = new mongoose.Schema({
    id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    summary: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    tags: [String],
    creator: {
        type: mongoose.Types.ObjectId,
        required: true
    }
}, {
    timestamps: true
})

export default mongoose.model('Post', PostSchema)
