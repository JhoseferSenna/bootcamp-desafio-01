const express = require("express");

const server = express();

server.use(express.json());

//Midleware: contador global de requisições
server.use((req, res, next) => {
  requests++;
  console.log(`A requisição foi chamada ${request} vezes`);
  return next();
});

const projects = [];
let requests = 0;

function checkIdProject(req, res, next) {
  const { id } = req.params;
  const project = projects.find(obj => obj.id == id);
  if (!project) {
    return res.status(400).json({ error: "Project not found" });
  }
  return next();
}

server.post("/projects", (req, res) => {
  const { id, title } = req.body;
  const project = {
    id,
    title,
    tasks: []
  };
  projects.push(project);
  return res.json(project);
});

server.get("/projects", (req, res) => {
  return res.json(projects);
});

server.put("/projects/:id", checkIdProject, (req, res) => {
  //Exemplo de como Encontrar objeto dentro de um array
  //const list = [
  //  { id: 1, name: 'Suissa' },
  //  { id: 2, name: 'Jean' }
  //]
  //const result = list.find( obj => obj.name === 'Suissa' )
  //console.log( result ) // { id: 1, name: 'Suissa' }

  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(obj => obj.id == id);
  project.title = title;
  return res.json(project);
});

server.delete("/projects/:id", checkIdProject, (req, res) => {
  const { id } = req.params;
  //COMO REMOVER DETERMINADOS ELEMENTOS DE UMA ARRAY NO JAVASCRIPT
  //var array = [2, 4, 5, 7, 8];
  //var index = array.indexOf(7);
  //if ( index > -1) {
  //  array.splice(index, 1);
  //}
  const project = projects.indexOf(obj => obj.id == id);
  projects.splice(project, 1);
  return res.send();
});

server.post("/projects/:id/tasks", checkIdProject, (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  const project = projects.find(obj => obj.id == id);
  project.tasks.push(title);
  return res.json();
});

server.listen(2000);
