import { Trash } from "lucide-react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { useState } from "react"

import { Column, Id } from "@/lib/types"

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Input } from "./ui/input"

interface ColumnContainerProps {
    column: Column
    deleteColumn: (id: Id) => void
    updateColumn: (id: Id, title: string) => void
}

const ColumnContainer = ({ column, deleteColumn, updateColumn }: ColumnContainerProps) => {

    const [editMode, setEditMode] = useState(false)

    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: column.id,
        data: {
            type: "Column",
            column
        },
        disabled: editMode
    })

    const style = {
        transition,
        transform: CSS.Transform.toString(transform)
    }

    if (isDragging) {
        return (
            <Card className="bg-primary opacity-50 flex gap-y-4 flex-col border-slate-50/20 w-[350px] h-[500px] max-h-[500px]" ref={setNodeRef} style={style}>
            </Card>
        )
    }

    return (
        <Card className="bg-primary flex gap-y-4 flex-col border-slate-50/20 w-[350px] h-[500px] max-h-[500px]" ref={setNodeRef} style={style}>
            <CardHeader className="border-b border-slate-50/20 cursor-grab">
                <CardTitle className="text-md text-white" {...attributes} {...listeners} onClick={() => { setEditMode(true) }}>
                        <div className="flex justify-between gap-x-4">
                            <div className="flex gap-x-4 items-center">
                                <div className="flex justify-center items-center border h-10 w-10 border-slate-50/20 rounded-lg">
                                    0
                                </div>
                                <div>
                                    {!editMode && 
                                        column.title
                                    }
                                    {editMode && 
                                        <Input
                                            value={column.title}
                                            onChange={e => updateColumn(column.id, e.target.value)}
                                            autoFocus 
                                            onBlur={() => { setEditMode(false) }} 
                                            onKeyDown={e => {
                                                if (e.key !== "Enter") return
                                                setEditMode(false)
                                            }} 
                                            className="bg-primary border-slate-50/20 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-ring focus-visible:ring-offset-0"
                                        />
                                    }
                                </div>
                            </div>
                            <Button variant="destructive" size="icon" onClick={() => { deleteColumn(column.id) }}>
                                <Trash className="h-4 w-4" />
                            </Button>
                        </div>
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-grow">
                <div className="text-white">
                    Hello
                </div>
            </CardContent>
            <CardFooter>
                <div className="text-white">
                    Footer
                </div>
            </CardFooter>
       </Card>
    )
}

export default ColumnContainer