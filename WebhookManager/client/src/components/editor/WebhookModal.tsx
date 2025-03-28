import { useState } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DEFAULT_USERNAME, DEFAULT_AVATAR } from "@/lib/constants";
import { isValidWebhookUrl } from "@/lib/discord";

interface WebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWebhook: (url: string, name?: string, avatar?: string) => Promise<boolean>;
}

export default function WebhookModal({ isOpen, onClose, onAddWebhook }: WebhookModalProps) {
  const [url, setUrl] = useState("");
  const [name, setName] = useState(DEFAULT_USERNAME);
  const [avatar, setAvatar] = useState(DEFAULT_AVATAR);
  const [isAdvanced, setIsAdvanced] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async () => {
    const success = await onAddWebhook(url, name, avatar);
    if (success) {
      resetForm();
    }
  };

  const resetForm = () => {
    setUrl("");
    setName(DEFAULT_USERNAME);
    setAvatar(DEFAULT_AVATAR);
    setIsAdvanced(false);
    setIsCreating(false);
  };

  const isValidForm = url.trim() !== "" && isValidWebhookUrl(url);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open) {
        onClose();
        resetForm();
      }
    }}>
      <DialogContent className="bg-zinc-800 text-white border-zinc-700">
        <DialogHeader>
          <DialogTitle>Add Webhook</DialogTitle>
          <DialogDescription className="text-zinc-400">
            Enter your Discord webhook URL to send messages to your server.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://discord.com/api/webhooks/..."
              className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
            />
            <p className="text-xs text-zinc-400">
              Enter your Discord webhook URL. You can create one in your server's channel settings.
            </p>
          </div>

          {isAdvanced && (
            <>
              <div className="space-y-2">
                <Label htmlFor="webhook-name">Webhook Name (optional)</Label>
                <Input
                  id="webhook-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Webhook name"
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="webhook-avatar">Avatar URL (optional)</Label>
                <Input
                  id="webhook-avatar"
                  value={avatar}
                  onChange={(e) => setAvatar(e.target.value)}
                  placeholder="https://example.com/avatar.png"
                  className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                />
              </div>
            </>
          )}

          <Button
            variant="link"
            className="p-0 h-auto text-indigo-400"
            onClick={() => setIsAdvanced(!isAdvanced)}
          >
            {isAdvanced ? "Hide advanced options" : "Show advanced options"}
          </Button>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={!isValidForm || isCreating}
            className="bg-indigo-600 hover:bg-indigo-700"
          >
            {isCreating ? "Creating..." : "Add Webhook"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
