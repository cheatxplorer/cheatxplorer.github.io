import { ComponentRow, ComponentButton, ButtonStyle } from "@/types/discord";
import { BUTTON_STYLE_COLORS } from "@/lib/constants";

interface ComponentsPreviewProps {
  components: ComponentRow[];
}

export default function ComponentsPreview({ components }: ComponentsPreviewProps) {
  if (components.length === 0) return null;

  return (
    <div className="mt-3 flex flex-col gap-2">
      {components.map((row, rowIndex) => (
        <div key={rowIndex} className="flex flex-wrap gap-2">
          {row.components.map((button, buttonIndex) => (
            <PreviewButton 
              key={buttonIndex} 
              button={button} 
            />
          ))}
        </div>
      ))}
    </div>
  );
}

interface PreviewButtonProps {
  button: ComponentButton;
}

function PreviewButton({ button }: PreviewButtonProps) {
  const { label, style, url } = button;
  const styleClass = BUTTON_STYLE_COLORS[style] || BUTTON_STYLE_COLORS.secondary;
  
  return (
    <button 
      className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${styleClass}`}
      onClick={(e) => {
        e.preventDefault();
        // In a real app, buttons with custom_id would trigger actions
        if (url) {
          window.open(url, '_blank');
        }
      }}
    >
      {label}
    </button>
  );
}
