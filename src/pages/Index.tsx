import { Button } from "@/components/ui/button";
import { Auth } from "@/components/Auth";
import { useState } from "react";

const Index = () => {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      {!showAuth ? (
        <div className="text-center space-y-6">
          <h1 className="text-4xl font-bold mb-4">Welcome to the Learning Platform</h1>
          <p className="text-xl text-gray-600 mb-8">Start your learning journey today!</p>
          <Button onClick={() => setShowAuth(true)} size="lg">
            Get Started
          </Button>
        </div>
      ) : (
        <Auth />
      )}
    </div>
  );
};

export default Index;