import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import TodoItem from './TodoItem'

export default function TodoList({ tasks, onToggle, onDelete, onReorder }) {
  if (tasks.length === 0) {
    return (
      <p className="mt-8 text-center text-gray-400">No tasks yet. Add one above!</p>
    )
  }

  const handleDragEnd = (result) => {
    if (!result.destination) return
    const reordered = Array.from(tasks)
    const [removed] = reordered.splice(result.source.index, 1)
    reordered.splice(result.destination.index, 0, removed)
    onReorder(reordered)
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="task-list">
        {(provided) => (
          <ul
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="space-y-2"
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <TodoItem
                    task={task}
                    index={index}
                    onToggle={onToggle}
                    onDelete={onDelete}
                    provided={provided}
                    isDragging={snapshot.isDragging}
                  />
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </ul>
        )}
      </Droppable>
    </DragDropContext>
  )
}
