"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Activity, Users, CheckCircle, Clock } from "lucide-react";

export default function AnalyticsPage() {
  // Mock data - would come from backend
  const stats = [
    {
      title: "Total Tickets",
      value: "247",
      change: "+12%",
      trend: "up",
      icon: Activity,
    },
    {
      title: "Active Users",
      value: "89",
      change: "+8%",
      trend: "up",
      icon: Users,
    },
    {
      title: "Completed Tasks",
      value: "156",
      change: "+23%",
      trend: "up",
      icon: CheckCircle,
    },
    {
      title: "Avg. Resolution Time",
      value: "2.4 days",
      change: "-15%",
      trend: "down",
      icon: Clock,
    },
  ];

  const ticketsByStatus = [
    { status: "Backlog", count: 45, percentage: 18, color: "bg-[hsl(var(--color-backlog))]" },
    { status: "To Do", count: 62, percentage: 25, color: "bg-[hsl(var(--color-todo))]" },
    { status: "In Progress", count: 84, percentage: 34, color: "bg-[hsl(var(--color-in-progress))]" },
    { status: "Done", count: 56, percentage: 23, color: "bg-[hsl(var(--color-done))]" },
  ];

  const recentActivity = [
    { action: "New ticket created", user: "John Doe", time: "2 minutes ago" },
    { action: "Ticket marked as done", user: "Jane Smith", time: "15 minutes ago" },
    { action: "Comment added", user: "Bob Johnson", time: "1 hour ago" },
    { action: "Ticket assigned", user: "Alice Williams", time: "2 hours ago" },
    { action: "Priority changed to High", user: "Charlie Brown", time: "3 hours ago" },
  ];

  const clicksData = [
    { feature: "Voice Assistant", clicks: 1234, percentage: 35 },
    { feature: "Tickets", clicks: 892, percentage: 25 },
    { feature: "Drawing Board", clicks: 645, percentage: 18 },
    { feature: "Analytics", clicks: 534, percentage: 15 },
    { feature: "Calendar", clicks: 245, percentage: 7 },
  ];

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Insights and metrics for your product management
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card key={stat.title}>
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                  <Icon className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs">
                    {stat.trend === "up" ? (
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    ) : (
                      <TrendingDown className="h-3 w-3 text-green-600" />
                    )}
                    <span className="text-green-600">{stat.change}</span>
                    <span className="text-muted-foreground">from last month</span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Tickets by Status */}
          <Card>
            <CardHeader>
              <CardTitle>Tickets by Status</CardTitle>
              <CardDescription>Distribution of tickets across statuses</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ticketsByStatus.map((item) => (
                <div key={item.status} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.status}</span>
                    <span className="text-muted-foreground">
                      {item.count} ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className={`h-full ${item.color}`}
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* User Clicks Analytics */}
          <Card>
            <CardHeader>
              <CardTitle>Feature Usage</CardTitle>
              <CardDescription>User clicks by feature</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {clicksData.map((item) => (
                <div key={item.feature} className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium">{item.feature}</span>
                    <span className="text-muted-foreground">
                      {item.clicks.toLocaleString()} clicks
                    </span>
                  </div>
                  <div className="h-2 w-full bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${item.percentage}%` }}
                    />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Activity */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Latest actions and updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivity.map((activity, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 pb-4 border-b border-border last:border-0 last:pb-0"
                  >
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-primary" />
                    <div className="flex-1 space-y-1">
                      <p className="text-sm font-medium">{activity.action}</p>
                      <p className="text-xs text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                      {activity.time}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Insights Card */}
        <Card className="bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Key Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-start gap-2">
              <Badge className="mt-0.5">Trending</Badge>
              <p className="text-sm">
                Voice Assistant feature has seen a 35% increase in usage this week
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="secondary" className="mt-0.5">
                Improvement
              </Badge>
              <p className="text-sm">
                Average ticket resolution time improved by 15% compared to last month
              </p>
            </div>
            <div className="flex items-start gap-2">
              <Badge variant="outline" className="mt-0.5">
                Action Item
              </Badge>
              <p className="text-sm">
                34% of tickets are currently in progress - consider prioritizing completion
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
