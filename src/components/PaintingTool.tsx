import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "react-hot-toast";
import { CanvasArea } from "./CanvasArea";
import { Toolbar } from "./Toolbar";
import { StatusBar } from "./StatusBar";
import { Download, Upload } from "lucide-react";

export interface CanvasObject {
  id: string;
  type: 'circle' | 'square' | 'triangle';
  x: number;
  y: number;
}

export const PaintingTool = () => {
  const [title, setTitle] = useState("Painting Title");
  const [objects, setObjects] = useState<CanvasObject[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addObject = (type: 'circle' | 'square' | 'triangle', x: number, y: number) => {
    const newObject: CanvasObject = {
      id: `${type}-${Date.now()}-${Math.random()}`,
      type,
      x,
      y,
    };
    setObjects(prev => [...prev, newObject]);
  };

  const removeObject = (id: string) => {
    setObjects(prev => prev.filter(obj => obj.id !== id));
  };

  const exportCanvas = () => {
    const data = {
      title,
      objects,
      timestamp: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title.replace(/\s+/g, '_')}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Canvas exported successfully!");
  };

  const importCanvas = () => {
    fileInputRef.current?.click();
  };

  const handleFileImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        if (data.title && Array.isArray(data.objects)) {
          setTitle(data.title);
          setObjects(data.objects);
          toast.success("Canvas imported successfully!");
        } else {
          toast.error("Invalid file format");
        }
      } catch (error) {
        toast.error("Error importing file");
      }
    };
    reader.readAsText(file);
    
    // Reset the input
    event.target.value = '';
  };

  const getObjectCounts = () => {
    const counts = { circle: 0, square: 0, triangle: 0 };
    objects.forEach(obj => {
      counts[obj.type]++;
    });
    return counts;
  };

  return (
    <div className="h-screen flex flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-card shadow-soft">
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="text-lg font-semibold max-w-md border-none shadow-none text-foreground bg-transparent"
          placeholder="Enter painting title..."
        />
        
        <div className="flex gap-2">
          <Button onClick={exportCanvas} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Export
          </Button>
          <Button onClick={importCanvas} variant="outline" className="flex items-center gap-2">
            <Upload className="w-4 h-4" />
            Import
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <CanvasArea 
          objects={objects} 
          onAddObject={addObject}
          onRemoveObject={removeObject}
        />
        <Toolbar />
      </div>

      {/* Status Bar */}
      <StatusBar counts={getObjectCounts()} />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileImport}
        accept=".json"
        className="hidden"
      />
    </div>
  );
};