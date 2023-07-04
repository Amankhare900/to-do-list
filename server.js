const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;

//middle ware
app.use(express.static("public"));
app.use(express.static("uploads"));
//app.use(express.urlencoded());
app.use(express.json());
const multer = require("multer");
const upload = multer({ dest: "uploads/" });
app.get("/get-todo", (req, res) => {
  fs.readFile("./data.txt", "utf-8", (err, data) => {
    let todos;
    if (data.length === 0) {
      todos = [];
    } else {
      todos = JSON.parse(data);
    }
    res.json(todos);
  });
});
app.delete("/delete-todo", (req, res) => {
  fs.readFile("./data.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err.toString());
    } else {
      let todos = JSON.parse(data);
      console.log(req.body.id);
      let fileName = todos[req.body.id].filename;
      fs.unlink(`uploads/${fileName}`, (err) => {
        if (err) {
          console.log(err.toString());
        } else {
          console.log("deleted");
        }
      });
      delete todos[req.body.id];

      fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send("success");
        }
      });
    }
  });
});

app.put("/complete-todo", (req, res) => {
  fs.readFile("./data.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err.toString());
    } else {
      let todos = JSON.parse(data);
      console.log(req.body.id);
      todos[req.body.id].isChecked = req.body.isChecked;
      fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send("success");
        }
      });
    }
  });
});

app.put("/update-todo", (req, res) => {
  fs.readFile("./data.txt", "utf-8", (err, data) => {
    if (err) {
      console.log(err.toString());
    } else {
      let todos = JSON.parse(data);
      todos[req.body.id].task = req.body.task;
      fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
        if (err) {
          console.log(err);
        } else {
          res.send("success");
        }
      });
    }
  });
});

app.post("/save-todo", upload.single("image"), (req, res) => {
  console.log(req.file.filename);
  console.log(req.body.task);
  // return;
  fs.readFile("./data.txt", (err, data) => {
    if (err) {
      console.log(err);
    } else {
      let todos;
      if (data.length === 0) {
        todos = new Map();
        todos["currIdNo"] = 0;
      } else {
        todos = JSON.parse(data);
      }
      id = todos.currIdNo++;
      todos[id] = {
        task: req.body.task,
        isChecked: false,
        filename: req.file.filename,
      };
      fs.writeFile("./data.txt", JSON.stringify(todos), (err) => {
        if (err) {
          console.log(err.toString());
        } else {
          res.send(req.file.filename);
        }
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

// schema
// {
//   id: {
//     task: "task",
//     isChecked: true
//   },
//   currIdNo: int,
// }
