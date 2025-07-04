import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Search, Upload, Trash2, Folder } from "lucide-react";

const mediaAssets = [
  { name: "Corporate Event Highlights", type: "video", src: "https://placehold.co/400x225.png", hint: "corporate event" },
  { name: "Product Showcase", type: "image", src: "https://placehold.co/400x225.png", hint: "product modern" },
  { name: "Team Building Day", type: "image", src: "https://placehold.co/400x225.png", hint: "team office" },
  { name: "New Office Opening", type: "video", src: "https://placehold.co/400x225.png", hint: "office building" },
  { name: "Customer Testimonials", type: "video", src: "https://placehold.co/400x225.png", hint: "person smiling" },
  { name: "Company Anniversary", type: "image", src: "https://placehold.co/400x225.png", hint: "celebration party" },
  { name: "Holiday Greetings", type: "image", src: "https://placehold.co/400x225.png", hint: "winter snow" },
  { name: "Quarterly Report", type: "image", src: "https://placehold.co/400x225.png", hint: "business chart" },
];

export default function MediaPage() {
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b bg-background">
        <h1 className="text-lg font-semibold">Media Library</h1>
        <div className="flex items-center gap-2">
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input type="search" placeholder="Search assets..." className="pl-8" />
          </div>
          <Button>
            <Upload className="mr-2" />
            Upload
          </Button>
        </div>
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {mediaAssets.map((asset) => (
            <Card key={asset.name} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="relative aspect-video">
                  <Image
                    src={asset.src}
                    alt={asset.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    data-ai-hint={asset.hint}
                  />
                  <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                    {asset.type}
                  </div>
                </div>
              </CardContent>
              <CardFooter className="p-3 flex justify-between items-center">
                <span className="text-sm truncate">{asset.name}</span>
                <Button variant="ghost" size="icon" className="w-8 h-8 opacity-0 group-hover:opacity-100">
                  <Trash2 className="w-4 h-4" />
                  <span className="sr-only">Delete</span>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
