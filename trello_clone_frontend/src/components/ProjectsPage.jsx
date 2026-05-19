import { useState } from 'react'
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap'

const ProjectsPage = ({ projects, onOpenProject, onAddProject }) => {
  const [showForm, setShowForm] = useState(false)
  const [newName, setNewName] = useState('')

  function handleAdd() {
    const name = newName.trim()
    if (!name) return
    onAddProject(name)
    setNewName('')
    setShowForm(false)
  }

  function handleCancel() {
    setNewName('')
    setShowForm(false)
  }

  function countTasks(project) {
    let total = 0
    for (const list of project.lists) {
      total = total + list.tasks.length
    }
    return total
  }

  return (
    <Container className="py-4">

      <h1 className="fs-4 fw-bold mb-1">Your projects</h1>
      <p className="text-muted mb-4">{projects.length} project{projects.length !== 1 ? 's' : ''}</p>

      <Row xs={1} sm={2} md={3} lg={4} className="g-3">

        {projects.map((project) => (
          <Col key={project.id}>
            <Card
              className="h-100"
              style={{ cursor: 'pointer' }}
              onClick={() => onOpenProject(project.id)}
            >
              <Card.Body>
                <Card.Title className="fs-6">{project.name}</Card.Title>
                <div className="d-flex gap-2">
                  <Badge bg="secondary" className="fw-normal">{project.lists.length} lists</Badge>
                  <Badge bg="secondary" className="fw-normal">{countTasks(project)} tasks</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        <Col>
          {showForm ? (
            <Card>
              <Card.Body>
                <Form.Control
                  autoFocus
                  placeholder="Project name..."
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleAdd(); if (e.key === 'Escape') handleCancel() }}
                  className="mb-2"
                  size="sm"
                />
                <div className="d-flex gap-2">
                  <Button size="sm" variant="dark" onClick={handleAdd}>Add project</Button>
                  <Button size="sm" variant="outline-secondary" onClick={handleCancel}>Cancel</Button>
                </div>
              </Card.Body>
            </Card>
          ) : (
            <Card
              className="h-100 border-dashed text-muted"
              style={{ cursor: 'pointer', border: '2px dashed #dee2e6', background: 'transparent' }}
              onClick={() => setShowForm(true)}
            >
              <Card.Body className="d-flex align-items-center gap-2">
                + New project
              </Card.Body>
            </Card>
          )}
        </Col>

      </Row>
    </Container>
  )
}

export default ProjectsPage;