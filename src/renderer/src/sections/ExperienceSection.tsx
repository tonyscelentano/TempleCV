import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd";
import type { ResumeAsset, ResumeDocument } from "../../../core/schema";
import { FileImportButton } from "../components/FileImportButton";
import { CardHeader, EmptyState, ListField, PanelHeader, TextAreaField, TextField } from "../components/form";
import { updateExperience, updateExperienceDate } from "../lib/resumeUpdates";
import { emptyToUndefined } from "../lib/text";
import type { ContentUpdater } from "../types";

export function ExperienceSection({
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
  const logoAssets = assets.filter((asset) => asset.usage === "logo");

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    const items = Array.from(document.content.experience);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    updateContent((content) => ({ ...content, experience: items }));
  };

  return (
    <section className="panel">
      <PanelHeader title="Experience" actionLabel="Add" onAction={onAdd} />
      {document.content.experience.length === 0 ? (
        <EmptyState actionLabel="Add your first role" detail="Start with one recent role, then attach a logo if it helps the story." onAction={onAdd} title="No roles yet" />
      ) : null}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="experience-list">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {document.content.experience.map((item, index) => {
                const attachedLogo = logoAssets.find((asset) => item.assetIds.includes(asset.id));

                return (
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
                          title={item.role || "Experience"}
                          dragHandleProps={provided.dragHandleProps}
                          onRemove={() =>
                            updateContent((content) => ({
                              ...content,
                              experience: content.experience.filter((entry) => entry.id !== item.id)
                            }))
                          }
                        />
                        <div className="field-grid">
                          <TextField label="Role" value={item.role} onChange={(value) => updateExperience(updateContent, index, { role: value })} />
                          <TextField label="Company" value={item.company} onChange={(value) => updateExperience(updateContent, index, { company: value })} />
                          <TextField label="Start" value={item.dates.start} onChange={(value) => updateExperienceDate(updateContent, index, { start: value })} />
                          <TextField
                            label="End"
                            value={item.dates.present ? "" : item.dates.end ?? ""}
                            disabled={item.dates.present}
                            onChange={(value) => updateExperienceDate(updateContent, index, { end: emptyToUndefined(value) })}
                          />
                          <TextField
                            label="Location"
                            value={item.location ?? ""}
                            onChange={(value) => updateExperience(updateContent, index, { location: emptyToUndefined(value) })}
                          />
                          <label>
                            Logo
                            <select
                              value={item.assetIds.find((assetId) => logoAssets.some((asset) => asset.id === assetId)) ?? ""}
                              onChange={(event) =>
                                updateExperience(updateContent, index, {
                                  assetIds: replaceAssetsByUsage(item.assetIds, assets, "logo", event.target.value ? [event.target.value] : [])
                                })
                              }
                            >
                              <option value="">None</option>
                              {logoAssets.map((asset) => (
                                <option key={asset.id} value={asset.id}>
                                  {asset.altText || asset.filename}
                                </option>
                              ))}
                            </select>
                          </label>
                        </div>
                        <div className="inline-asset-tools">
                          {attachedLogo && assetSources[attachedLogo.id] ? (
                            <div className="attached-preview">
                              <img alt={attachedLogo.altText || attachedLogo.filename} src={assetSources[attachedLogo.id]} />
                              <span>{attachedLogo.altText || attachedLogo.filename}</span>
                            </div>
                          ) : (
                            <span />
                          )}
                          <FileImportButton
                            className="small"
                            importAssetFile={importAssetFile}
                            label="Import logo"
                            usage="logo"
                            onImported={(asset) =>
                              updateExperience(updateContent, index, {
                                assetIds: replaceAssetsByUsage(item.assetIds, assets, "logo", [asset.id])
                              })
                            }
                          />
                        </div>
                        <label className="inline-check">
                          <input
                            checked={item.dates.present}
                            type="checkbox"
                            onChange={(event) => updateExperienceDate(updateContent, index, { present: event.target.checked })}
                          />
                          Current role
                        </label>
                        <TextAreaField
                          label="Summary"
                          value={item.summary ?? ""}
                          rows={3}
                          onChange={(value) => updateExperience(updateContent, index, { summary: emptyToUndefined(value) })}
                        />
                        <ListField
                          label="Highlights"
                          value={item.highlights}
                          onChange={(highlights) => updateExperience(updateContent, index, { highlights })}
                        />
                      </article>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </section>
  );
}

function replaceAssetsByUsage(
  currentIds: string[],
  assets: ResumeAsset[],
  usage: ResumeAsset["usage"],
  replacementIds: string[]
): string[] {
  const assetIdsForUsage = new Set(assets.filter((asset) => asset.usage === usage).map((asset) => asset.id));
  return [...currentIds.filter((assetId) => !assetIdsForUsage.has(assetId)), ...replacementIds];
}
