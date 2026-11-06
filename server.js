
const express = require("express");
const cors = require("cors");
const db = require("./database");

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

// ================= HOME PAGE =================
app.get("/", (req, res) => {
    res.sendFile(__dirname + "/public/index.html");
});

// ================= VIEW ALL BOOKS =================
app.get("/books", (req, res) => {
    db.query("SELECT * FROM books", (err, result) => {
        if (err) {
            console.log("Books Error:", err.message);
            return res.status(500).json({ error: err.message });
        }

        res.json(result);
    });
});

// ================= VIEW SINGLE BOOK =================
app.get("/books/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "SELECT * FROM books WHERE book_id = ?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.length === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json(result[0]);
        }
    );
});

// ================= ADD BOOK =================
app.post("/books", (req, res) => {
    const { book_name, author, category, price, stock } = req.body;

    const sql = `
        INSERT INTO books (book_name, author, category, price, stock)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.query(sql, [book_name, author, category, price, stock], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        res.json({
            message: "Book added successfully!",
            book_id: result.insertId
        });
    });
});

// ================= UPDATE BOOK =================
app.put("/books/:id", (req, res) => {
    const { book_name, author, category, price, stock } = req.body;
    const id = req.params.id;

    const sql = `
        UPDATE books
        SET book_name=?, author=?, category=?, price=?, stock=?
        WHERE book_id=?
    `;

    db.query(sql, [book_name, author, category, price, stock, id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Book not found"
            });
        }

        res.json({
            message: "Book updated successfully!"
        });
    });
});

// ================= DELETE BOOK =================
app.delete("/books/:id", (req, res) => {
    const id = req.params.id;

    db.query(
        "DELETE FROM books WHERE book_id=?",
        [id],
        (err, result) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Book not found"
                });
            }

            res.json({
                message: "Book deleted successfully!"
            });
        }
    );
});

// ================= START SERVER =================
const PORT = 3000;

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
