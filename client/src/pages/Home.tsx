import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  GraduationCap,
  Users,
  Award,
  BookOpen,
  ArrowRight,
  Calendar,
  Download,
  Star,
  ChevronRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Alumni, FeaturedTeacher } from "@shared/schema";

const stats = [
  {
    icon: Calendar,
    value: "30+",
    label: "Years Established",
    color: "text-primary",
  },
  {
    icon: Users,
    value: "1,500+",
    label: "Students Enrolled",
    color: "text-chart-1",
  },
  {
    icon: GraduationCap,
    value: "50+",
    label: "Qualified Teachers",
    color: "text-accent",
  },
  { icon: Award, value: "98%", label: "Success Rate", color: "text-chart-4" },
];

const academicLevels = [
  {
    name: "Nursery",
    description: "Foundation years for early learners",
    icon: "🎨",
  },
  {
    name: "Primary",
    description: "Building strong academic fundamentals",
    icon: "📚",
  },
  {
    name: "Junior Secondary",
    description: "Developing critical thinking skills",
    icon: "🔬",
  },
  {
    name: "Senior Secondary",
    description: "Preparing for higher education",
    icon: "🎓",
  },
];

export default function Home() {
  const { data: alumniData } = useQuery<Alumni[]>({
    queryKey: ["/api/alumni"],
  });

  const { data: teachersData } = useQuery<FeaturedTeacher[]>({
    queryKey: ["/api/featured-teachers"],
  });

  const alumni = alumniData || [];
  const teachers = teachersData || [];

  return (
    <div className="min-h-screen">
      <section className="relative min-h-[600px] lg:min-h-[700px] flex items-center justify-center overflow-hidden bg-gradient-to-br from-amber-900 via-amber-800 to-amber-900">
        <div className="relative z-10 max-w-5xl mx-auto px-4 md:px-6 lg:px-8 text-center py-20">
          <Badge className="mb-6 bg-amber-600 text-white border-amber-500">
            Government Approved Institution
          </Badge>

          <h1
            className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold text-white mb-6 leading-tight"
            data-testid="text-hero-title"
          >
            Al-Furqan Group of Schools
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 font-medium italic">
            "Knowledge at childhood is like an inscription on a stone"
          </p>

          <p className="text-lg text-white/70 mb-8 max-w-2xl mx-auto">
            Providing sound qualitative, quantitative and moral uprightness
            since 1993. Located in Airforce Road GbaGba, Ilorin, Kwara State.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button
                size="lg"
                className="bg-white text-amber-900 hover:bg-white/90"
                data-testid="button-hero-portal"
              >
                <GraduationCap className="h-5 w-5 mr-2" />
                Portal Login
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10"
                data-testid="button-hero-learn"
              >
                Learn More
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="text-center p-6">
                <CardContent className="p-0">
                  <stat.icon
                    className={`h-10 w-10 mx-auto mb-4 ${stat.color}`}
                  />
                  <div className="text-3xl md:text-4xl font-bold mb-2">
                    {stat.value}
                  </div>
                  <div className="text-muted-foreground text-sm">
                    {stat.label}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Academic Levels</Badge>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Complete Education Journey
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              From nursery to senior secondary, we provide comprehensive
              education at every level.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {academicLevels.map((level, index) => (
              <Card
                key={index}
                className="group hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-6 text-center">
                  <div className="text-4xl mb-4">{level.icon}</div>
                  <h3 className="text-xl font-semibold mb-2">{level.name}</h3>
                  <p className="text-muted-foreground text-sm">
                    {level.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {teachers.length > 0 && (
        <section className="py-16 md:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4">Our Faculty</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Meet Our Teachers
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Dedicated professionals committed to nurturing the next
                generation.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {teachers.slice(0, 6).map((teacher) => (
                <Card
                  key={teacher.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <GraduationCap className="h-8 w-8 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">
                          {teacher.name}
                        </h3>
                        <p className="text-primary text-sm font-medium">
                          {teacher.position}
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          {teacher.department}
                        </p>
                        {teacher.specialization && (
                          <p className="text-muted-foreground text-xs mt-2">
                            {teacher.specialization}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/teachers">
                <Button variant="outline">
                  View All Teachers
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {alumni.length > 0 && (
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
            <div className="text-center mb-12">
              <Badge className="mb-4">Alumni Network</Badge>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Notable Alumni
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our graduates continue to make us proud in their respective
                fields.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {alumni.slice(0, 6).map((alum) => (
                <Card
                  key={alum.id}
                  className="overflow-hidden group hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Star className="h-8 w-8 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{alum.name}</h3>
                        <p className="text-primary text-sm font-medium">
                          {alum.profession}
                        </p>
                        <p className="text-muted-foreground text-sm mt-1">
                          Class of {alum.graduationYear}
                        </p>
                        {alum.achievement && (
                          <p className="text-muted-foreground text-xs mt-2 line-clamp-2">
                            {alum.achievement}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Link href="/alumni">
                <Button variant="outline">
                  View All Alumni
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Ready to Join Our Community?
          </h2>
          <p className="text-lg mb-8 opacity-90">
            Take the first step towards quality education. Download our
            registration forms and begin your journey with Al-Furqan Group of
            Schools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/registration">
              <Button
                size="lg"
                variant="secondary"
                className="w-full sm:w-auto"
              >
                <Download className="h-5 w-5 mr-2" />
                Registration Forms
              </Button>
            </Link>
            <Link href="/about">
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                Learn More About Us
                <ArrowRight className="h-5 w-5 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
