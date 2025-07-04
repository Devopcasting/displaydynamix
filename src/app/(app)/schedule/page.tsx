import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const calendarEvents = [
  { day: 2, title: "Morning Lobby Playlist", color: "bg-blue-500" },
  { day: 4, title: "Retail Weekend Promo", color: "bg-purple-500" },
  { day: 4, title: "Corporate Announcements", color: "bg-green-500" },
  { day: 7, title: "Cafe Menu Board", color: "bg-orange-500" },
  { day: 11, title: "Retail Weekend Promo", color: "bg-purple-500" },
  { day: 18, title: "Retail Weekend Promo", color: "bg-purple-500" },
  { day: 25, title: "Retail Weekend Promo", color: "bg-purple-500" },
];

export default function SchedulePage() {
  return (
    <div className="h-full flex flex-col">
      <header className="flex items-center justify-between h-14 px-4 sm:px-6 border-b bg-background">
        <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold">Content Schedule</h1>
            <div className="flex items-center gap-2">
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">July 2024</span>
                <Button variant="outline" size="icon" className="h-8 w-8">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </div>
        </div>
        <Button>
          <Plus className="mr-2" />
          New Schedule
        </Button>
      </header>
      <main className="flex-1 overflow-auto bg-muted/40">
        <div className="grid grid-cols-7 h-full">
          {/* Calendar Header */}
          {days.map((day) => (
            <div key={day} className="text-center font-medium text-sm py-2 border-b border-r bg-background">
              {day}
            </div>
          ))}

          {/* Calendar Body */}
          {Array.from({ length: 35 }).map((_, index) => {
            const dayOfMonth = index - 3 + 1; // Start days on Thursday for July 2024
            const isCurrentMonth = dayOfMonth > 0 && dayOfMonth <= 31;
            const events = calendarEvents.filter(e => e.day === dayOfMonth);

            return (
              <div key={index} className="relative border-b border-r p-1.5 flex flex-col gap-1 min-h-[120px] bg-background hover:bg-muted/50">
                {isCurrentMonth && <span className="text-xs font-semibold">{dayOfMonth}</span>}
                {events.map(event => (
                    <Card key={event.title} className={`${event.color} text-white p-1.5`}>
                        <p className="text-xs font-medium truncate">{event.title}</p>
                    </Card>
                ))}
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
}
