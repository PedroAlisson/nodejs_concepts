const express = require("express");
const { uuid, isUuid } = require("uuidv4");

const app = express();
app.use(express.json());

const projects = [];

// function method(request, response, next) {
//   const { method, url } = request;
//   console.time(`[$method], ($url)`);

//   console.timeEnd();
// }

function log(request, response, next) {
  const { method, url } = request;
  const log = `[${method.toUpperCase()}] ${url}`;

  console.time(log);
  next();
  console.timeEnd(log);
}

function validade(request, response, next) {
  const { id } = request.params;
  //const para = `[${method.toUpperCase()}] ${url}`

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Id invalide" });
  }
  return next();
}

app.use(log);

app.use("/project/:id", validade);

app.get("/project", (request, response) => {
  const { title } = request.query;

  const results = title
    ? projects.filter((project) => project.title.includes(title))
    : projects;
  return response.json(results);
});

app.post("/project", (request, response) => {
  const { title, owner } = request.body;
  const project = { id: uuid(), title, owner };
  projects.push(project);
  return response.json(project);
});

app.put("/project/:id", (request, response) => {
  const { id } = request.params;
  const { title, owner } = request.body;
  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project Not Found" });
  }
  const project = {
    id,
    title,
    owner,
  };
  projects[projectIndex] = project;

  return response.json(project);
});

app.delete("/project/:id", (request, response) => {
  const { id } = request.params;

  const projectIndex = projects.findIndex((project) => project.id === id);

  if (projectIndex < 0) {
    return response.status(400).json({ error: "Project Not Found" });
  }

  projects.splice(projectIndex, 1);
  return response.status(204).send();
});

app.listen(3333, () => console.log("Start"));
