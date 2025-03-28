import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Copy, Trash2 } from "lucide-react";
import { CHARACTER_LIMITS } from "@/lib/constants";

interface MessageEditorProps {
  content: string;
  updateContent: (content: string) => void;
}

export default function MessageEditor({ content, updateContent }: MessageEditorProps) {
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newContent = e.target.value;
    updateContent(newContent);
  };

  return (
    <Card className="border-zinc-700 bg-zinc-800 text-zinc-200">
      <CardHeader className="flex flex-row items-center justify-between px-4 py-3 border-b border-zinc-700">
        <span className="text-sm font-medium text-zinc-400">Message 1</span>
        <div className="flex items-center space-x-2">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="mb-2 flex justify-between items-center">
          <label className="text-zinc-400 text-sm">Content</label>
          <span className={`text-xs ${content.length > CHARACTER_LIMITS.CONTENT ? 'text-red-500' : 'text-zinc-400'}`}>
            {content.length}/{CHARACTER_LIMITS.CONTENT}
          </span>
        </div>
        <Textarea
          placeholder="Message content here..."
          value={content}
          onChange={handleChange}
          className="min-h-[6rem] bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500"
          maxLength={CHARACTER_LIMITS.CONTENT}
        />
      </CardContent>
    </Card>
  );
}
