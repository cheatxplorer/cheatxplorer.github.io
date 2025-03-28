import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Accordion } from "@/components/ui/accordion";
import MessageEditor from "@/components/editor/MessageEditor";
import ProfileEditor from "@/components/editor/ProfileEditor";
import EmbedEditor from "@/components/editor/EmbedEditor";
import FilesUploader from "@/components/editor/FilesUploader";
import ComponentsEditor from "@/components/editor/ComponentsEditor";
import { UseDiscordMessageReturn } from "@/hooks/useDiscordMessage";
import { UseWebhooksReturn } from "@/hooks/useWebhooks";
import { PlusCircle, Save, Trash2 } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface EditorPanelProps {
  discordMessage: UseDiscordMessageReturn;
  webhookState: UseWebhooksReturn;
  onSend: () => Promise<void>;
  onClearAll: () => void;
  isSending: boolean;
}

export default function EditorPanel({
  discordMessage,
  webhookState,
  onSend,
  onClearAll,
  isSending
}: EditorPanelProps) {
  return (
    <div className="w-full lg:w-1/2 p-4 overflow-y-auto bg-zinc-900" style={{ height: 'calc(100vh - 56px)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Button 
            onClick={webhookState.openModal}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            Add Webhook
          </Button>
          <Button 
            onClick={onSend} 
            disabled={isSending}
            className="bg-green-600 hover:bg-green-700"
          >
            {isSending ? "Sending..." : "Send"}
          </Button>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Backups
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={onClearAll}
          >
            Clear All
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {/* Message Editor */}
        <MessageEditor 
          content={discordMessage.content}
          updateContent={discordMessage.updateContent}
        />
        
        {/* Profile Editor */}
        <ProfileEditor 
          username={discordMessage.username}
          avatarUrl={discordMessage.avatarUrl}
          updateUsername={discordMessage.updateUsername}
          updateAvatarUrl={discordMessage.updateAvatarUrl}
        />

        {/* Files Uploader */}
        <FilesUploader />

        {/* Embeds Editors */}
        {discordMessage.embeds.map((embed, embedIndex) => (
          <EmbedEditor
            key={embedIndex}
            embedIndex={embedIndex}
            embed={embed}
            updateEmbed={(updatedEmbed) => discordMessage.updateEmbed(embedIndex, updatedEmbed)}
            removeEmbed={() => discordMessage.removeEmbed(embedIndex)}
            duplicateEmbed={() => discordMessage.duplicateEmbed(embedIndex)}
            addField={() => discordMessage.addField(embedIndex)}
            updateField={(fieldIndex, updatedField) => 
              discordMessage.updateField(embedIndex, fieldIndex, updatedField)
            }
            removeField={(fieldIndex) => 
              discordMessage.removeField(embedIndex, fieldIndex)
            }
          />
        ))}

        {/* Components Editor */}
        <ComponentsEditor 
          components={discordMessage.components}
          addComponentRow={discordMessage.addComponentRow}
          addButton={discordMessage.addButton}
          updateButton={discordMessage.updateButton}
          removeButton={discordMessage.removeButton}
          removeComponentRow={discordMessage.removeComponentRow}
        />

        {/* Add Embed Button */}
        <div className="flex justify-center mt-4">
          <Button 
            onClick={discordMessage.addEmbed}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Embed
          </Button>
        </div>
      </div>
    </div>
  );
}
