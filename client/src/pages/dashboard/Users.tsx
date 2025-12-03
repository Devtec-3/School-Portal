import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { 
  Search, 
  Users as UsersIcon, 
  Loader2,
  Shield,
  GraduationCap,
  Briefcase,
  Crown
} from "lucide-react";

const roleFilters = [
  { value: "all", label: "All Users" },
  { value: "student", label: "Students" },
  { value: "staff", label: "Staff" },
  { value: "management", label: "Management" },
  { value: "super_admin", label: "Admins" },
];

const roleIcons = {
  super_admin: Crown,
  management: Shield,
  staff: Briefcase,
  student: GraduationCap,
};

const roleBadgeColors = {
  super_admin: "bg-destructive/10 text-destructive",
  management: "bg-primary/10 text-primary",
  staff: "bg-chart-1/10 text-chart-1",
  student: "bg-chart-4/10 text-chart-4",
};

export default function Users() {
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const filteredUsers = users?.filter(user => {
    const matchesSearch = 
      user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.uniqueId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    
    return matchesSearch && matchesRole;
  }) || [];

  const getInitials = (firstName: string, surname: string) => {
    return `${firstName?.[0] || ""}${surname?.[0] || ""}`.toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    return role.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground" data-testid="text-users-title">
          User Management
        </h1>
        <p className="text-muted-foreground mt-1">
          View and manage all registered users
        </p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name or ID..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
            data-testid="input-search-users"
          />
        </div>
        <Select value={roleFilter} onValueChange={setRoleFilter}>
          <SelectTrigger className="w-48" data-testid="select-role-filter">
            <SelectValue placeholder="Filter by role" />
          </SelectTrigger>
          <SelectContent>
            {roleFilters.map((filter) => (
              <SelectItem key={filter.value} value={filter.value}>
                {filter.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {roleFilters.slice(1).map((filter) => {
          const count = users?.filter(u => u.role === filter.value).length || 0;
          const Icon = roleIcons[filter.value as keyof typeof roleIcons] || UsersIcon;
          return (
            <Card 
              key={filter.value} 
              className={`cursor-pointer hover-elevate ${roleFilter === filter.value ? 'ring-2 ring-primary' : ''}`}
              onClick={() => setRoleFilter(filter.value)}
            >
              <CardContent className="p-4">
                <Icon className="h-5 w-5 text-muted-foreground mb-2" />
                <p className="text-2xl font-bold text-foreground">{count}</p>
                <p className="text-sm text-muted-foreground">{filter.label}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      ) : filteredUsers.length > 0 ? (
        <div className="grid gap-4">
          {filteredUsers.map((user) => {
            const Icon = roleIcons[user.role as keyof typeof roleIcons] || UsersIcon;
            return (
              <Card key={user.id} className="hover-elevate" data-testid={`user-card-${user.id}`}>
                <CardContent className="p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={user.profileImage || undefined} />
                        <AvatarFallback className="bg-primary text-primary-foreground">
                          {getInitials(user.firstName, user.surname)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-semibold text-foreground">
                          {user.firstName} {user.middleName ? `${user.middleName} ` : ""}{user.surname}
                        </h3>
                        <p className="text-sm text-muted-foreground">ID: {user.uniqueId}</p>
                        {user.classLevel && (
                          <p className="text-sm text-muted-foreground">Class: {user.classLevel}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-3 ml-16 md:ml-0">
                      <Badge 
                        variant="outline" 
                        className={roleBadgeColors[user.role as keyof typeof roleBadgeColors]}
                      >
                        <Icon className="h-3 w-3 mr-1" />
                        {getRoleLabel(user.role)}
                      </Badge>
                      <Badge variant={user.isActive ? "outline" : "secondary"}>
                        {user.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="py-12 text-center">
            <UsersIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-1">No Users Found</h3>
            <p className="text-muted-foreground">
              {searchTerm || roleFilter !== "all" ? "Try adjusting your filters" : "No users registered yet"}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
