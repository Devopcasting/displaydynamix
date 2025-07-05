'use client';

import { useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MoreHorizontal, Plus } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import RegisterScreenDialog from "./components/register-screen-dialog";

const initialScreens = [
  { name: "Lobby Screen 1", group: "Head Office", status: "Online" as const, content: "Morning Playlist" },
  { name: "Retail Display A", group: "Downtown Branch", status: "Online" as const, content: "Weekend Promo" },
  { name: "Meeting Room Hub", group: "Head Office", status: "Offline" as const, content: "Corporate Announcements" },
  { name: "Cafeteria Menu", group: "Head Office", status: "Online" as const, content: "Cafe Menu" },
  { name: "Window Display", group: "Downtown Branch", status: "Online" as const, content: "Weekend Promo" },
  { name: "Reception Screen", group: "West-Side Office", status: "Error" as const, content: "Welcome Template" },
];

export interface Screen {
  name: string;
  group: string;
  status: "Online" | "Offline" | "Error";
  content: string;
}

export default function ScreensPage() {
  const { user } = useAuth();
  const [screens, setScreens] = useState<Screen[]>(initialScreens);

  const handleRegisterScreen = async (newScreenData: Omit<Screen, 'status' | 'content'>) => {
    // In a real app, you'd want a more robust way to generate unique keys/IDs.
    const newScreen: Screen = {
      ...newScreenData,
      status: 'Offline',
      content: 'Unassigned',
    };
    setScreens(prevScreens => [...prevScreens, newScreen]);
  };

  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b bg-background">
        <h1 className="text-lg font-semibold">Screen Management</h1>
        {user?.role === 'Admin' && (
            <RegisterScreenDialog onRegister={handleRegisterScreen}>
              <Button>
                <Plus className="mr-2" />
                Register Screen
              </Button>
            </RegisterScreenDialog>
        )}
      </header>
      <main className="flex-1 overflow-auto p-4 sm:p-6">
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Screen Name</TableHead>
                <TableHead>Group</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Current Content</TableHead>
                <TableHead>
                  <span className="sr-only">Actions</span>
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {screens.map((screen) => (
                <TableRow key={screen.name}>
                  <TableCell className="font-medium">{screen.name}</TableCell>
                  <TableCell>{screen.group}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        screen.status === "Online"
                          ? "default"
                          : "destructive"
                      }
                      className={
                        screen.status === "Online" 
                          ? "bg-green-500 hover:bg-green-600" 
                          : screen.status === "Offline" 
                          ? "bg-gray-500 hover:bg-gray-600" 
                          : "bg-red-500 hover:bg-red-600"
                      }
                    >
                      {screen.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{screen.content}</TableCell>
                  <TableCell>
                    {user?.role === 'Admin' && (
                        <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button aria-haspopup="true" size="icon" variant="ghost">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Toggle menu</span>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuItem>Push Content</DropdownMenuItem>
                            <DropdownMenuItem>Preview</DropdownMenuItem>
                            <DropdownMenuItem>Reboot</DropdownMenuItem>
                            <DropdownMenuItem className="text-destructive focus:text-destructive">
                            Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                        </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
}
