import { Trash } from "lucide-react"
import { useState } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"

import { Id, Task } from "@/lib/types"

import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"

interface TaskCardProps {
    task: Task
    deleteTask: (id: Id) => void
    updateTask: (id: Id, content: string) => void
}

const TaskCard = ({ task, deleteTask, updateTask }: TaskCardProps) => {

    const [mosueIsOver, setMouseIsOver] = useState(false)
    const [editMode, setEditMode] = useState(false)

     const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: task.id,
        data: {
            type: "Task",
            task
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    const toggleEditMode = () => {
        setEditMode((prev) => !prev)
        setMouseIsOver(false)
    }

    if (isDragging) {
        return (
            <div 
                ref={setNodeRef}
                style={style} 
                className="flex items-center justify-between p-2.5 border border-slate-50/20 cursor-grab hover:bg-primary-foreground/10 hover:transition-all h[100px] min-h-[100px] rounded-xl w-auto opacity-50"
            >
            </div>
        )
        
    }

    if (editMode) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                {...attributes}
                {...listeners}
                className="flex items-center justify-between p-2.5 border border-slate-50/20 cursor-grab hover:bg-primary-foreground/10 hover:transition-all h[100px] min-h-[100px] rounded-xl w-auto"
            >
                <Textarea 
                    className="bg-primary" 
                    value={task.content} 
                    autoFocus 
                    placeholder="Task content here" 
                    onBlur={toggleEditMode}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && e.shiftKey) toggleEditMode()
                    }}
                    onChange={(e) => updateTask(task.id, e.target.value)}
                />
            </div>
        )
    }

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            className="flex items-center justify-between p-2.5 border border-slate-50/20 cursor-grab hover:bg-primary-foreground/10 hover:transition-all h-[100px] min-h-[100px] rounded-xl w-auto"
            onMouseEnter={() => { setMouseIsOver(true) }}
            onMouseLeave={() => { setMouseIsOver(false) }}
            onClick={toggleEditMode}
        >
            <p className="my-auto h-[90%] w-full overflow-y-auto overflow-x-hidden whitespace-pre-wrap">
                {task.content}
            </p>
            {mosueIsOver && (
                <Button 
                    variant="destructive" 
                    size="icon" 
                    className="opacity-60 hover:opacity-100 hover:transition-all"
                    onClick={() => { deleteTask(task.id) }}
                >
                    <Trash className="h-4 w-5" />
                </Button>
            )}
        </div>
    )
}

export default TaskCard