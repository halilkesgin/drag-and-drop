"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent } from "@dnd-kit/core"
import { SortableContext, arrayMove } from "@dnd-kit/sortable"
import { createPortal } from "react-dom"

import { Column, Id } from "@/lib/types"

import { Button } from "./ui/button"
import ColumnContainer from "./column-container"


const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map(col => col.id), [columns])

    const [activeColumn, setActiveColumn] = useState<Column | null>(null)

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

    function deleteColumn(id: Id) {
        const filteredColumns = columns.filter(col => col.id !== id)
        setColumns(filteredColumns)
    }

    function onDragStart(event: DragStartEvent) {
        console.log("DRAG START", event)
        if (event.active.data.current?.type === "Column") {
            setActiveColumn(event.active.data.current.column)
            return
        }
    }

    function onDragEnd(event: DragEndEvent) {
        const { active, over } = event

        if (!over) return

        const activeColumnId = active.id
        const overColumndId = over.id

        if (activeColumnId === overColumndId) return

        setColumns(columns => {
            const activeColumnIndex = columns.findIndex(col => col.id === activeColumnId)

            const overColumnIndex = columns.findIndex(col => col.id === overColumndId)

            return arrayMove(columns, activeColumnIndex, overColumnIndex)
        })
    }

    return (
        <div className="flex gap-x-4">
            <DndContext onDragStart={onDragStart} onDragEnd={onDragEnd}>
                <div className="flex gap-2 text-white">
                    <SortableContext items={columnsId}>
                        {columns.map((column) => (
                            <ColumnContainer key={column.id} column={column} deleteColumn={deleteColumn} />
                        ))}
                    </SortableContext>
                </div>
                <Button onClick={() => {createNewColumn()}}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add Column
                </Button>
                {createPortal(
                    <DragOverlay>
                        {activeColumn && 
                            <ColumnContainer 
                                column={activeColumn} 
                                deleteColumn={deleteColumn} 
                            />}
                    </DragOverlay>,
                    document.body
                )}
            </DndContext>
        </div>
    )
}

export default KanbanBoard