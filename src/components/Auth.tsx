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
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<"student" | "professor">("student");
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

  const handleStudentRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    try {
      setIsLoading(true);

      // First check if index number is already in use
      const { data: existingStudent, error: checkError } = await supabase
        .from('students')
        .select('id')
        .eq('index_number', indexNumber)
        .maybeSingle();

      if (checkError) {
        console.error('Error checking existing student:', checkError);
        toast({
          title: "Registration Failed",
          description: "An error occurred while checking student information. Please try again.",
          variant: "destructive",
        });
        return;
      }

      if (existingStudent) {
        toast({
          title: "Registration Failed",
          description: "This index number is already registered. Please use a different index number.",
          variant: "destructive",
        });
        return;
      }

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
        if (authError.message === "User already registered") {
          toast({
            title: "Account Exists",
            description: "This email is already registered. Please login instead.",
            variant: "destructive",
          });
          setIsLogin(true);
        } else {
          throw authError;
        }
        return;
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
          // If profile creation fails, sign out the user
          await supabase.auth.signOut();
          
          if (profileError.code === '23505') {
            toast({
              title: "Registration Failed",
              description: "This index number is already registered. Please use a different index number.",
              variant: "destructive",
            });
          } else {
            throw profileError;
          }
          return;
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
        if (authError.message === "User already registered") {
          toast({
            title: "Registration Failed",
            description: "This email is already registered. Please login instead.",
            variant: "destructive",
          });
          setIsLogin(true);
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
            staff_id: staffId,
            hourly_rate: 0, // Default value
          });

        if (profileError) throw profileError;

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

    const email = userType === 'student' ? studentEmail : professorEmail;
    const password = userType === 'student' ? studentPassword : professorPassword;

    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      const { data: { user } } = await supabase.auth.getUser();
      const userMetadataType = user?.user_metadata?.type;

      toast({
        title: "Login Successful",
        description: "Welcome back!",
      });

      // Redirect based on user type
      if (userMetadataType === 'student') {
        navigate("/dashboard");
      } else if (userMetadataType === 'professor') {
        navigate("/professor-dashboard");
      } else {
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
                    <Label htmlFor="indexNumber">Index Number</Label>
                    <Input
                      id="indexNumber"
                      value={indexNumber}
                      onChange={(e) => setIndexNumber(e.target.value)}
                      required
                      disabled={isLoading}
                      placeholder="Enter your student index number"
                    />
                  </div>
                </>
              )}

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
                    <Label htmlFor="staffId">Staff ID</Label>
                    <Input
                      id="staffId"
                      value={staffId}
                      onChange={(e) => setStaffId(e.target.value)}
                      required
                      disabled={isLoading}
                    />
                  </div>
                </>
              )}

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