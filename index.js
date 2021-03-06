const express = require("express");
const knex = require("knex");
const server = express();
const dbConfig = require("./knexfile.js");
const db = knex(dbConfig.development);
const cors = require("cors");
server.use(cors());
server.use(express.json());

server.get("/api/notes", (req, res) => {
  db("notes")
    .select()
    .then(notes => {
      res.status(200).json(notes);
    })
    .catch(err => res.status(404).json({ error: "no notes found" }));
});

server.get("/api/notes/:id", (req, res) => {
  const { id } = req.params;

  db("notes")
    .where("id", "=", id)
    .select()
    .then(notes => {
        if (notes === undefined || notes.length === 0) {
            res.status(404).json({error: "file not found"})
        }
        else {res.status(200).json(notes)}
    })
    .catch(err => res.status(404).json({ error: "no notes found" }));
});

server.post("/api/notes", (req, res) => {
  const { title, content } = req.body;
  db.insert({ title, content })
    .into("notes")
    .then(notes => {
      res.status(201).json(notes);
    })
    .catch(err => res.status(500).json(err));
});

server.put("/api/notes/:id", (req, res) => {
    const { title, content } = req.body;
    const { id } = req.params;
    db("notes")
    .where("id", "=", id)
    .update({title, content})
    .then(count => {
        if (count === 0) {
            res.status(404).json({error: "file not found"})
        }
        else {res.status(200).json(count)}
    })
    .catch(err => {
        res.status(500).json(err);
    })
    
})

server.delete("/api/notes/:id", (req, res) => {
    const { id } = req.params;
    db("notes")
    .where("id", "=", id)
    .del()
    .then(count => {
        if (count === 0) {
            res.status(404).json({error: "file not found"})
        }
        else {res.status(200).json(count)}
    })
    .catch(err => {
        res.status(500).json(err);
    })
})
const port = 3300;
server.listen(port, function() {
  console.log(`\n Web API Listening on localhost:${port}\n`);
});
