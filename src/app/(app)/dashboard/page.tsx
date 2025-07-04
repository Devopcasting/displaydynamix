import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Type,
  Image,
  Video,
  Shapes,
  CloudSun,
  Rss,
  Clock,
  Globe,
  QrCode,
  Layers,
  Palette,
  Play,
  Eye,
  Save,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import AiLayoutSuggestions from "./components/ai-layout-suggestions";

const elements = [
  { icon: Type, label: "Text" },
  { icon: Image, label: "Image" },
  { icon: Video, label: "Video" },
  { icon: Shapes, label: "Shapes" },
  { icon: Clock, label: "Time/Date" },
  { icon: CloudSun, label: "Weather" },
  { icon: Rss, label: "RSS Feed" },
  { icon: Globe, label: "Webpage" },
  { icon: QrCode, label: "QR Code" },
];

const tools = [
  { icon: Layers, label: "Layers" },
  { icon: Palette, label: "Colors" },
  { icon: Play, label: "Animations" },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col h-full bg-muted/40">
      <header className="flex items-center justify-between h-14 px-4 border-b bg-background">
        <h1 className="text-lg font-semibold">Untitled Template</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Eye className="mr-2" />
            Preview
          </Button>
          <Button size="sm">
            <Save className="mr-2" />
            Save
          </Button>
        </div>
      </header>
      <main className="flex-1 flex overflow-hidden">
        {/* Left Panel: Elements */}
        <aside className="w-64 border-r bg-background overflow-y-auto">
          <div className="p-4">
            <h2 className="text-md font-semibold mb-4">Elements</h2>
            <div className="grid grid-cols-2 gap-2">
              {elements.map((el) => (
                <Button key={el.label} variant="outline" className="flex flex-col h-20">
                  <el.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{el.label}</span>
                </Button>
              ))}
            </div>
            <h2 className="text-md font-semibold my-4">Tools</h2>
            <div className="grid grid-cols-2 gap-2">
               {tools.map((tool) => (
                <Button key={tool.label} variant="outline" className="flex flex-col h-20">
                  <tool.icon className="w-6 h-6 mb-1" />
                  <span className="text-xs">{tool.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </aside>

        {/* Center Panel: Canvas */}
        <div className="flex-1 flex flex-col items-center justify-center p-4 overflow-hidden">
            <div className="w-full h-full bg-background shadow-lg rounded-lg border flex items-center justify-center relative">
                <div className="absolute top-2 left-2 flex gap-1">
                    <Button variant="ghost" size="icon"><ZoomIn/></Button>
                    <Button variant="ghost" size="icon"><ZoomOut/></Button>
                </div>
                <div className="w-[80%] h-[80%] border-2 border-dashed flex items-center justify-center bg-[linear-gradient(to_right,theme(colors.border)_1px,transparent_1px),linear-gradient(to_bottom,theme(colors.border)_1px,transparent_1px)] bg-[size:2rem_2rem]">
                    <p className="text-muted-foreground bg-background px-2 rounded-sm">Canvas (1920x1080)</p>
                </div>
            </div>
        </div>

        {/* Right Panel: Properties & AI */}
        <aside className="w-80 border-l bg-background overflow-y-auto">
          <Tabs defaultValue="properties" className="w-full">
            <TabsList className="w-full grid grid-cols-2">
              <TabsTrigger value="properties">Properties</TabsTrigger>
              <TabsTrigger value="ai">AI Suggestions</TabsTrigger>
            </TabsList>
            <TabsContent value="properties" className="p-4">
              <div className="text-center text-muted-foreground py-10">
                <p>Select an element on the canvas to edit its properties.</p>
              </div>
            </TabsContent>
            <TabsContent value="ai" className="p-4">
              <AiLayoutSuggestions />
            </TabsContent>
          </Tabs>
        </aside>
      </main>
    </div>
  );
}
