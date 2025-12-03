import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { FeaturedTeacher } from "@shared/schema";
import { BookOpen, Award, Star, Clock, GraduationCap } from "lucide-react";

export default function TeachersPage() {
  const { data: teachers, isLoading } = useQuery<FeaturedTeacher[]>({
    queryKey: ["/api/featured-teachers"],
  });

  const visibleTeachers = teachers?.filter(t => t.isVisible) || [];

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Our Teachers</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-teachers-title">
            Meet Our Educators
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our dedicated team of qualified teachers are committed to nurturing 
            young minds and inspiring excellence in every student.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i} className="overflow-hidden">
                  <Skeleton className="aspect-square" />
                  <CardContent className="p-4">
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2 mb-2" />
                    <Skeleton className="h-4 w-full" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : visibleTeachers.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleTeachers.map((teacher) => (
                <Card 
                  key={teacher.id} 
                  className="overflow-hidden hover-elevate group"
                  data-testid={`card-teacher-${teacher.id}`}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {teacher.profileImage ? (
                      <img 
                        src={teacher.profileImage} 
                        alt={teacher.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <BookOpen className="h-20 w-20 mb-2" />
                        <span className="text-sm">No Photo</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground text-lg mb-1">{teacher.name}</h3>
                    
                    {teacher.subject && (
                      <Badge variant="outline" className="mb-3">
                        {teacher.subject}
                      </Badge>
                    )}
                    
                    {teacher.qualification && (
                      <div className="flex items-start gap-2 mb-2">
                        <Award className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{teacher.qualification}</span>
                      </div>
                    )}
                    
                    {teacher.yearsOfExperience && (
                      <div className="flex items-center gap-2 mb-3">
                        <Clock className="h-4 w-4 text-accent-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {teacher.yearsOfExperience} years experience
                        </span>
                      </div>
                    )}
                    
                    {teacher.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-3 pt-3 border-t border-border">
                        {teacher.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <BookOpen className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Teacher Profiles Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Teacher profiles are being updated. Check back soon to meet our dedicated educators.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card border-y border-card-border">
        <div className="max-w-6xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Our Teachers Excel
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Our teaching staff are carefully selected for their expertise, dedication, and passion for education.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center hover-elevate">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Qualified</h3>
                <p className="text-muted-foreground text-sm">
                  All our teachers hold relevant academic qualifications and teaching certifications.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="h-7 w-7 text-accent-foreground" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Experienced</h3>
                <p className="text-muted-foreground text-sm">
                  Our teachers bring years of classroom experience and subject matter expertise.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate">
              <CardContent className="p-8">
                <div className="w-14 h-14 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="h-7 w-7 text-chart-4" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-2">Dedicated</h3>
                <p className="text-muted-foreground text-sm">
                  Our educators are committed to the success and well-being of every student.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <BookOpen className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Join Our Teaching Team
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            Are you a passionate educator looking to make a difference? 
            Al-Furqan Group of Schools is always looking for dedicated teachers.
          </p>
          <Badge variant="secondary" className="text-base px-4 py-2">
            Apply: careers@alfurqanschools.edu.ng
          </Badge>
        </div>
      </section>
    </>
  );
}
