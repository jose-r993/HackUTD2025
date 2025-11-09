"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Filter } from "lucide-react";

type TicketStatus = "backlog" | "todo" | "in-progress" | "done";
type TicketPriority = "low" | "medium" | "high";

interface Ticket {
  id: string;
  title: string;
  description: string;
  status: TicketStatus;
  priority: TicketPriority;
  assignee?: string;
  createdAt: string;
}

const mockTickets: Ticket[] = [
  {
    id: "1",
    title: "Implement user authentication",
    description: "Add OAuth and JWT authentication to the platform",
    status: "in-progress",
    priority: "high",
    assignee: "John Doe",
    createdAt: "2025-01-08",
  },
  {
    id: "2",
    title: "Design new landing page",
    description: "Create modern, responsive landing page design",
    status: "todo",
    priority: "medium",
    assignee: "Jane Smith",
    createdAt: "2025-01-07",
  },
  {
    id: "3",
    title: "Fix API rate limiting",
    description: "Resolve issues with API rate limiting on production",
    status: "backlog",
    priority: "high",
    createdAt: "2025-01-06",
  },
  {
    id: "4",
    title: "Update documentation",
    description: "Update API documentation with new endpoints",
    status: "done",
    priority: "low",
    assignee: "Bob Johnson",
    createdAt: "2025-01-05",
  },
];

export default function TicketsPage() {
  const [tickets] = useState<Ticket[]>(mockTickets);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<TicketStatus | "all">("all");

  const statusColors: Record<TicketStatus, string> = {
    backlog: "bg-[hsl(var(--color-backlog))] text-white",
    todo: "bg-[hsl(var(--color-todo))] text-white",
    "in-progress": "bg-[hsl(var(--color-in-progress))] text-white",
    done: "bg-[hsl(var(--color-done))] text-white",
  };

  const priorityColors: Record<TicketPriority, string> = {
    low: "border-green-500 text-green-700",
    medium: "border-yellow-500 text-yellow-700",
    high: "border-red-500 text-red-700",
  };

  const filteredTickets = tickets.filter((ticket) => {
    const matchesSearch =
      ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === "all" || ticket.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const statuses: Array<{ value: TicketStatus | "all"; label: string }> = [
    { value: "all", label: "All" },
    { value: "backlog", label: "Backlog" },
    { value: "todo", label: "To Do" },
    { value: "in-progress", label: "In Progress" },
    { value: "done", label: "Done" },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Tickets</h1>
            <p className="text-muted-foreground">
              Manage your product tickets and issues
            </p>
          </div>
          <Button className="gap-2">
            <Plus className="h-4 w-4" />
            New Ticket
          </Button>
        </div>

        {/* Filters */}
        <Card>
          <CardContent className="p-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search tickets..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <div className="flex gap-2">
                  {statuses.map((status) => (
                    <Button
                      key={status.value}
                      variant={selectedStatus === status.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedStatus(status.value)}
                    >
                      {status.label}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tickets Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {filteredTickets.map((ticket) => (
            <Card key={ticket.id} className="transition-shadow hover:shadow-md">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-base font-semibold line-clamp-1">
                    {ticket.title}
                  </CardTitle>
                  <Badge className={statusColors[ticket.status]}>
                    {ticket.status}
                  </Badge>
                </div>
                <CardDescription className="line-clamp-2">
                  {ticket.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Priority:</span>
                  <Badge variant="outline" className={priorityColors[ticket.priority]}>
                    {ticket.priority}
                  </Badge>
                </div>
                {ticket.assignee && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Assignee:</span>
                    <span className="font-medium">{ticket.assignee}</span>
                  </div>
                )}
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Created:</span>
                  <span>{ticket.createdAt}</span>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    View
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredTickets.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No tickets found</p>
          </div>
        )}
      </div>
    </div>
  );
}
