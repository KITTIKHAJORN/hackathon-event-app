import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  User, 
  Mail, 
  FileText, 
  Calendar, 
  DollarSign, 
  Image, 
  Shield, 
  Lock, 
  Edit, 
  Trash2, 
  CheckCircle,
  ArrowRight,
  Clock,
  AlertTriangle
} from "lucide-react";

export function WorkflowGuide() {
  const creationSteps = [
    {
      step: 1,
      title: "Creator Information",
      description: "Enter your email address",
      icon: Mail,
      details: "Your email will be used to generate a secure OTP for event management",
      color: "bg-blue-500"
    },
    {
      step: 2,
      title: "Basic Information", 
      description: "Event title, description, category",
      icon: FileText,
      details: "Provide essential details about your event",
      color: "bg-green-500"
    },
    {
      step: 3,
      title: "Date & Location",
      description: "When and where your event happens",
      icon: Calendar,
      details: "Set date, time, and venue (online or physical location)",
      color: "bg-purple-500"
    },
    {
      step: 4,
      title: "Pricing & Capacity",
      description: "Ticket types and attendee limits",
      icon: DollarSign,
      details: "Configure ticket pricing and maximum capacity - then create your event!",
      color: "bg-orange-500"
    }
  ];

  const managementFlow = [
    {
      title: "Verify Identity",
      description: "Enter Event ID, Email, and OTP",
      icon: Shield,
      color: "bg-red-500"
    },
    {
      title: "Access Granted",
      description: "View your event management dashboard",
      icon: CheckCircle,
      color: "bg-green-500"
    },
    {
      title: "Choose Action",
      description: "Edit details, delete event, or regenerate OTP",
      icon: Edit,
      color: "bg-blue-500"
    }
  ];

  const securityFeatures = [
    {
      title: "6-Digit OTP",
      description: "Unique code for each event",
      icon: Lock
    },
    {
      title: "30-Minute Expiry",
      description: "OTP expires after 30 minutes",
      icon: Clock
    },
    {
      title: "Single Use",
      description: "OTP invalidated after use",
      icon: CheckCircle
    },
    {
      title: "Email Verification",
      description: "Must match creator email",
      icon: Mail
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-4">Event Management Workflow</h1>
        <p className="text-muted-foreground text-lg">
          Learn how to create and manage events securely with OTP protection
        </p>
      </div>

      {/* Event Creation Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Event Creation Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {creationSteps.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={step.step} className="relative">
                  <Card className="h-full hover:shadow-lg transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center text-center space-y-3">
                        <div className={`${step.color} p-3 rounded-full text-white`}>
                          <Icon className="h-6 w-6" />
                        </div>
                        <Badge variant="outline">Step {step.step}</Badge>
                        <h3 className="font-semibold text-sm">{step.title}</h3>
                        <p className="text-xs text-muted-foreground">{step.description}</p>
                        <p className="text-xs text-muted-foreground italic">{step.details}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {index < creationSteps.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-6 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  )}
                </div>
              );
            })}
          </div>
          
          <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-medium text-primary mb-2">Security Generated</h4>
                <p className="text-sm text-muted-foreground">
                  After completing all steps, the system generates a unique 6-digit OTP that serves as your event management key. 
                  <strong className="text-primary"> Save this OTP securely</strong> - you'll need it to edit or delete your event later.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Event Management Workflow */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Lock className="h-5 w-5" />
            Event Management Process
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {managementFlow.map((step, index) => {
              const Icon = step.icon;
              return (
                <div key={index} className="relative">
                  <Card className="h-full">
                    <CardContent className="p-6">
                      <div className="flex flex-col items-center text-center space-y-4">
                        <div className={`${step.color} p-4 rounded-full text-white`}>
                          <Icon className="h-8 w-8" />
                        </div>
                        <h3 className="font-semibold">{step.title}</h3>
                        <p className="text-sm text-muted-foreground">{step.description}</p>
                      </div>
                    </CardContent>
                  </Card>
                  {index < managementFlow.length - 1 && (
                    <ArrowRight className="hidden md:block absolute top-1/2 -right-8 transform -translate-y-1/2 text-muted-foreground h-6 w-6" />
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-green-200 bg-green-50 dark:bg-green-950/20">
              <CardContent className="p-4 text-center">
                <Edit className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-green-800 dark:text-green-200">Edit Event</h4>
                <p className="text-sm text-green-600 dark:text-green-300">
                  Modify event details with OTP verification
                </p>
              </CardContent>
            </Card>

            <Card className="border-red-200 bg-red-50 dark:bg-red-950/20">
              <CardContent className="p-4 text-center">
                <Trash2 className="h-8 w-8 text-red-600 mx-auto mb-2" />
                <h4 className="font-medium text-red-800 dark:text-red-200">Delete Event</h4>
                <p className="text-sm text-red-600 dark:text-red-300">
                  Permanently remove event with confirmation
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950/20">
              <CardContent className="p-4 text-center">
                <Lock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-blue-800 dark:text-blue-200">Regenerate OTP</h4>
                <p className="text-sm text-blue-600 dark:text-blue-300">
                  Get a new OTP if the original is lost
                </p>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Security Features */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Security Features
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {securityFeatures.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-primary/20">
                  <CardContent className="p-4">
                    <div className="flex flex-col items-center text-center space-y-3">
                      <div className="bg-primary/10 p-3 rounded-full">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-sm">{feature.title}</h3>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Important Notes */}
      <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-yellow-800 dark:text-yellow-200">
            <AlertTriangle className="h-5 w-5" />
            Important Security Guidelines
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-yellow-800 dark:text-yellow-200">
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <p className="text-sm">
                <strong>Save your OTP immediately</strong> after event creation - it's shown only once
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <p className="text-sm">
                <strong>Keep your OTP secure</strong> - don't share it with others
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <p className="text-sm">
                <strong>OTP expires in 30 minutes</strong> - regenerate if needed
              </p>
            </div>
            <div className="flex items-start gap-2">
              <div className="w-2 h-2 rounded-full bg-yellow-500 mt-2"></div>
              <p className="text-sm">
                <strong>Use the same email</strong> for verification as used during creation
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-center space-x-4">
        <Button size="lg" className="flex items-center gap-2">
          <User className="h-4 w-4" />
          Create Your First Event
        </Button>
        <Button variant="outline" size="lg" className="flex items-center gap-2">
          <Lock className="h-4 w-4" />
          Manage Existing Event
        </Button>
      </div>
    </div>
  );
}