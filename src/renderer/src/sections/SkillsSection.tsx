import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { ResumeDocument } from "../../../core/schema";
import { CardHeader, ListField, PanelHeader, TextField } from "../components/form";
import { updateSkillGroup } from "../lib/resumeUpdates";
import type { ContentUpdater } from "../types";

export function SkillsSection({
  document,
  onAdd,
  updateContent
}: {
  document: ResumeDocument;
  onAdd: () => void;
  updateContent: ContentUpdater;
}) {
  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(document.content.skills);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateContent((content) => ({ ...content, skills: items }));
  };

  return (
    <section className="panel">
      <PanelHeader title="Skills" actionLabel="Add" onAction={onAdd} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="skills-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {document.content.skills.map((group, index) => (
                <Draggable key={group.id} draggableId={group.id} index={index}>
                  {(provided, snapshot) => (
                    <article 
                      className="editor-card"
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      style={{
                        ...provided.draggableProps.style,
                        opacity: snapshot.isDragging ? 0.8 : 1,
                        boxShadow: snapshot.isDragging ? '0 5px 15px rgba(0,0,0,0.5)' : 'none',
                        borderColor: snapshot.isDragging ? '#444' : ''
                      }}
                    >
                      <CardHeader
                        title={group.label || "Skill group"}
                        dragHandleProps={provided.dragHandleProps}
                        onRemove={() =>
                          updateContent((content) => ({
                            ...content,
                            skills: content.skills.filter((entry) => entry.id !== group.id)
                          }))
                        }
                      />
                      <TextField label="Label" value={group.label} onChange={(value) => updateSkillGroup(updateContent, index, { label: value })} />
                      <ListField label="Items" value={group.items} onChange={(items) => updateSkillGroup(updateContent, index, { items })} />
                    </article>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}
