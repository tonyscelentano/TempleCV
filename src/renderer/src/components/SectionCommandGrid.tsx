export type SectionCommand<SectionId extends string> = {
  id: SectionId;
  label: string;
  meta: string;
  onAdd?: () => void;
};

export function SectionCommandGrid<SectionId extends string>({
  activeSection,
  commands,
  onSelect
}: {
  activeSection: SectionId;
  commands: Array<SectionCommand<SectionId>>;
  onSelect: (section: SectionId) => void;
}) {
  return (
    <section className="command-panel" aria-label="Resume elements">
      <div className="command-grid">
        {commands.map((command) => (
          <div className={command.id === activeSection ? "command-tile active" : "command-tile"} key={command.id}>
            <button className="command-button" type="button" onClick={() => onSelect(command.id)}>
              <span>{command.label}</span>
              <small>{command.meta}</small>
            </button>
            {command.onAdd ? (
              <button
                aria-label={`Add ${command.label}`}
                className="command-add-button"
                type="button"
                onClick={() => {
                  command.onAdd?.();
                  onSelect(command.id);
                }}
              >
                +
              </button>
            ) : null}
          </div>
        ))}
      </div>
    </section>
  );
}
