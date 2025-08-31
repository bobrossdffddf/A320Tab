import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plane, Shield, Users, MessageSquare } from "lucide-react";

export function LoginPage() {
  const handleDiscordLogin = () => {
    window.location.href = '/auth/discord';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <Plane className="h-12 w-12 text-blue-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">PTFS Ground Control</h1>
          <p className="text-blue-200 mt-2">Professional flight operations management system</p>
        </div>

        <Card className="bg-slate-800 border-slate-700">
          <CardHeader>
            <CardTitle className="text-white">Sign In Required</CardTitle>
            <CardDescription className="text-slate-300">
              Connect with Discord to access the ground control system
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleDiscordLogin}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white"
              size="lg"
            >
              Continue with Discord
            </Button>
            
            <div className="grid grid-cols-3 gap-4 mt-6 text-center">
              <div className="space-y-2">
                <Shield className="h-6 w-6 text-green-400 mx-auto" />
                <p className="text-xs text-slate-400">Secure Access</p>
              </div>
              <div className="space-y-2">
                <Users className="h-6 w-6 text-blue-400 mx-auto" />
                <p className="text-xs text-slate-400">Ground Crew</p>
              </div>
              <div className="space-y-2">
                <MessageSquare className="h-6 w-6 text-purple-400 mx-auto" />
                <p className="text-xs text-slate-400">Real-time Comms</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center text-sm text-slate-400">
          <p>Powered by ATC24 Live Data</p>
        </div>
      </div>
    </div>
  );
}