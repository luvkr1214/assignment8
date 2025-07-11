require("dotenv").config(); 
const express = require("express");
const mongoose = require("mongoose");
const Task = require("./models/task");

const app = express();


app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
console.log("✅ MONGO_URI from environment:", process.env.MONGO_URI);


mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
    insertSampleTask(); 
  })
  .catch((err) => {
    console.error(" MongoDB connection error:", err.message);
  });

// 
async function insertSampleTask() {
  const count = await Task.countDocuments();
  if (count === 0) {
await Task.create({ name: taskText });
    console.log("📥 Inserted sample task.");
  }
}


app.get('/', async (req, res) => {
  const tasks = await Task.find();
  const error = req.query.error;
  const alert = req.query.alert;

  res.render('index', {
    tasks,
    error,
    alert,                // ✅ This is required
    editTaskId: null,
    taskToEdit: {}
  });
});




app.get('/edit', async (req, res) => {
  const taskId = req.query.taskId;

  try {
    const tasks = await Task.find();
    const taskToEdit = await Task.findById(taskId);

   res.render('index', {
  tasks,
  error: null,
  alert: null,  // ✅ Important
  editTaskId: taskId,
  taskToEdit
});

  } catch (err) {
    console.error("Edit route error:", err.message);
    res.redirect('/');
  }
});




app.post('/add', async (req, res) => {
  const taskText = req.body.task.trim();
  if (!taskText) {
    return res.redirect('/?error=empty');
  }
  await Task.create({ content: taskText });
  res.redirect('/?alert=taskAdded');
});


app.post("/delete", async (req, res) => {
  const id = req.body.taskId;
  await Task.findByIdAndDelete(id);
  res.redirect("/?alert=taskDeleted");
});
;


app.post("/edit/:id", async (req, res) => {
  const taskId = req.params.id;
  const newContent = req.body.updatedTask;
  await Task.findByIdAndUpdate(taskId, { content: newContent });
  res.redirect("/?alert=taskUpdated");
});





const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server started on http://localhost:${PORT}`);
});
