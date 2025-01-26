import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const Auth = () => {
  const [userType, setUserType] = useState<"student" | "professor">("student");
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Student form state
  const [studentName, setStudentName] = useState("");
  const [indexNumber, setIndexNumber] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  // Professor form state
  const [professorName, setProfessorName] = useState("");
  const [staffId, setStaffId] = useState("");
  const [professorEmail, setProfessorEmail] = useState("");
  const [professorPassword, setProfessorPassword] = useState("");

  const generateStaffId = (name: string) => {
    const prefix = name.slice(0, 3).toUpperCase();
    const suffix = "0000";
    return `${prefix}${suffix}`;
  };

  const validateIndexNumber = (index: string) => {
    return /^\d{10}$/.test(index);
  };

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    if (!validateIndexNumber(indexNumber)) {
      toast({
        title: "Invalid Index Number",
        description: "Index number must be 10 digits",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: studentEmail,
        password: studentPassword,
        options: {
          data: {
            name: studentName,
            type: 'student'
          }
        }
      });

      if (authError) {
        if (authError.message.includes('rate_limit')) {
          toast({
            title: "Too Many Attempts",
            description: "Please wait a minute before trying again",
            variant: "destructive",
          });
          return;
        }
        throw authError;
      }

      if (authData.user) {
        // Create student profile
        const { error: profileError } = await supabase
          .from('students')
          .insert({
            user_id: authData.user.id,
            name: studentName,
            index_number: indexNumber,
          });

        if (profileError) {
          // If profile creation fails, we should clean up the auth user
          await supabase.auth.signOut();
          throw profileError;
        }

        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleProfessorRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    const generatedStaffId = generateStaffId(professorName);

    try {
      setIsLoading(true);
      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: professorEmail,
        password: professorPassword,
        options: {
          data: {
            name: professorName,
            type: 'professor'
          }
        }
      });

      if (authError) {
        if (authError.message.includes('rate_limit')) {
          toast({
            title: "Too Many Attempts",
            description: "Please wait a minute before trying again",
            variant: "destructive",
          });
          return;
        }
        throw authError;
      }

      if (authData.user) {
        // Create professor profile
        const { error: profileError } = await supabase
          .from('professors')
          .insert({
            user_id: authData.user.id,
            name: professorName,
            staff_id: staffId || generatedStaffId,
            hourly_rate: 0, // Default value
          });

        if (profileError) {
          // If profile creation fails, clean up the auth user
          await supabase.auth.signOut();
          throw profileError;
        }

        toast({
          title: "Registration Successful",
          description: "Please check your email to verify your account",
        });
        setIsLogin(true);
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    
    try {
      setIsLoading(true);
      const email = userType === 'student' ? studentEmail : professorEmail;
      const password = userType === 'student' ? studentPassword : professorPassword;

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // Get user metadata to determine the correct dashboard
      const { data: { user } } = await supabase.auth.getUser();
      const userType = user?.user_metadata?.type;

      toast({
        title: "Login Successful",
        description: `Welcome back!`,
      });

      // Redirect based on user type
      if (userType === 'student') {
        navigate("/dashboard");
      } else if (userType === 'professor') {
        navigate("/professor-dashboard");
      } else {
        // Fallback to student dashboard if type is not set
        navigate("/dashboard");
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md p-6">
        <Tabs defaultValue="student" onValueChange={(value) => setUserType(value as "student" | "professor")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="student">Student</TabsTrigger>
            <TabsTrigger value="professor">Professor</TabsTrigger>
          </TabsList>

          <TabsContent value="student">
            <form onSubmit={isLogin ? handleLogin : handleStudentRegister} className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                {isLogin ? "Student Login" : "Student Registration"}
              </h2>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="studentName">Full Name</Label>
                    <Input
                      id="studentName"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="studentEmail">Email</Label>
                    <Input
                      id="studentEmail"
                      type="email"
                      value={studentEmail}
                      onChange={(e) => setStudentEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="indexNumber">Index Number</Label>
                <Input
                  id="indexNumber"
                  value={indexNumber}
                  onChange={(e) => setIndexNumber(e.target.value)}
                  placeholder="1021070000"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="studentPassword">Password</Label>
                <Input
                  id="studentPassword"
                  type="password"
                  value={studentPassword}
                  onChange={(e) => setStudentPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : (isLogin ? "Login" : "Register")}
              </Button>

              <p className="text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </form>
          </TabsContent>

          <TabsContent value="professor">
            <form onSubmit={isLogin ? handleLogin : handleProfessorRegister} className="space-y-4">
              <h2 className="text-2xl font-bold text-center">
                {isLogin ? "Professor Login" : "Professor Registration"}
              </h2>

              {!isLogin && (
                <>
                  <div>
                    <Label htmlFor="professorName">Full Name</Label>
                    <Input
                      id="professorName"
                      value={professorName}
                      onChange={(e) => setProfessorName(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                  <div>
                    <Label htmlFor="professorEmail">Email</Label>
                    <Input
                      id="professorEmail"
                      type="email"
                      value={professorEmail}
                      onChange={(e) => setProfessorEmail(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

              <div>
                <Label htmlFor="staffId">Staff ID</Label>
                <Input
                  id="staffId"
                  value={staffId}
                  onChange={(e) => setStaffId(e.target.value)}
                  placeholder="ABC0000"
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="professorPassword">Password</Label>
                <Input
                  id="professorPassword"
                  type="password"
                  value={professorPassword}
                  onChange={(e) => setProfessorPassword(e.target.value)}
                  required
                  disabled={isLoading}
                />
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Please wait..." : (isLogin ? "Login" : "Register")}
              </Button>

              <p className="text-center text-sm">
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-primary hover:underline"
                  disabled={isLoading}
                >
                  {isLogin ? "Register" : "Login"}
                </button>
              </p>
            </form>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};