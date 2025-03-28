import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, File, FileUp, Clipboard } from "lucide-react";

export default function FilesUploader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="border-zinc-700 bg-zinc-800 text-zinc-200">
      <div
        className="flex items-center justify-between p-3 cursor-pointer border-b border-zinc-700"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="font-medium flex items-center">
          <File className="mr-2 h-4 w-4" />
          <span>Files (0/10)</span>
        </div>
        {isOpen ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
      </div>
      
      {isOpen && (
        <CardContent className="p-4 border-b border-zinc-700">
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" size="sm" className="text-zinc-400 hover:text-white">
              <FileUp className="mr-1 h-4 w-4" /> Add File
            </Button>
            <Button variant="outline" size="sm" className="text-zinc-400 hover:text-white">
              <Clipboard className="mr-1 h-4 w-4" /> Paste File
            </Button>
          </div>
        </CardContent>
      )}
    </Card>
  );
}
