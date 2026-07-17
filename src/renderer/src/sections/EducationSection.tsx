import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import type { ResumeDocument } from "../../../core/schema";
import { CardHeader, ListField, PanelHeader, TextField } from "../components/form";
import { updateEducation } from "../lib/resumeUpdates";
import { emptyToUndefined } from "../lib/text";
import type { ContentUpdater } from "../types";

export function EducationSection({
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
    const items = Array.from(document.content.education);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateContent((content) => ({ ...content, education: items }));
  };

  return (
    <section className="panel">
      <PanelHeader title="Education" actionLabel="Add" onAction={onAdd} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="education-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {document.content.education.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
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
                        title={item.credential || "Education"}
                        dragHandleProps={provided.dragHandleProps}
                        onRemove={() =>
                          updateContent((content) => ({
                            ...content,
                            education: content.education.filter((entry) => entry.id !== item.id)
                          }))
                        }
                      />
                      <TextField label="Credential" value={item.credential} onChange={(value) => updateEducation(updateContent, index, { credential: value })} />
                      <TextField
                        label="Institution"
                        value={item.institution}
                        onChange={(value) => updateEducation(updateContent, index, { institution: value })}
                      />
                      <TextField
                        label="Location"
                        value={item.location ?? ""}
                        onChange={(value) => updateEducation(updateContent, index, { location: emptyToUndefined(value) })}
                      />
                      <div className="field-grid">
                        <TextField
                          label="Start year"
                          value={item.dates?.start ?? ""}
                          onChange={(value) =>
                            updateEducation(updateContent, index, {
                              dates: value ? { start: value, present: item.dates?.present ?? false, end: item.dates?.end } : undefined
                            })
                          }
                        />
                        <TextField
                          label="End year"
                          value={item.dates?.present ? "" : item.dates?.end ?? ""}
                          disabled={item.dates?.present ?? false}
                          onChange={(value) =>
                            updateEducation(updateContent, index, {
                              dates: { start: item.dates?.start ?? "", present: false, end: emptyToUndefined(value) }
                            })
                          }
                        />
                      </div>
                      <label className="inline-check">
                        <input
                          checked={item.dates?.present ?? false}
                          type="checkbox"
                          onChange={(event) =>
                            updateEducation(updateContent, index, {
                              dates: item.dates ? { ...item.dates, present: event.target.checked } : { start: "", present: event.target.checked }
                            })
                          }
                        />
                        In progress
                      </label>
                      <ListField
                        label="Highlights"
                        value={item.highlights}
                        onChange={(highlights) => updateEducation(updateContent, index, { highlights })}
                      />
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
