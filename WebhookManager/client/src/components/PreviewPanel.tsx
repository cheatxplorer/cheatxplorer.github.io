import { MessageData } from "@/types/discord";
import MessagePreview from "@/components/preview/MessagePreview";
import EmbedPreview from "@/components/preview/EmbedPreview";
import ComponentsPreview from "@/components/preview/ComponentsPreview";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

interface PreviewPanelProps {
  messageData: MessageData;
}

export default function PreviewPanel({ messageData }: PreviewPanelProps) {
  const { content, username, avatarUrl, embeds, components } = messageData;

  return (
    <div className="w-full lg:w-1/2 p-4 overflow-y-auto bg-zinc-800" style={{ height: 'calc(100vh - 56px)' }}>
      <Card className="mb-4 border-zinc-700 bg-zinc-800 text-zinc-200">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Preview</CardTitle>
          <CardDescription className="text-zinc-400">This is how your message will appear in Discord.</CardDescription>
        </CardHeader>
      </Card>

      <Card className="border-zinc-700 bg-zinc-800 text-zinc-200">
        <CardContent className="p-4">
          {/* Message Preview */}
          <MessagePreview 
            username={username}
            avatarUrl={avatarUrl}
            content={content}
          />

          {/* Embeds Preview */}
          {embeds.map((embed, index) => (
            <EmbedPreview key={index} embed={embed} />
          ))}

          {/* Components Preview */}
          {components.length > 0 && (
            <ComponentsPreview components={components} />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
