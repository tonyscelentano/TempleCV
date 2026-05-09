import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { ResumeDocument } from "../../../core/schema";
import { CardHeader, EmptyState, PanelHeader, TextAreaField, TextField } from "../components/form";
import { updateTestimonial } from "../lib/resumeUpdates";
import { emptyToUndefined } from "../lib/text";
import type { ContentUpdater } from "../types";

export function TestimonialsSection({
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
    const items = Array.from(document.content.testimonials);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateContent((content) => ({ ...content, testimonials: items }));
  };

  return (
    <section className="panel">
      <PanelHeader title="Testimonials" actionLabel="Add" onAction={onAdd} />
      {document.content.testimonials.length === 0 ? (
        <EmptyState
          actionLabel="Add your first quote"
          detail="Use one concise quote from a manager, client, teammate, or mentor."
          onAction={onAdd}
          title="No testimonials yet"
        />
      ) : null}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="testimonials-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {document.content.testimonials.map((item, index) => (
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
                        title={item.author || "Testimonial"}
                        dragHandleProps={provided.dragHandleProps}
                        onRemove={() =>
                          updateContent((content) => ({
                            ...content,
                            testimonials: content.testimonials.filter((entry) => entry.id !== item.id)
                          }))
                        }
                      />
                      <TextAreaField
                        label="Quote"
                        value={item.quote}
                        rows={3}
                        onChange={(value) => updateTestimonial(updateContent, index, { quote: value })}
                      />
                      <TextField
                        label="Author"
                        value={item.author}
                        onChange={(value) => updateTestimonial(updateContent, index, { author: value })}
                      />
                      <TextField
                        label="Title / Relationship"
                        value={item.title ?? ""}
                        onChange={(value) => updateTestimonial(updateContent, index, { title: emptyToUndefined(value) })}
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
