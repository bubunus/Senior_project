import { useState } from 'react'
import { Card, Form, Button, Badge } from 'react-bootstrap'
import { useDroppable } from '@dnd-kit/core'
import { SortableContext, useSortable, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

let nextId = 9000
function generateId() {
  nextId = nextId + 1
  return nextId
}

const colStyle = { width: '264px', flexShrink: 0, maxHeight: 'calc(100vh - 150px)', display: 'flex', flexDirection: 'column' }
const bodyStyle = { flex: 1, overflowY: 'auto', padding: '0 0.5rem' }

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition,
    opacity: isDragging ? 0.4 : 1,
    cursor: 'grab',
  }

  return (
    <Card ref={setNodeRef} style={style} className="mb-2" {...attributes} {...listeners}>
      <Card.Body className="py-2 px-3 small">{task.title}</Card.Body>
    </Card>
  )
}

const ListColumn = ({ list, onSaveList }) => {
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')

  const { setNodeRef } = useDroppable({ id: list.id })

  function handleAddTask() {
    const title = newTitle.trim()
    if (!title) return
    const newTask = { id: generateId(), title: title }
    onSaveList({ ...list, tasks: [...list.tasks, newTask] })
    setNewTitle('')
  }

  function handleCancel() {
    setNewTitle('')
    setShowForm(false)
  }

  return (
    <Card style={colStyle} className="bg-light">

      <Card.Header className="d-flex justify-content-between align-items-center py-2">
        <span className="fw-semibold small">{list.title}</span>
        <Badge bg="secondary" className="fw-normal">{list.tasks.length}</Badge>
      </Card.Header>

      <SortableContext items={list.tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
        <div style={bodyStyle} ref={setNodeRef} className="pt-2">

          {list.tasks.map(task => (
            <TaskCard key={task.id} task={task} />
          ))}

          {showForm && (
            <Card className="mb-2 border-primary">
              <Card.Body className="p-2">
                <Form.Control
                  as="textarea"
                  autoFocus
                  rows={2}
                  placeholder="Task title..."
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  onKeyDown={e => {
                    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAddTask() }
                    if (e.key === 'Escape') handleCancel()
                  }}
                  className="mb-2"
                  size="sm"
                />
                <div className="d-flex gap-2">
                  <Button size="sm" variant="dark" onClick={handleAddTask}>Add task</Button>
                  <Button size="sm" variant="outline-secondary" onClick={handleCancel}>Cancel</Button>
                </div>
              </Card.Body>
            </Card>
          )}

        </div>
      </SortableContext>

      <Card.Footer className="bg-light border-0 pt-0">
        {!showForm && (
          <Button variant="link" size="sm" className="text-muted p-0" onClick={() => setShowForm(true)}>
            + Add a task
          </Button>
        )}
      </Card.Footer>

    </Card>
  )
}

export default ListColumn;
