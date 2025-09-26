import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createClient } from "@supabase/supabase-js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.json());
app.use(express.static(path.join(__dirname, "static")));

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

app.get("/api/tasks", async (req, res) => {
  const { complete } = req.query;
  let query = supabase.from("tasks").select("*");

  if (complete) {
    query = query.eq("complete", complete === "true");
  }

  const { error, data } = await query;

  if (error) {
    res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.get("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;

  const { error, data } = await supabase
    .from("tasks")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    res.status(404).json({ error: `Task with ${id} not found` });
  } else {
    res.json(data);
  }
});

app.post("/api/tasks", async (req, res) => {
  const { title, description, complete } = req.body;

  if (!title || !description) {
    return res
      .status(404)
      .json({ error: "Title, description and complete are required" });
  }

  const { error, data } = await supabase
    .from("tasks")
    .insert([{ title, description, complete: complete || false }])
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.status(201).json(data);
});

app.put("/api/tasks/:id", async (req, res) => {
  const { id } = req.params;
  const { title, description, complete } = req.body;

    const updateData ={};
    if(title) updateData.title = title;
    if(description) updateData.description = description;
    if(complete) updateData.complete = complete;

    if(Object.keys(updateData).length ===0){
        return res.status(400).json({error: 'No data provided for update'});
    }

  const { error, data } = await supabase
    .from("tasks")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return res.status(500).json({ error: error.message });
  }

  res.json(data);
});

app.delete('/api/tasks/:id', async (req, res) =>{
    const {id} =req.params;

    const{error, data} = await supabase.from('tasks').delete().eq('id',id);

    if(error){
        return res.status(500).json({error:error.message});
    }

    res.json({ message: `Task with id ${id} deleted successfully` });
});

app.listen(port);