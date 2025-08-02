import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();

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

  const exportCanvas = async () => {
    const data = JSON.stringify({
      title,
      objects,
      timestamp: new Date().toISOString(),
    });
    
    try {
      const response = await fetch(`http://localhost:8080/api/drawing`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({drawing: data}),
      });

      const result = await response.json();
      
      if (response.ok) {
        toast.success(`Canvas exported successfully!`);
      } else {
        toast.error(result.message || "Failed to export canvas");
      }
    } catch (error) {
      toast.error("Error exporting canvas");
    }
  };

  const importCanvas = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/drawing`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
      });
      const payload = await response.json();

      if (response.ok) {
        try {
          const data = JSON.parse(payload.drawing)
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
      }
    } catch (error) {
      toast.error("Error importing canvas");
    }
  };

  const signout = async () => {
    try {
      const response = await fetch(`http://localhost:8080/api/auth/logout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({
          username: localStorage.getItem("username"),
          token: localStorage.getItem("token"),
        }),
      });

      if (response.ok) {
        localStorage.removeItem('token');
        localStorage.removeItem('username');

        toast.success("Successfully signed out!");
        navigate("/");
      }
      else{
        toast.error("Error Signing out");
      }
    } catch (error) {
      toast.error("Error Signing out");
    }
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
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Button onClick={importCanvas} variant="outline" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download
          </Button>
          <Button onClick={signout} variant="outline" className="flex items-center gap-2">
            Signout
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
    </div>
  );
};