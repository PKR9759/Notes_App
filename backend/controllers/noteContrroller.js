const pool = require("./../config/db");

const createNote = async (req, res) => {

    try {
        const { title, body, category } = req.body;
        console.log("Request body:", req.body); // Log the request body to see what is being sent
        const userId = req.user.id;
        console.log("User ID:", userId); // Log the user ID to ensure it's being retrieved correctly

        const query = `
            INSERT INTO notes (title, body, category, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING id, title, body, category, created_at;
        `;

        const values = [title, body, category, userId];

        const result = await pool.query(query, values);

        res.status(201).json({
            message: "Note created successfully",
            note: result.rows[0]
        });
    }   catch (err) {        
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}



const getNotes = async (req, res) => {
    try {
        const userId = req.user.id;

        const query = `
            SELECT id, title, body, category, created_at
            FROM notes
            WHERE user_id = $1;
        `;

        const result = await pool.query(query, [userId]);

        res.status(200).json({
            message: "Notes retrieved successfully",
            notes: result.rows
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const pinNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const query = `
            UPDATE notes
            SET pinned = NOT pinned
            WHERE id = $1 AND user_id = $2
            RETURNING id, title, body, category, pinned, created_at;
        `;

        const result = await pool.query(query, [noteId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found or you do not have permission to pin this note."
            });
        }

        res.status(200).json({
            message: "Note pin status toggled successfully",
            note: result.rows[0]
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

const editNote = async (req, res) => {
    try {
        // console.log("Request body:", req.body); // Log the request body to see what is being sent
        const { noteId } = req.params;
        const { title, body, category } = req.body;
        const userId = req.user.id;
        // console.log(noteId)

        const query = `
            UPDATE notes
            SET title = $1, body = $2, category = $3
            WHERE id = $4 AND user_id = $5
            RETURNING id, title, body, category, created_at;
        `;

        const values = [title, body, category, noteId, userId];

        const result = await pool.query(query, values);
        console.log("res:", result); // Log the query to verify its correctness

        console.log("Updated note:", result.rows[0]); // Log the updated note to verify the changes

        res.status(200).json({
            message: "Note updated successfully",
            note: result.rows[0]
        });
    } catch (err) {
        console.error(err);        
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}


const deleteNote = async (req, res) => {
    try {
        const { noteId } = req.params;
        const userId = req.user.id;

        const query = `
            DELETE FROM notes
            WHERE id = $1 AND user_id = $2
            RETURNING id;
        `;

        const result = await pool.query(query, [noteId, userId]);

        if (result.rows.length === 0) {
            return res.status(404).json({
                message: "Note not found or you do not have permission to delete this note."
            });
        }        

        res.status(200).json({
            message: "Note deleted successfully"
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
}

module.exports = { createNote, getNotes, pinNote, editNote, deleteNote };