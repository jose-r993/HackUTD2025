"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";

interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  time: string;
  type: "meeting" | "deadline" | "review";
  description?: string;
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Product Planning Meeting",
    date: "2025-01-10",
    time: "10:00 AM",
    type: "meeting",
    description: "Q1 product roadmap discussion",
  },
  {
    id: "2",
    title: "Sprint Review",
    date: "2025-01-12",
    time: "2:00 PM",
    type: "review",
    description: "Sprint 23 review and retrospective",
  },
  {
    id: "3",
    title: "Feature Release Deadline",
    date: "2025-01-15",
    time: "5:00 PM",
    type: "deadline",
    description: "User authentication feature launch",
  },
  {
    id: "4",
    title: "Stakeholder Meeting",
    date: "2025-01-18",
    time: "11:00 AM",
    type: "meeting",
    description: "Monthly stakeholder update",
  },
];

export default function CalendarPage() {
  const [currentDate] = useState(new Date(2025, 0, 1)); // January 2025
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [events] = useState<CalendarEvent[]>(mockEvents);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getEventsForDate = (day: number) => {
    const dateStr = `2025-01-${String(day).padStart(2, "0")}`;
    return events.filter((event) => event.date === dateStr);
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const eventTypeColors = {
    meeting: "bg-blue-500",
    deadline: "bg-red-500",
    review: "bg-purple-500",
  };

  const eventTypeBadgeColors = {
    meeting: "bg-blue-100 text-blue-700",
    deadline: "bg-red-100 text-red-700",
    review: "bg-purple-100 text-purple-700",
  };

  const selectedDateEvents = selectedDate
    ? events.filter((event) => event.date === selectedDate)
    : [];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your meetings, deadlines, and reviews
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Event
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
          {/* Calendar */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>
                  {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
                </CardTitle>
                <div className="flex gap-2">
                  <Button variant="outline" size="icon">
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="icon">
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 gap-2">
                {/* Day headers */}
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                  <div
                    key={day}
                    className="text-center text-sm font-medium text-muted-foreground py-2"
                  >
                    {day}
                  </div>
                ))}

                {/* Empty cells for days before month starts */}
                {Array.from({ length: startingDayOfWeek }).map((_, index) => (
                  <div key={`empty-${index}`} className="aspect-square" />
                ))}

                {/* Calendar days */}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const dateStr = `2025-01-${String(day).padStart(2, "0")}`;
                  const dayEvents = getEventsForDate(day);
                  const isSelected = selectedDate === dateStr;
                  const isToday = day === 8; // Mock today as Jan 8

                  return (
                    <button
                      key={day}
                      onClick={() => setSelectedDate(dateStr)}
                      className={`
                        aspect-square p-2 rounded-md border transition-colors
                        ${isSelected ? "border-primary bg-primary/5" : "border-border"}
                        ${isToday ? "bg-primary/10" : ""}
                        hover:bg-accent
                      `}
                    >
                      <div className="flex flex-col h-full">
                        <span
                          className={`text-sm font-medium ${
                            isToday ? "text-primary font-bold" : ""
                          }`}
                        >
                          {day}
                        </span>
                        <div className="flex-1 flex flex-col gap-1 mt-1">
                          {dayEvents.slice(0, 2).map((event) => (
                            <div
                              key={event.id}
                              className={`h-1.5 rounded-full ${
                                eventTypeColors[event.type]
                              }`}
                            />
                          ))}
                          {dayEvents.length > 2 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{dayEvents.length - 2}
                            </span>
                          )}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Events Sidebar */}
          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">
                  {selectedDate
                    ? `Events for ${new Date(selectedDate).toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                      })}`
                    : "Upcoming Events"}
                </CardTitle>
                <CardDescription>
                  {selectedDateEvents.length > 0
                    ? `${selectedDateEvents.length} event${
                        selectedDateEvents.length > 1 ? "s" : ""
                      }`
                    : "Select a date to view events"}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {selectedDateEvents.length > 0 ? (
                  selectedDateEvents.map((event) => (
                    <div
                      key={event.id}
                      className="p-3 rounded-lg border border-border bg-card space-y-2"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="font-semibold text-sm">{event.title}</h4>
                        <Badge
                          className={eventTypeBadgeColors[event.type]}
                          variant="secondary"
                        >
                          {event.type}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {event.time}
                      </p>
                      {event.description && (
                        <p className="text-xs text-muted-foreground">
                          {event.description}
                        </p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-8">
                    No events scheduled
                  </p>
                )}
              </CardContent>
            </Card>

            {/* Legend */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Event Types</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-blue-500" />
                  <span className="text-sm">Meeting</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-red-500" />
                  <span className="text-sm">Deadline</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-3 w-3 rounded-full bg-purple-500" />
                  <span className="text-sm">Review</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
