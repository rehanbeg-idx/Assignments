import Button from "./Button";
import { usePortalConfigStore } from "../store/portalConfigStore";

export default function ProjectSidebar({
  onStartAddProject,
  projects,
  onSelectProject,
  selectedProjectId,
}) {
  const primaryColour = usePortalConfigStore(
    (state) => state.portal.primaryColour
  );
  const setPrimaryColour = usePortalConfigStore(
    (state) => state.setPrimaryColour
  );

  function handleColourChange(event) {
    setPrimaryColour(event.target.value);
  }

  return (
    <aside className="w-1/3 px-8 py-16 bg-sidebarPrimary text-stone-50 md:w-72 rounded-r-xl">
      <h2 className="mb-8 font-bold uppercase md:text-xl text-stone-200">
        Your Projects
      </h2>
      <div>
        <Button onClick={onStartAddProject}>+ Add Project</Button>
      </div>
      <div className="mt-6">
        <label className="block text-xs font-semibold uppercase tracking-wide mb-2 text-stone-200">
          Primary colour
        </label>
        <input
          type="color"
          value={primaryColour}
          onChange={handleColourChange}
          className="h-8 w-16 cursor-pointer bg-transparent border border-stone-500 rounded"
          aria-label="Choose primary colour"
        />
      </div>
      <ul className="mt-8">
        {projects.map((project) => {
          let cssClasses =
            "w-full text-left px-2 py-1 rounded-sm my-1 hover:text-stone-200 hover:bg-stone-800";
          if (project.id === selectedProjectId) {
            cssClasses += "bg-stone-800 text-stone-200";
          } else {
            cssClasses += "text-stone-400";
          }
          return (
            <li key={project.id}>
              <button className={cssClasses} onClick={() => onSelectProject(project.id)}>
                {project.title}
              </button>
            </li>
          );
        })}
      </ul>
    </aside>
  );
}
