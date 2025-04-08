
import React from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { motion } from "framer-motion";
import { MapPin, Trash2, GripVertical } from "lucide-react";
import { Button } from "@/components/ui/button";

export function SavedLocations({ 
  folders, 
  onFolderDelete, 
  onLocationDelete, 
  onLocationClick,
  onDragEnd 
}) {
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="grid gap-6">
        {folders.map((folder, folderIndex) => (
          <motion.div
            key={folder.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="border rounded-lg p-4 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{folder.name}</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onFolderDelete(folder.id)}
              >
                <Trash2 className="h-4 w-4 text-muted-foreground" />
              </Button>
            </div>

            <Droppable droppableId={folder.id.toString()}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 ${
                    snapshot.isDraggingOver ? "bg-accent/5" : ""
                  }`}
                >
                  {folder.locations.map((location, index) => (
                    <Draggable
                      key={location.id}
                      draggableId={location.id.toString()}
                      index={index}
                    >
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className={`group relative border rounded-lg p-4 ${
                            snapshot.isDragging ? "shadow-lg bg-background" : "hover:bg-accent/5"
                          }`}
                          onClick={() => onLocationClick(location)}
                        >
                          {/* Drag Handle */}
                          <div
                            {...provided.dragHandleProps}
                            className="absolute left-2 top-2 cursor-grab active:cursor-grabbing"
                          >
                            <GripVertical className="h-4 w-4 text-muted-foreground" />
                          </div>

                          <div className="ml-6">
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-primary" />
                              <h4 className="font-medium">{location.name}</h4>
                            </div>
                            <p className="text-sm text-muted-foreground">{location.address}</p>
                            <p className="text-sm text-muted-foreground">{location.coordinates}</p>
                          </div>

                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={(e) => {
                              e.stopPropagation();
                              onLocationDelete(folder.id, location.id);
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </motion.div>
        ))}
      </div>
    </DragDropContext>
  );
}
