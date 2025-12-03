import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  GraduationCap, 
  Target, 
  Eye, 
  Heart, 
  BookOpen, 
  Award,
  Users,
  Calendar,
  Building,
  Lightbulb
} from "lucide-react";
import schoolLogo from "@assets/school_1764669401414.jpg";
import schoolBanner from "@assets/WhatsApp_Image_2025-12-02_at_10.50.34_b097be9b_1764669520497.jpg";

const values = [
  { icon: BookOpen, title: "Excellence", description: "We strive for academic excellence in every student" },
  { icon: Heart, title: "Integrity", description: "Upholding moral values and Islamic principles" },
  { icon: Users, title: "Community", description: "Building a supportive learning environment" },
  { icon: Lightbulb, title: "Innovation", description: "Embracing modern teaching methodologies" },
];

const milestones = [
  { year: "1993", event: "Al-Furqan Group of Schools was established in Ilorin, Kwara State" },
  { year: "1998", event: "Expanded to include Junior Secondary School section" },
  { year: "2003", event: "Launched Senior Secondary School with Science and Arts departments" },
  { year: "2008", event: "Achieved 100% success rate in WAEC examinations" },
  { year: "2013", event: "Celebrated 20th anniversary with over 1,000 alumni" },
  { year: "2018", event: "Introduced modern ICT facilities and digital learning" },
  { year: "2023", event: "Celebrated 30 years of educational excellence" },
];

const facilities = [
  { name: "Modern Classrooms", description: "Well-ventilated and equipped learning spaces" },
  { name: "Science Laboratories", description: "Fully equipped Physics, Chemistry, and Biology labs" },
  { name: "Computer Lab", description: "State-of-the-art ICT center with internet access" },
  { name: "Library", description: "Comprehensive collection of academic resources" },
  { name: "Sports Facilities", description: "Football field, basketball court, and athletics track" },
  { name: "Assembly Hall", description: "Large hall for gatherings and events" },
];

export default function About() {
  return (
    <>
      <section className="relative py-20 md:py-28 overflow-hidden">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${schoolBanner})` }}
        />
        <div className="relative z-10 max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Badge className="mb-4">About Us</Badge>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6" data-testid="text-about-title">
            Our Story
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            For over three decades, Al-Furqan Group of Schools has been committed to providing 
            quality education that combines Islamic values with academic excellence.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            <div className="relative">
              <img 
                src={schoolLogo} 
                alt="Al-Furqan School Logo" 
                className="w-full max-w-md mx-auto rounded-lg border-4 border-primary/20"
                data-testid="img-about-logo"
              />
            </div>
            <div>
              <Badge className="mb-4">History</Badge>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-6">
                A Legacy of Excellence
              </h2>
              <div className="space-y-4 text-lg text-muted-foreground leading-relaxed">
                <p>
                  Al-Furqan Group of Schools was founded in 1993 by visionary educators who believed 
                  that quality education should integrate both Western academic standards and Islamic 
                  moral values. The name "Al-Furqan" means "The Criterion" in Arabic, representing 
                  our commitment to distinguishing truth from falsehood through knowledge.
                </p>
                <p>
                  Located in the heart of Ilorin, Kwara State, on Airforce Road GbaGba, our institution 
                  has grown from a small nursery school to a comprehensive educational institution 
                  offering education from nursery to senior secondary levels.
                </p>
                <p>
                  Our motto, <strong>"Knowledge at childhood is like an inscription on a stone,"</strong> reflects 
                  our belief that early education forms the foundation of lifelong success. We take pride 
                  in the thousands of students we have nurtured into responsible citizens and successful 
                  professionals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-card border-y border-card-border">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center hover-elevate" data-testid="card-mission">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Target className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Mission</h3>
                <p className="text-muted-foreground">
                  To provide sound qualitative, quantitative, and moral education that empowers 
                  students to become responsible citizens and leaders in their communities.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate" data-testid="card-vision">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Eye className="h-8 w-8 text-accent-foreground" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Vision</h3>
                <p className="text-muted-foreground">
                  To be the leading educational institution in Kwara State, recognized for academic 
                  excellence, moral uprightness, and the holistic development of every student.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center hover-elevate" data-testid="card-philosophy">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-chart-4/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <GraduationCap className="h-8 w-8 text-chart-4" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Our Philosophy</h3>
                <p className="text-muted-foreground">
                  Education is the key to unlocking human potential. We believe every child has 
                  unique gifts that, when nurtured properly, can transform the world.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Our Values</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              What We Stand For
            </h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-value-${index}`}>
                <CardContent className="p-6 text-center">
                  <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <value.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2">{value.title}</h3>
                  <p className="text-muted-foreground text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Timeline</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Our Journey
            </h2>
          </div>
          
          <div className="relative">
            <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-border md:-translate-x-0.5" />
            
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div 
                  key={index} 
                  className={`relative flex items-start gap-6 md:gap-12 ${
                    index % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'
                  }`}
                  data-testid={`milestone-${index}`}
                >
                  <div className="absolute left-4 md:left-1/2 w-4 h-4 bg-primary rounded-full -translate-x-1/2 mt-1.5 border-4 border-background" />
                  
                  <div className={`flex-1 pl-10 md:pl-0 ${index % 2 === 0 ? 'md:text-right md:pr-12' : 'md:text-left md:pl-12'}`}>
                    <Badge variant="outline" className="mb-2">{milestone.year}</Badge>
                    <p className="text-foreground">{milestone.event}</p>
                  </div>
                  
                  <div className="hidden md:block flex-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Badge className="mb-4">Facilities</Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Our Facilities
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide modern facilities that support effective learning and holistic development.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {facilities.map((facility, index) => (
              <Card key={index} className="hover-elevate" data-testid={`card-facility-${index}`}>
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-accent/20 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Building className="h-6 w-6 text-accent-foreground" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-1">{facility.name}</h3>
                      <p className="text-muted-foreground text-sm">{facility.description}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto px-4 md:px-6 lg:px-8 text-center">
          <Award className="h-16 w-16 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Government Approved Institution
          </h2>
          <p className="text-lg opacity-90 max-w-2xl mx-auto">
            Al-Furqan Group of Schools is fully approved by the Kwara State Ministry of Education, 
            ensuring our curriculum meets all national standards while maintaining our commitment 
            to Islamic values and moral education.
          </p>
        </div>
      </section>
    </>
  );
}
