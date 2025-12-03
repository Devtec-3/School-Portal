import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/lib/auth";
import { useToast } from "@/hooks/use-toast";
import type { Timetable as TimetableType, Subject } from "@shared/schema";
import { 
  Calendar, 
  Loader2,
  Plus,
  Clock,
  Trash2,
  BookOpen
} from "lucide-react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", 
  "11:00", "11:30", "12:00", "12:30", "13:00", "13:30",
  "14:00", "14:30", "15:00", "15:30", "16:00"
];

export default function Timetable() {
  const { user } = useAuth();
  const { toast } = useToast();
  const isStaff = user?.role === "staff";
  const isAdmin = user?.role === "super_admin";

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedDay, setSelectedDay] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [room, setRoom] = useState("");
  const [classLevel, setClassLevel] = useState("");

  const { data: timetable, isLoading } = useQuery<TimetableType[]>({
    queryKey: ["/api/timetable", isStaff ? user?.id : "all"],
  });

  const { data: subjects } = useQuery<Subject[]>({
    queryKey: ["/api/subjects", user?.id],
  });

  const createMutation = useMutation({
    mutationFn: async (data: any) => {
      return apiRequest("POST", "/api/timetable", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timetable"] });
      toast({ title: "Schedule Added", description: "The timetable entry has been created." });
      setIsDialogOpen(false);
      resetForm();
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to add schedule.", variant: "destructive" });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/timetable/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/timetable"] });
      toast({ title: "Schedule Removed", description: "The timetable entry has been deleted." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete schedule.", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSubject || !selectedDay || !startTime || !endTime) {
      toast({
        title: "Missing Information",
        description: "Please fill all required fields",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      subjectId: selectedSubject,
      dayOfWeek: selectedDay,
      startTime,
      endTime,
      room,
      classLevel,
      teacherId: user?.id,
    });
  };

  const resetForm = () => {
    setSelectedSubject("");
    setSelectedDay("");
    setStartTime("");
    setEndTime("");
    setRoom("");
    setClassLevel("");
  };

  const getDayColor = (day: string) => {
    const colors: Record<string, string> = {
      Monday: "bg-primary/20 text-primary",
      Tuesday: "bg-chart-1/20 text-chart-1",
      Wednesday: "bg-chart-4/20 text-chart-4",
      Thursday: "bg-accent/20 text-accent-foreground",
      Friday: "bg-destructive/20 text-destructive",
    };
    return colors[day] || "bg-muted text-muted-foreground";
  };

  const groupedTimetable = daysOfWeek.reduce((acc, day) => {
    acc[day] = timetable?.filter(t => t.dayOfWeek === day).sort((a, b) => 
      a.startTime.localeCompare(b.startTime)
    ) || [];
    return acc;
  }, {} as Record<string, TimetableType[]>);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-timetable-title">
            {isStaff ? "My Teaching Schedule" : "Timetable Management"}
          </h1>
          <p className="text-muted-foreground mt-1">
            {isStaff ? "View your class schedule" : "Manage class schedules"}
          </p>
        </div>
        {(isStaff || isAdmin) && (
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button data-testid="button-add-schedule">
                <Plus className="h-4 w-4 mr-2" />
                Add Schedule
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Add Schedule Entry</DialogTitle>
                <DialogDescription>
                  Create a new timetable entry for your classes.
                </DialogDescription>
              </DialogHeader>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label>Subject *</Label>
                  <Select value={selectedSubject} onValueChange={setSelectedSubject}>
                    <SelectTrigger data-testid="select-subject">
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects?.map((subject) => (
                        <SelectItem key={subject.id} value={subject.id}>
                          {subject.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Day of Week *</Label>
                  <Select value={selectedDay} onValueChange={setSelectedDay}>
                    <SelectTrigger data-testid="select-day">
                      <SelectValue placeholder="Select day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysOfWeek.map((day) => (
                        <SelectItem key={day} value={day}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Start Time *</Label>
                    <Select value={startTime} onValueChange={setStartTime}>
                      <SelectTrigger data-testid="select-start-time">
                        <SelectValue placeholder="Start" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>End Time *</Label>
                    <Select value={endTime} onValueChange={setEndTime}>
                      <SelectTrigger data-testid="select-end-time">
                        <SelectValue placeholder="End" />
                      </SelectTrigger>
                      <SelectContent>
                        {timeSlots.map((time) => (
                          <SelectItem key={time} value={time}>
                            {time}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Room/Location</Label>
                    <Input
                      value={room}
                      onChange={(e) => setRoom(e.target.value)}
                      placeholder="e.g., Room 101"
                      data-testid="input-room"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Class Level</Label>
                    <Input
                      value={classLevel}
                      onChange={(e) => setClassLevel(e.target.value)}
                      placeholder="e.g., JSS1"
                      data-testid="input-class-level"
                    />
                  </div>
                </div>

                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancel
                  </Button>
                  <Button type="submit" disabled={createMutation.isPending} data-testid="button-save-schedule">
                    {createMutation.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      "Add Schedule"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : timetable && timetable.length > 0 ? (
        <div className="space-y-4">
          {daysOfWeek.map((day) => {
            const daySchedule = groupedTimetable[day];
            if (daySchedule.length === 0) return null;

            return (
              <Card key={day} data-testid={`timetable-day-${day.toLowerCase()}`}>
                <CardHeader className="pb-3">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Badge className={getDayColor(day)}>{day}</Badge>
                    <span className="text-muted-foreground text-sm font-normal">
                      {daySchedule.length} class{daySchedule.length !== 1 ? "es" : ""}
                    </span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {daySchedule.map((entry) => (
                      <div 
                        key={entry.id} 
                        className="flex items-center justify-between p-3 rounded-lg bg-muted/50 hover-elevate"
                        data-testid={`schedule-entry-${entry.id}`}
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex flex-col items-center text-sm">
                            <span className="font-semibold text-foreground">{entry.startTime}</span>
                            <span className="text-muted-foreground">to</span>
                            <span className="font-semibold text-foreground">{entry.endTime}</span>
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <BookOpen className="h-4 w-4 text-primary" />
                              <span className="font-medium text-foreground">
                                Subject ID: {entry.subjectId}
                              </span>
                            </div>
                            <div className="flex items-center gap-4 mt-1 text-sm text-muted-foreground">
                              {entry.room && <span>Room: {entry.room}</span>}
                              {entry.classLevel && <span>Class: {entry.classLevel}</span>}
                            </div>
                          </div>
                        </div>
                        {(isStaff || isAdmin) && (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => deleteMutation.mutate(entry.id)}
                            className="text-destructive"
                            data-testid={`button-delete-schedule-${entry.id}`}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No Schedule</h3>
            <p className="text-muted-foreground">
              {isStaff ? "Add your first class schedule" : "No timetable entries yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
