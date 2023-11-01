"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { DndContext, DragEndEvent, DragOverEvent, DragOverlay, DragStartEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"

import { Column, Id, Task } from "@/lib/types"

import { Button } from "./ui/button"
import ColumnContainer from "./column-container"
import TaskCard from "./task-card"

const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map(col => col.id), [columns])
    const [tasks, setTasks] = useState<Task[]>([])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)
    const [activeTask, setActiveTask] = useState<Task | null>(null)

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 3, // 3px
            }
        })
    )

    console.log(columns)

    function createNewColumn() {
        const columnToAdd: Column = {
            id: generateId(),
            title: `Column ${columns.length + 1}`
        }

        setColumns([...columns, columnToAdd])
    }

    function generateId() {
        return Math.floor(Math.random() * 10001)
    }

    function updateColumn(id: Id, title: string) {
        const newColumns = columns.map(column => {
            if (column.id !== id) return column
            return { ...column, title }
        })

        setColumns(newColumns)
    }

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id !== id)
        setColumns(filteredColumns)

        const newTasks = tasks.filter((t) => t.columnId !== id)
        setTasks(newTasks)
    }

    function onDragStart(event: DragStartEvent) {
        console.log("DRAG START", event)
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }

        if (event.active.data.current?.type === "Task") {
            setActiveTask(event.active.data.current.task)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {

        setActiveColumn(null)
        setActiveTask(null)

        const { active, over } = event

        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeId)

            const overColumnIndex = columns.findIndex(col => col.id === overId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    function onDragOver(event: DragOverEvent) {
        const { active, over } = event

        if (!over) return

        const activeId = active.id
        const overId = over.id

        if (activeId === overId) return

        const isActiveATask = active.data.current?.type === "Task"
        const isOverATask = over.data.current?.type === "Task"

        if (!isActiveATask) return

        // dropping a task over another task
        if (isActiveATask && isOverATask) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)
                const overIndex = tasks.findIndex((t) => t.id === overId)

                tasks[activeIndex].columnId = tasks[overIndex].columnId

                return arrayMove(tasks, activeIndex, overIndex)
            })
        }

        const isOverAColumn = over.data.current?.type == "Column"

        // dropping a task over a column
        if (isActiveATask && isOverAColumn) {
            setTasks((tasks) => {
                const activeIndex = tasks.findIndex((t) => t.id === activeId)

                tasks[activeIndex].columnId = overId

                return arrayMove(tasks, activeIndex, activeIndex)
            })
        }
        
    }

    function createTask(columnId: Id) {
        const newTask: Task = {
            id: generateId(),
            columnId,
            content: `Task ${tasks.length + 1}`
        }
        setTasks([...tasks, newTask])
    }

    function deleteTask(id: Id) {
        const newTasks = tasks.filter(task => task.id !== id)
        setTasks(newTasks)
    }

    function updateTask(id: Id, content: string) {
        const newTasks = tasks.map((task) => {
            if (task.id !== id) return task
            return {...task, content}
        })
        setTasks(newTasks)
    }

    const firstFixedColumn: Column = {
        id: "first-fixed",
        title: "Applied"
    }

    const lastFixedColumn: Column = {
        id: "last-fixed",
        title: "Hired"
    }


    return (
        <div className="flex gap-x-4">
            <DndContext 
                sensors={sensors} 
                onDragStart={onDragStart} 
                onDragEnd={onDragEnd}
                onDragOver={onDragOver}
            >
                <div className="flex gap-2 text-white">
                    <ColumnContainer 
                        column={firstFixedColumn}
                        deleteColumn={() => {}} 
                        updateColumn={() => {}}
                        createTask={createTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        tasks={tasks.filter(task => task.columnId === firstFixedColumn.id)}
                    />
                    <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <ColumnContainer 
                                key={column.id} 
                                column={column} 
                                deleteColumn={deleteColumn} 
                                updateColumn={updateColumn}
                                createTask={createTask}
                                deleteTask={deleteTask}
                                updateTask={updateTask}
                                tasks={tasks.filter(task => task.columnId === column.id)}
                            />
                        ))}
                    </SortableContext>
                    <ColumnContainer 
                        column={lastFixedColumn}
                        deleteColumn={() => {}} 
                        updateColumn={() => {}}
                        createTask={createTask}
                        deleteTask={deleteTask}
                        updateTask={updateTask}
                        tasks={tasks.filter(task => task.columnId === lastFixedColumn.id)}
                    />
                </div>
                <Button onClick={() => {createNewColumn()}}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                </Button>
                <DragOverlay>
                    {activeColumn && 
                        <ColumnContainer 
                            column={activeColumn} 
                            deleteColumn={deleteColumn} 
                            updateColumn={updateColumn}
                            createTask={createTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                            tasks={tasks.filter(task => task.columnId === activeColumn.id)}
                        />
                    }
                    {activeTask && 
                        <TaskCard 
                            task={activeTask}
                            deleteTask={deleteTask}
                            updateTask={updateTask}
                        />
                    }
                </DragOverlay>
            </DndContext>
        </div>
    )
}

export default KanbanBoard