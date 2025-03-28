import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronDown, ChevronUp, Copy, Trash2, Plus, Puzzle, LayoutList } from "lucide-react";
import { ComponentRow, ComponentButton, ButtonStyle } from "@/types/discord";
import { CHARACTER_LIMITS, BUTTON_STYLES } from "@/lib/constants";

interface ComponentsEditorProps {
  components: ComponentRow[];
  addComponentRow: () => void;
  addButton: (rowIndex: number, button: ComponentButton) => void;
  updateButton: (rowIndex: number, buttonIndex: number, updatedButton: Partial<ComponentButton>) => void;
  removeButton: (rowIndex: number, buttonIndex: number) => void;
  removeComponentRow: (rowIndex: number) => void;
}

export default function ComponentsEditor({
  components,
  addComponentRow,
  addButton,
  updateButton,
  removeButton,
  removeComponentRow,
}: ComponentsEditorProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleAddButton = (rowIndex: number) => {
    addButton(rowIndex, {
      label: "Button",
      style: "primary",
      url: "",
      custom_id: `button_${Math.random().toString(36).substring(2, 9)}`,
    });
  };

  return (
    <Card className="border-zinc-700 bg-zinc-800 text-zinc-200">
      <div
        className="flex items-center justify-between p-3 cursor-pointer border-b border-zinc-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium flex items-center">
          <Puzzle className="mr-2 h-4 w-4" />
          <span>Components</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </div>
      
      {isOpen && (
        <CardContent className="p-4">
          {components.length === 0 ? (
            <div className="flex justify-center my-4">
              <Button 
                onClick={addComponentRow}
                variant="outline"
                className="text-indigo-400 border-indigo-600"
              >
                <Plus className="mr-2 h-4 w-4" /> Add Action Row
              </Button>
            </div>
          ) : (
            <>
              {components.map((row, rowIndex) => (
                <div key={rowIndex} className="mb-4">
                  <div className="flex justify-between mb-3">
                    <span className="text-zinc-400 text-sm flex items-center">
                      <LayoutList className="mr-2 h-4 w-4" /> Row {rowIndex + 1}
                    </span>
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-8 w-8"
                        onClick={() => removeComponentRow(rowIndex)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                  
                  {row.components.map((button, buttonIndex) => (
                    <div key={buttonIndex} className="mb-3 p-3 bg-zinc-900 rounded-md border border-zinc-700">
                      <div className="flex justify-between mb-2">
                        <span className="text-zinc-400">Button {buttonIndex + 1}</span>
                        <div className="flex space-x-2">
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-8 w-8"
                            onClick={() => removeButton(rowIndex, buttonIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                      <div className="mb-2">
                        <label className="block text-zinc-400 text-xs mb-1">Label</label>
                        <Input
                          value={button.label}
                          onChange={(e) => 
                            updateButton(rowIndex, buttonIndex, { label: e.target.value })
                          }
                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                          placeholder="Button Text"
                          maxLength={CHARACTER_LIMITS.BUTTON_LABEL}
                        />
                      </div>
                      <div className="mb-2">
                        <label className="block text-zinc-400 text-xs mb-1">
                          {button.style === 'link' ? 'URL' : 'Custom ID'}
                        </label>
                        <Input
                          value={button.style === 'link' ? button.url : button.custom_id}
                          onChange={(e) => 
                            updateButton(rowIndex, buttonIndex, 
                              button.style === 'link' 
                                ? { url: e.target.value } 
                                : { custom_id: e.target.value }
                            )
                          }
                          className="bg-zinc-800 border-zinc-700 focus-visible:ring-indigo-500 text-white"
                          placeholder={button.style === 'link' ? "https://example.com" : "button_id"}
                        />
                      </div>
                      <div className="mb-0">
                        <label className="block text-zinc-400 text-xs mb-1">Style</label>
                        <Select
                          value={button.style}
                          onValueChange={(value: ButtonStyle) => {
                            updateButton(rowIndex, buttonIndex, { 
                              style: value,
                              // Reset URL or custom_id when switching types
                              ...(value === 'link' 
                                ? { url: button.url || '', custom_id: undefined } 
                                : { custom_id: button.custom_id || `button_${Math.random().toString(36).substring(2, 9)}`, url: undefined })
                            });
                          }}
                        >
                          <SelectTrigger className="bg-zinc-800 border-zinc-700 focus:ring-indigo-500 text-white">
                            <SelectValue placeholder="Select style" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-800 border-zinc-700 text-white">
                            <SelectItem value="primary">Primary</SelectItem>
                            <SelectItem value="secondary">Secondary</SelectItem>
                            <SelectItem value="success">Success</SelectItem>
                            <SelectItem value="danger">Danger</SelectItem>
                            <SelectItem value="link">Link</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                  
                  <div className="flex space-x-2">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="text-zinc-400 hover:text-white"
                      onClick={() => handleAddButton(rowIndex)}
                      disabled={row.components.length >= 5}
                    >
                      <Plus className="mr-1 h-4 w-4" /> Add Button
                    </Button>
                  </div>
                </div>
              ))}
              
              {components.length < 5 && (
                <div className="flex justify-center mt-4">
                  <Button 
                    onClick={addComponentRow}
                    variant="outline"
                    className="text-indigo-400 border-indigo-600"
                  >
                    <Plus className="mr-2 h-4 w-4" /> Add Action Row
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      )}
    </Card>
  );
}
