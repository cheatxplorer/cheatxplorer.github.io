import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  ChevronDown,
  ChevronUp,
  Copy,
  Trash2,
  Plus,
  Link,
  Calendar,
  Clock,
} from "lucide-react";
import { DiscordEmbed } from "@/types/discord";
import { CHARACTER_LIMITS, EMBED_COLORS, rgbToHex } from "@/lib/constants";

interface EmbedEditorProps {
  embedIndex: number;
  embed: DiscordEmbed;
  updateEmbed: (updatedEmbed: Partial<DiscordEmbed>) => void;
  removeEmbed: () => void;
  duplicateEmbed: () => void;
  addField: () => void;
  updateField: (fieldIndex: number, updatedField: Partial<{ name: string; value: string; inline: boolean }>) => void;
  removeField: (fieldIndex: number) => void;
}

export default function EmbedEditor({
  embedIndex,
  embed,
  updateEmbed,
  removeEmbed,
  duplicateEmbed,
  addField,
  updateField,
  removeField,
}: EmbedEditorProps) {
  const [isOpen, setIsOpen] = useState(true);
  const embedTitle = embed.title || `Embed ${embedIndex + 1}`;
  const colorHex = typeof embed.color === 'number' ? rgbToHex(embed.color) : '#58b9ff';

  return (
    <Card className="border-zinc-700 bg-zinc-800 text-zinc-200 overflow-hidden">
      <div
        className="flex items-center justify-between p-3 cursor-pointer"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium flex items-center">
          <div
            className="w-1 h-10 rounded-r-md mr-3"
            style={{ backgroundColor: colorHex }}
          ></div>
          <span>{embedTitle}</span>
        </div>
        <div className="flex items-center">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); duplicateEmbed(); }}>
            <Copy className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={(e) => { e.stopPropagation(); removeEmbed(); }}>
            <Trash2 className="h-4 w-4" />
          </Button>
          {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-400 ml-2" /> : <ChevronDown className="h-4 w-4 text-zinc-400 ml-2" />}
        </div>
      </div>

      {isOpen && (
        <CardContent className="p-4 border-t border-zinc-700">
          {/* Author Section */}
          <div className="mb-4 pb-4 border-b border-zinc-700">
            <div className="text-zinc-400 text-sm font-medium mb-2">Author</div>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-zinc-400 text-xs">Name</label>
                <span className={`text-xs ${embed.author?.name?.length || 0 > CHARACTER_LIMITS.EMBED_AUTHOR_NAME ? 'text-red-500' : 'text-zinc-400'}`}>
                  {embed.author?.name?.length || 0}/{CHARACTER_LIMITS.EMBED_AUTHOR_NAME}
                </span>
              </div>
              <Input
                value={embed.author?.name || ""}
                onChange={(e) => updateEmbed({ author: { ...embed.author, name: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="Author name"
                maxLength={CHARACTER_LIMITS.EMBED_AUTHOR_NAME}
              />
            </div>
            <div className="mb-3">
              <label className="block text-zinc-400 text-xs mb-1">URL</label>
              <Input
                value={embed.author?.url || ""}
                onChange={(e) => updateEmbed({ author: { ...embed.author, url: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="https://example.com"
              />
            </div>
            <div className="mb-0">
              <label className="block text-zinc-400 text-xs mb-1">Icon URL</label>
              <Input
                value={embed.author?.icon_url || ""}
                onChange={(e) => updateEmbed({ author: { ...embed.author, icon_url: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="https://example.com/icon.png"
              />
            </div>
          </div>

          {/* Body Section */}
          <div className="mb-4 pb-4 border-b border-zinc-700">
            <div className="text-zinc-400 text-sm font-medium mb-2">Body</div>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-zinc-400 text-xs">Title</label>
                <span className={`text-xs ${embed.title?.length || 0 > CHARACTER_LIMITS.EMBED_TITLE ? 'text-red-500' : 'text-zinc-400'}`}>
                  {embed.title?.length || 0}/{CHARACTER_LIMITS.EMBED_TITLE}
                </span>
              </div>
              <Input
                value={embed.title || ""}
                onChange={(e) => updateEmbed({ title: e.target.value })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="Embed title"
                maxLength={CHARACTER_LIMITS.EMBED_TITLE}
              />
            </div>
            <div className="mb-3">
              <label className="block text-zinc-400 text-xs mb-1">URL</label>
              <Input
                value={embed.url || ""}
                onChange={(e) => updateEmbed({ url: e.target.value })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="https://example.com"
              />
            </div>
            <div className="mb-3">
              <label className="block text-zinc-400 text-xs mb-1">Sidebar Color</label>
              <div className="flex items-center">
                <input
                  type="color"
                  value={colorHex}
                  onChange={(e) => updateEmbed({ color: parseInt(e.target.value.replace("#", ""), 16) })}
                  className="h-9 w-9 bg-transparent border-0 cursor-pointer rounded mr-2"
                />
                <Input
                  value={colorHex}
                  onChange={(e) => {
                    const value = e.target.value;
                    if (/^#[0-9A-Fa-f]{6}$/.test(value)) {
                      updateEmbed({ color: parseInt(value.replace("#", ""), 16) });
                    }
                  }}
                  className="w-24 bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                />
              </div>
            </div>
            <div className="mb-0">
              <div className="flex justify-between mb-1">
                <label className="text-zinc-400 text-xs">Description</label>
                <span className={`text-xs ${embed.description?.length || 0 > CHARACTER_LIMITS.EMBED_DESCRIPTION ? 'text-red-500' : 'text-zinc-400'}`}>
                  {embed.description?.length || 0}/{CHARACTER_LIMITS.EMBED_DESCRIPTION}
                </span>
              </div>
              <Textarea
                value={embed.description || ""}
                onChange={(e) => updateEmbed({ description: e.target.value })}
                className="min-h-[6rem] bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="Embed description"
                maxLength={CHARACTER_LIMITS.EMBED_DESCRIPTION}
              />
            </div>
          </div>

          {/* Fields Section */}
          <div className="mb-4 pb-4 border-b border-zinc-700">
            <div className="flex justify-between mb-2">
              <div className="text-zinc-400 text-sm font-medium">Fields</div>
              <Button
                variant="ghost"
                size="sm"
                className="text-indigo-400 hover:text-indigo-300 p-0 h-auto"
                onClick={addField}
              >
                <Plus className="h-3 w-3 mr-1" /> Add Field
              </Button>
            </div>

            {embed.fields?.map((field, fieldIndex) => (
              <div key={fieldIndex} className="mb-4 p-3 bg-zinc-900 rounded-md border border-zinc-700">
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <label className="text-zinc-400 text-xs">Name</label>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <span className={`text-xs ${field.name.length > CHARACTER_LIMITS.EMBED_FIELD_NAME ? 'text-red-500' : 'text-zinc-400'}`}>
                    {field.name.length}/{CHARACTER_LIMITS.EMBED_FIELD_NAME}
                  </span>
                </div>
                <div className="mb-2">
                  <Input
                    value={field.name}
                    onChange={(e) => updateField(fieldIndex, { name: e.target.value })}
                    className="bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                    placeholder="Field name"
                    maxLength={CHARACTER_LIMITS.EMBED_FIELD_NAME}
                  />
                </div>
                <div className="mb-2 flex items-center">
                  <Checkbox
                    id={`inline-${embedIndex}-${fieldIndex}`}
                    checked={field.inline}
                    onCheckedChange={(checked) => updateField(fieldIndex, { inline: !!checked })}
                    className="mr-2"
                  />
                  <Label htmlFor={`inline-${embedIndex}-${fieldIndex}`} className="text-sm text-zinc-400">
                    Inline
                  </Label>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 ml-auto"
                    onClick={() => removeField(fieldIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex justify-between mb-1">
                  <div className="flex items-center">
                    <label className="text-zinc-400 text-xs">Value</label>
                    <span className="text-red-500 ml-1">*</span>
                  </div>
                  <span className={`text-xs ${field.value.length > CHARACTER_LIMITS.EMBED_FIELD_VALUE ? 'text-red-500' : 'text-zinc-400'}`}>
                    {field.value.length}/{CHARACTER_LIMITS.EMBED_FIELD_VALUE}
                  </span>
                </div>
                <div className="mb-0">
                  <Textarea
                    value={field.value}
                    onChange={(e) => updateField(fieldIndex, { value: e.target.value })}
                    className="min-h-[5rem] bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                    placeholder="Field value"
                    maxLength={CHARACTER_LIMITS.EMBED_FIELD_VALUE}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Images Section */}
          <div className="mb-4 pb-4 border-b border-zinc-700">
            <div className="text-zinc-400 text-sm font-medium mb-2">Images</div>
            <div className="mb-3">
              <label className="block text-zinc-400 text-xs mb-1">Large Image URL</label>
              <Input
                value={embed.image?.url || ""}
                onChange={(e) => updateEmbed({ image: { url: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="https://example.com/image.png"
              />
            </div>
            <div className="mb-0">
              <label className="block text-zinc-400 text-xs mb-1">Thumbnail URL</label>
              <Input
                value={embed.thumbnail?.url || ""}
                onChange={(e) => updateEmbed({ thumbnail: { url: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="https://example.com/thumbnail.png"
              />
            </div>
          </div>

          {/* Footer Section */}
          <div>
            <div className="text-zinc-400 text-sm font-medium mb-2">Footer</div>
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <label className="text-zinc-400 text-xs">Text</label>
                <span className={`text-xs ${embed.footer?.text?.length || 0 > CHARACTER_LIMITS.EMBED_FOOTER ? 'text-red-500' : 'text-zinc-400'}`}>
                  {embed.footer?.text?.length || 0}/{CHARACTER_LIMITS.EMBED_FOOTER}
                </span>
              </div>
              <Input
                value={embed.footer?.text || ""}
                onChange={(e) => updateEmbed({ footer: { ...embed.footer, text: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="Footer text"
                maxLength={CHARACTER_LIMITS.EMBED_FOOTER}
              />
            </div>
            <div className="mb-3">
              <label className="block text-zinc-400 text-xs mb-1">Icon URL</label>
              <Input
                value={embed.footer?.icon_url || ""}
                onChange={(e) => updateEmbed({ footer: { ...embed.footer, icon_url: e.target.value } })}
                className="bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                placeholder="https://example.com/footer-icon.png"
              />
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-1/2">
                <label className="block text-zinc-400 text-xs mb-1">Date</label>
                <select className="w-full bg-zinc-900 border border-zinc-700 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-white">
                  <option>Select...</option>
                  <option>Current date</option>
                  <option>Custom date</option>
                </select>
              </div>
              <div className="w-1/2">
                <label className="block text-zinc-400 text-xs mb-1">Time</label>
                <Input
                  type="time"
                  className="w-full bg-zinc-900 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                  disabled
                />
              </div>
            </div>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
