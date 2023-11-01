import { Column, Id } from "@/lib/types"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Trash } from "lucide-react"

interface ColumnContainerProps {
    column: Column
    deleteColumn: (id: Id) => void
}

const ColumnContainer = ({ column, deleteColumn }: ColumnContainerProps) => {

    return (
       <Card className="bg-primary flex gap-y-4 flex-col border-slate-50/20 w-[350px] h-[500px] max-h-[500px]">
            <CardHeader className="border-b border-slate-50/20 cursor-grab">
                <CardTitle className="text-md text-white">
                        <div className="flex justify-between">
                            <div className="flex gap-x-4 items-center">
                                <div className="flex justify-center items-center border h-10 w-10 border-slate-50/20 rounded-lg">
                                    0
                                </div>
                                <div>
                                    {column.title}
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