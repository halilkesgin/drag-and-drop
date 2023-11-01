"use client"

import { useMemo, useState } from "react"
import { Plus } from "lucide-react"
import { DndContext } from "@dnd-kit/core"
import { SortableContext } from "@dnd-kit/sortable"

import { Column, Id } from "@/lib/types"

import { Button } from "./ui/button"
import ColumnContainer from "./column-container"


const KanbanBoard = () => {

    const [columns, setColumns] = useState<Column[]>([])
    const columnsId = useMemo(() => columns.map(col => col.id), [columns])

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


    return (
        <div className="flex gap-x-4">
            <DndContext>
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
            </DndContext>
        </div>
    )
}

export default KanbanBoard