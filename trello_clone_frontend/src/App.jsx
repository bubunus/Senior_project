import { useEffect, useState } from 'react'
import { Navbar, Container, Button } from 'react-bootstrap'
import ProjectsPage from './components/ProjectsPage'
import BoardPage from './components/BoardPage'

// TODO: Put it in CSS
const boardScrollStyle = {
  display: 'flex',
  gap: '14px',
  alignItems: 'flex-start',
  overflowX: 'auto',
  padding: '1rem',
  flex: 1,
}

// TODO: Clall the Django server API to retrieve project data
const projectsFromAPI = [
  {
    id: 10,
    name: 'Museum Website',
    lists: [
      { id: 11, title: 'Backlog', tasks: [{ id: 111, title: 'Contact page' }, { id: 112, title: 'Redesign footer' }] },
      { id: 12, title: 'Sprint', tasks: [{ id: 121, title: 'News Page' }] },
      { id: 13, title: 'Done', tasks: [{ id: 131, title: 'Home Page' }] },
    ]
  },
  {
    id: 20,
    name: 'Zoo Tickets App',
    lists: [
      { id: 21, title: 'Backlog', tasks: [{ id: 211, title: 'Implement Threads' }] },
      { id: 22, title: 'Sprint', tasks: [] },
    ]
  },
]

let nextId = 1000
function generateId() {
  nextId = nextId + 1
  return nextId
}

export { boardScrollStyle, generateId }

const App = () => {
  const [projects, setProjects] = useState(projectsFromAPI)
  const [activeProjectId, setActiveProjectId] = useState(null)

  const activeProject = projects.find(p => p.id === activeProjectId) || null

  useEffect(() => {
    fetch('http://127.0.0.1:8000/api/projects/')
    .then(response => response.json())
    .then(data => {
      // const retrievedProjects = data.map(item => ({
      //   ...item, lists: []
      // }))
      setProjects([...projects, ...data])
    })
  }, [])


  function addProject(name) {
    const newProject = { id: generateId(), name: name, lists: [] }
    setProjects([...projects, newProject])
  }

  function saveProject(updatedProject) {
    setProjects(projects.map(p => p.id === updatedProject.id ? updatedProject : p))
  }

  return (
    <div className="d-flex flex-column min-vh-100">

      <Navbar bg="dark" variant="dark">
        <Container fluid className="px-3">
          <Navbar.Brand onClick={() => setActiveProjectId(null)} style={{ cursor: 'pointer' }}>
            TrelloClone
          </Navbar.Brand>
          {activeProject && (
            <Button variant="outline-light" size="sm" onClick={() => setActiveProjectId(null)}>
              ← All Projects
            </Button>
          )}
        </Container>
        
      </Navbar>

      {activeProject === null ? (
        <ProjectsPage
          projects={projects}
          onOpenProject={setActiveProjectId}
          onAddProject={addProject}
        />
      ) : (
        <BoardPage
          project={activeProject}
          onSaveProject={saveProject}
        />
      )}

    </div>
  )
}

export default App;
