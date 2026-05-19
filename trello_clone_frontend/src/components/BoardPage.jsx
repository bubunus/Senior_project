import { useState } from 'react'
import { Card, Form, Button } from 'react-bootstrap'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import ListColumn from './ListColumn'

let nextId = 5000
function generateId() {
  nextId = nextId + 1
  return nextId
}

const boardWrapStyle = { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }
const boardScrollStyle = { display: 'flex', gap: '14px', alignItems: 'flex-start', overflowX: 'auto', padding: '1rem', flex: 1 }
const newListColStyle = { width: '264px', flexShrink: 0, alignSelf: 'flex-start' }
const addListBtnStyle = { width: '248px', flexShrink: 0, alignSelf: 'flex-start', cursor: 'pointer', border: '2px dashed #dee2e6', background: 'transparent' }

const BoardPage = ({ project, onSaveProject }) => {
  const [showForm, setShowForm] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [draggingTask, setDraggingTask] = useState(null)

  // NOTE: add some "delay" in drag anbd drop, activate ;only after drag and move more than 5 pixels.
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  )

  function handleAddList() {
    const title = newTitle.trim()
    if (!title) return
    const newList = { id: generateId(), title: title, tasks: [] }
    onSaveProject({ ...project, lists: [...project.lists, newList] })
    setNewTitle('')
    setShowForm(false)
  }

  function handleCancel() {
    setNewTitle('')
    setShowForm(false)
  }

  function handleSaveList(updatedList) {
    const updatedLists = project.lists.map(l => l.id === updatedList.id ? updatedList : l)
    onSaveProject({ ...project, lists: updatedLists })
  }

  function findListWithTask(taskId) {
    return project.lists.find(list => list.tasks.some(task => task.id === taskId))
  }

  function handleDragStart(event) {
    const list = findListWithTask(event.active.id)
    const task = list?.tasks.find(t => t.id === event.active.id)
    setDraggingTask(task || null)
  }

  function handleDragOver(event) {
    const { active, over } = event
    if (!over) return

    const sourceList = findListWithTask(active.id)
    if (!sourceList) return

    const targetList =
      project.lists.find(l => l.id === over.id) ||
      findListWithTask(over.id)

    if (!targetList || sourceList.id === targetList.id) return

    const task = sourceList.tasks.find(t => t.id === active.id)
    const updatedLists = project.lists.map(list => {
      if (list.id === sourceList.id) return { ...list, tasks: list.tasks.filter(t => t.id !== active.id) }
      if (list.id === targetList.id) return { ...list, tasks: [...list.tasks, task] }
      return list
    })
    onSaveProject({ ...project, lists: updatedLists })
  }

  function handleDragEnd() {
    setDraggingTask(null)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={boardWrapStyle}>
        <div className="px-3 pt-3">
          <h2 className="fs-5 fw-bold">{project.name}</h2>
        </div>

        <div style={boardScrollStyle}>

          {project.lists.map(list => (
            <ListColumn key={list.id} list={list} onSaveList={handleSaveList} />
          ))}

          {showForm ? (
            <div style={newListColStyle}>
              <Card>
                <Card.Body className="p-2">
                  <Form.Control
                    autoFocus
                    placeholder="List title..."
                    value={newTitle}
                    onChange={e => setNewTitle(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') handleAddList(); if (e.key === 'Escape') handleCancel() }}
                    className="mb-2"
                    size="sm"
                  />
                  <div className="d-flex gap-2">
                    <Button size="sm" variant="dark" onClick={handleAddList}>Add list</Button>
                    <Button size="sm" variant="outline-secondary" onClick={handleCancel}>Cancel</Button>
                  </div>
                </Card.Body>
              </Card>
            </div>
          ) : (
            <Card style={addListBtnStyle} className="text-muted" onClick={() => setShowForm(true)}>
              <Card.Body>+ Add list</Card.Body>
            </Card>
          )}

        </div>
      </div>

      <DragOverlay>
        {draggingTask && (
          <Card style={{ opacity: 0.9, transform: 'rotate(1.5deg)', cursor: 'grabbing' }}>
            <Card.Body className="py-2 px-3 small">{draggingTask.title}</Card.Body>
          </Card>
        )}
      </DragOverlay>

    </DndContext>
  )
}

export default BoardPage;