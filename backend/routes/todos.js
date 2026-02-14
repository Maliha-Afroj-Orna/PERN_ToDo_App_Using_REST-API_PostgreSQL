import { Router } from "express";
import pool from "../db.js";

const router = Router();

// create a new todo
router.post("/", async (req, res) => {
  try {
    const { description, completed } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const newTodo = await pool.query(
      "INSERT INTO todo (description, completed) VALUES ($1, $2) RETURNING *",
      [description, completed || false],
    );
    res.json(newTodo.rows[0]);
  } catch (error) {
    console.log(error.message);
    res.status(500).send("Server Error");
  }
});

// get all todos
router.get("/", async (req, res) => {
  try {
    const allTodos = await pool.query("SELECT * FROM todo");
    res.json(allTodos.rows);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// update a todo
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { description, completed } = req.body;
    if (!description) {
      return res.status(400).json({ error: "Description is required" });
    }
    const updatedTodo = await pool.query(
      "UPDATE todo SET description = $1, completed = $2 WHERE todo_id = $3 RETURNING *",
      [description, completed || false, id],
    );
    if (updatedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found!" });
    }

    res.json({
      message: "Todo was updated",
      todo: updatedTodo.rows[0],
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

// delete a todo
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTodo = await pool.query(
      "DELETE FROM todo WHERE todo_id = $1 RETURNING *",
      [id],
    );
    if (deletedTodo.rows.length === 0) {
      return res.status(404).json({ error: "Todo not found!" });
    }
    res.json("Todo was deleted");
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server Error");
  }
});

export default router;
