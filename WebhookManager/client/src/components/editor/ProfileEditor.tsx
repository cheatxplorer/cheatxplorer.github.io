import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, User } from "lucide-react";
import { CHARACTER_LIMITS } from "@/lib/constants";

interface ProfileEditorProps {
  username: string;
  avatarUrl: string;
  updateUsername: (username: string) => void;
  updateAvatarUrl: (avatarUrl: string) => void;
}

export default function ProfileEditor({
  username,
  avatarUrl,
  updateUsername,
  updateAvatarUrl,
}: ProfileEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-zinc-700 bg-zinc-800 text-zinc-200">
      <div
        className="flex items-center justify-between p-3 cursor-pointer border-b border-zinc-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium flex items-center">
          <User className="mr-2 h-4 w-4" />
          <span>Profile</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </div>
      
      {isOpen && (
        <CardContent className="p-4 border-b border-zinc-700">
          <div className="mb-4">
            <div className="flex justify-between mb-1">
              <label className="block text-zinc-400 text-sm">Name</label>
              <span className={`text-xs ${username.length > CHARACTER_LIMITS.WEBHOOK_NAME ? 'text-red-500' : 'text-zinc-400'}`}>
                {username.length}/{CHARACTER_LIMITS.WEBHOOK_NAME}
              </span>
            </div>
            <Input
              value={username}
              onChange={(e) => updateUsername(e.target.value)}
              className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
              placeholder="Webhook name"
              maxLength={CHARACTER_LIMITS.WEBHOOK_NAME}
            />
          </div>
          <div className="mb-2">
            <label className="block text-zinc-400 text-sm mb-1">Avatar URL</label>
            <Input
              value={avatarUrl}
              onChange={(e) => updateAvatarUrl(e.target.value)}
              className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
              placeholder="https://example.com/avatar.png"
            />
          </div>
        </CardContent>
      )}
    </Card>
  );
}
