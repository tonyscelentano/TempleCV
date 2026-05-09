import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { ResumeAsset, ResumeDocument } from "../../../core/schema";
import { AssetAttachmentPicker } from "../components/AssetAttachmentPicker";
import { FileImportButton } from "../components/FileImportButton";
import { CardHeader, ListField, PanelHeader, TextAreaField, TextField } from "../components/form";
import { updateProject } from "../lib/resumeUpdates";
import { emptyToUndefined } from "../lib/text";
import type { ContentUpdater } from "../types";

export function ProjectsSection({
  assets,
  assetSources,
  document,
  importAssetFile,
  onAdd,
  updateContent
}: {
  assets: ResumeAsset[];
  assetSources: Record<string, string>;
  document: ResumeDocument;
  importAssetFile: (usage: ResumeAsset["usage"], file: File) => Promise<ResumeAsset>;
  onAdd: () => void;
  updateContent: ContentUpdater;
}) {
  const projectMediaAssets = assets.filter((asset) => asset.usage === "project-screenshot" || asset.usage === "attachment");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(document.content.projects);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateContent((content) => ({ ...content, projects: items }));
  };

  return (
    <section className="panel">
      <PanelHeader title="Projects" actionLabel="Add" onAction={onAdd} />
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="projects-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {document.content.projects.map((item, index) => (
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
                        title={item.name || "Project"}
                        dragHandleProps={provided.dragHandleProps}
                        onRemove={() =>
                          updateContent((content) => ({
                            ...content,
                            projects: content.projects.filter((entry) => entry.id !== item.id)
                          }))
                        }
                      />
                      <div className="field-grid">
                        <TextField label="Name" value={item.name} onChange={(value) => updateProject(updateContent, index, { name: value })} />
                        <TextField
                          label="Your role"
                          value={item.role ?? ""}
                          onChange={(value) => updateProject(updateContent, index, { role: emptyToUndefined(value) })}
                        />
                      </div>
                      <TextField
                        label="URL"
                        value={item.url ?? ""}
                        onChange={(value) => updateProject(updateContent, index, { url: emptyToUndefined(value) })}
                      />
                      <TextAreaField
                        label="Summary"
                        value={item.summary ?? ""}
                        rows={3}
                        onChange={(value) => updateProject(updateContent, index, { summary: value })}
                      />
                      <div className="attachment-section">
                        <div className="attachment-heading">
                          <span>Project media</span>
                          <FileImportButton
                            className="small"
                            importAssetFile={importAssetFile}
                            label="Import screenshot"
                            usage="project-screenshot"
                            onImported={(asset) => updateProject(updateContent, index, { assetIds: [...item.assetIds, asset.id] })}
                          />
                        </div>
                        <AssetAttachmentPicker
                          assets={projectMediaAssets}
                          assetSources={assetSources}
                          emptyLabel="Import screenshots or attachments to showcase this project."
                          selectedIds={item.assetIds.filter((assetId) => projectMediaAssets.some((asset) => asset.id === assetId))}
                          onChange={(assetIds) =>
                            updateProject(updateContent, index, { assetIds: replaceProjectMediaAssets(item.assetIds, assets, assetIds) })
                          }
                        />
                      </div>
                      <ListField label="Highlights" value={item.highlights} onChange={(highlights) => updateProject(updateContent, index, { highlights })} />
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

function replaceProjectMediaAssets(currentIds: string[], assets: ResumeAsset[], replacementIds: string[]): string[] {
  const projectMediaIds = new Set(
    assets.filter((asset) => asset.usage === "project-screenshot" || asset.usage === "attachment").map((asset) => asset.id)
  );

  return [...currentIds.filter((assetId) => !projectMediaIds.has(assetId)), ...replacementIds];
}
