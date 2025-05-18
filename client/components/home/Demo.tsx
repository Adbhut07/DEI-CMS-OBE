import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  BookOpen, ChevronRight, ListChecks, PieChart, Users 
} from "lucide-react";

const Demo = () => {
  return (
    <section id="demo" className="py-20 relative">
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-accent/20 rounded-full filter blur-3xl opacity-20 -z-10"></div>
      
      <div className="container mx-auto px-4">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-accent-gradient text-2xl font-semibold mb-3">Experience OutcomeMagic</h2>
          <h3 className="text-4xl font-bold text-white mb-6">See the Software in Action</h3>
          <p className="text-white/70 text-lg">
            Take a closer look at how our platform streamlines outcome assessment and helps institutions excel in outcome-based education.
          </p>
        </div>
        
        <div className="glass-card p-6 lg:p-8 animate-fade-in">
          <Tabs defaultValue="marks" className="w-full">
            <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-transparent h-auto mb-6">
              <TabsTrigger 
                value="marks" 
                className="data-[state=active]:bg-accent/20 data-[state=active]:text-white text-white/70 p-3 h-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  <span>Marks Management</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="outcomes" 
                className="data-[state=active]:bg-accent/20 data-[state=active]:text-white text-white/70 p-3 h-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <ListChecks className="h-5 w-5" />
                  <span>Outcome Mapping</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="analytics" 
                className="data-[state=active]:bg-accent/20 data-[state=active]:text-white text-white/70 p-3 h-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <PieChart className="h-5 w-5" />
                  <span>Course Management</span>
                </div>
              </TabsTrigger>
              <TabsTrigger 
                value="users" 
                className="data-[state=active]:bg-accent/20 data-[state=active]:text-white text-white/70 p-3 h-auto"
              >
                <div className="flex flex-col items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>User Management</span>
                </div>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="marks" className="mt-0">
              <div className="bg-black/40 p-4 rounded-xl">
                <img 
                  src="/sst.png" 
                  alt="Marks Management Interface" 
                  className="rounded-lg w-full border border-white/10" 
                />
              </div>
              <div className="mt-6 text-center">
                <h4 className="text-2xl font-semibold text-white mb-3">Simple, Efficient Marks Entry</h4>
                <p className="text-white/70 text-lg max-w-3xl mx-auto mb-6">
                  Our intuitive interface makes it easy to enter and manage student marks across different components, ensuring accurate calculation of course outcomes.
                </p>
                <Button className="bg-accent hover:bg-accent/80 text-white">
                  See More Features <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>
            
            <TabsContent value="outcomes" className="mt-0">
              <div className="bg-black/40 p-4 rounded-xl">
                <img 
                  src="/CO.png" 
                  alt="Outcome Management Interface" 
                  className="rounded-lg w-full border border-white/10" 
                />
              </div>
              <div className="mt-6 text-center">
                <h4 className="text-2xl font-semibold text-white mb-3">Intuitive Outcome Mapping</h4>
                <p className="text-white/70 text-lg max-w-3xl mx-auto mb-6">
                  Easily map course outcomes to program outcomes and educational objectives with our visual mapping tools.
                </p>
                <Button className="bg-accent hover:bg-accent/80 text-white">
                  See More Features <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="analytics" className="mt-0">
              <div className="bg-black/40 p-4 rounded-xl">
                <img 
                  src="/course_management.png" 
                  alt="Course Management Interface" 
                  className="rounded-lg w-full border border-white/10" 
                />
              </div>
              <div className="mt-6 text-center">
                <h4 className="text-2xl font-semibold text-white mb-3">Intuitive Course Mapping</h4>
                <p className="text-white/70 text-lg max-w-3xl mx-auto mb-6">
                  Easily manage courses with batches and assign subjects and units to it.
                </p>
              </div>
            </TabsContent>

            <TabsContent value="users" className="mt-0">
              <div className="bg-black/40 p-4 rounded-xl">
                <img 
                  src="/user.png" 
                  alt="User Management Interface" 
                  className="rounded-lg w-full border border-white/10" 
                />
              </div>
              <div className="mt-6 text-center">
                <h4 className="text-2xl font-semibold text-white mb-3">Comprehensive User Management</h4>
                <p className="text-white/70 text-lg max-w-3xl mx-auto mb-6">
                  Set up different roles and permissions for faculty, administrators, and department heads to ensure proper access control.                
                </p>
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default Demo;