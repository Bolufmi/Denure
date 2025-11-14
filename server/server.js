const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/music_lyrics_db', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const connection = mongoose.connection;
connection.once('open', () => {
    console.log('MongoDB database connection established successfully');
});

// Models
const songSchema = new mongoose.Schema({
    title: { type: String, required: true },
    artist: { type: String, required: true },
    lyrics: { type: String, required: true },
    spotifyLink: String,
    category: String,
    createdAt: { type: Date, default: Date.now }
});

const Song = mongoose.model('Song', song);

// Routes
app.get('/api/songs', async (req, res) => {
    try {
        const songs = await Song.find();
        res.json(songs);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/songs', async (req, res) => {
    const song = new Song({
        title: req.body.title,
        artist: req.body.artist,
        lyrics: req.body.lyrics,
        spotifyLink: req.body.spotifyLink,
        category: req.body.category
    });

    try {
        const newSong = await song.save();
        res.status(201).json(newSong);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});