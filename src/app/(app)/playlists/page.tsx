"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { MoreVertical, Plus, Play, Clock } from "lucide-react";
import { useAuth } from "@/components/auth-provider";

const playlists = [
  { title: "Morning Lobby Playlist", items: 5, duration: "10m" },
  { title: "Retail Weekend Promo", items: 8, duration: "15m" },
  { title: "Corporate Announcements", items: 3, duration: "5m" },
  { title: "Cafe Menu Board", items: 12, duration: "30m" },
];

export default function PlaylistsPage() {
  const { user } = useAuth();
  const canEdit = user?.role === 'Admin' || user?.role === 'Editor';

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b bg-background">
        <h1 className="text-lg font-semibold">Playlists</h1>
        {canEdit && (
          <Button>
            <Plus className="mr-2" />
            New Playlist
          </Button>
        )}
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {playlists.map((playlist, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle>{playlist.title}</CardTitle>
                  {canEdit && (
                    <Button variant="ghost" size="icon" className="w-8 h-8 -mt-2 -mr-2">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  )}
                </div>
                <CardDescription className="flex items-center gap-4 pt-1">
                  <span className="flex items-center gap-1">
                    <Play className="w-3 h-3"/> {playlist.items} items
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3 h-3"/> {playlist.duration}
                  </span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative h-24 bg-muted rounded-md flex items-center justify-center p-2 gap-1">
                    <div className="w-1/3 h-full bg-background rounded-sm shadow-sm p-1"><div className="w-full h-full bg-muted rounded-sm"></div></div>
                    <div className="w-1/3 h-full bg-background rounded-sm shadow-sm p-1"><div className="w-full h-full bg-muted rounded-sm"></div></div>
                    <div className="w-1/3 h-full bg-background rounded-sm shadow-sm p-1"><div className="w-full h-full bg-muted rounded-sm"></div></div>
                </div>
              </CardContent>
              <CardFooter>
                 <Button variant={canEdit ? "outline" : "secondary"} className="w-full" disabled={!canEdit}>
                    {canEdit ? "Edit Playlist" : "View Playlist"}
                 </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
