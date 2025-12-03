import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import type { Alumni } from "@shared/schema";
import { Users, Award, Briefcase, GraduationCap } from "lucide-react";

export default function AlumniPage() {
  const { data: alumni, isLoading } = useQuery<Alumni[]>({
    queryKey: ["/api/alumni"],
  });

  const visibleAlumni = alumni?.filter(a => a.isVisible) || [];

  return (
    <>
      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Badge className="mb-4">Our Alumni</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6" data-testid="text-alumni-title">
            Success Stories
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet some of our distinguished alumni who have gone on to achieve 
            great things in their respective fields.
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
          ) : visibleAlumni.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {visibleAlumni.map((person) => (
                <Card 
                  key={person.id} 
                  className="overflow-hidden hover-elevate group"
                  data-testid={`card-alumni-${person.id}`}
                >
                  <div className="aspect-square bg-muted flex items-center justify-center overflow-hidden">
                    {person.profileImage ? (
                      <img 
                        src={person.profileImage} 
                        alt={person.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-muted-foreground">
                        <Users className="h-20 w-20 mb-2" />
                        <span className="text-sm">No Photo</span>
                      </div>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-foreground text-lg mb-1">{person.name}</h3>
                    
                    <div className="flex items-center gap-2 mb-3">
                      <GraduationCap className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Class of {person.graduationYear}
                      </span>
                    </div>
                    
                    {person.currentPosition && (
                      <div className="flex items-start gap-2 mb-3">
                        <Briefcase className="h-4 w-4 text-accent-foreground flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{person.currentPosition}</span>
                      </div>
                    )}
                    
                    {person.achievement && (
                      <div className="flex items-start gap-2 mb-3">
                        <Award className="h-4 w-4 text-chart-3 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">{person.achievement}</span>
                      </div>
                    )}
                    
                    {person.description && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mt-3 pt-3 border-t border-border">
                        {person.description}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="h-10 w-10 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">No Alumni Profiles Yet</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Alumni profiles are being updated. Check back soon to see our distinguished graduates.
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <GraduationCap className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Are You an Al-Furqan Alumnus?
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto mb-8">
            We would love to feature your story and achievements. Connect with us to be part of 
            our alumni network and inspire current students.
          </p>
          <Badge variant="secondary" className="text-base px-4 py-2">
            Contact: alumni@alfurqanschools.edu.ng
          </Badge>
        </div>
      </section>
    </>
  );
}
