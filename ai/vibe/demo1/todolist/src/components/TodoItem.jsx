export default function TodoItem({ task, onToggle, onDelete, provided, isDragging }) {
  return (
    <li
      ref={provided.innerRef}
      {...provided.draggableProps}
      className={`flex items-center gap-3 rounded-lg border border-gray-200 bg-white px-4 py-3 transition-shadow hover:shadow-sm ${
        isDragging ? 'shadow-lg ring-2 ring-blue-200' : ''
      }`}
    >
      <span
        {...provided.dragHandleProps}
        className="cursor-grab text-gray-300 hover:text-gray-500"
      >
        ⠿
      </span>
      <input
        type="checkbox"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
        className="h-5 w-5 cursor-pointer accent-blue-500"
      />
      <span
        className={`flex-1 text-gray-700 ${
          task.completed ? 'text-gray-400 line-through' : ''
        }`}
      >
        {task.text}
      </span>
      <button
        onClick={() => onDelete(task.id)}
        className="rounded-md px-2 py-1 text-sm text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500"
      >
        Delete
      </button>
    </li>
  )
}
