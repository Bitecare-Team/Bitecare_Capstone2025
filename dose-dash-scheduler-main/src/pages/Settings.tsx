
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { 
  Bell, 
  UserCog, 
  Shield, 
  BellOff, 
  Smartphone, 
  Mail,
  Monitor,
  Eye,
  EyeOff
} from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";

export default function Settings() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    browser: true,
    app: false
  });
  
  const [appearance, setAppearance] = useState({
    compactView: false,
    highContrast: false,
    largeText: false
  });

  const [privacy, setPrivacy] = useState({
    showPatientDetails: true,
    anonymizeData: false,
    storeHistory: true
  });

  const handleSettingChange = (
    category: "notifications" | "appearance" | "privacy", 
    setting: string, 
    value: boolean
  ) => {
    if (category === "notifications") {
      setNotifications(prev => ({ ...prev, [setting]: value }));
    } else if (category === "appearance") {
      setAppearance(prev => ({ ...prev, [setting]: value }));
    } else if (category === "privacy") {
      setPrivacy(prev => ({ ...prev, [setting]: value }));
    }
    
    toast.success(`Setting updated successfully`);
  };

  const handleSaveAll = () => {
    toast.success("All settings saved successfully");
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <Button onClick={handleSaveAll}>Save All Changes</Button>
      </div>
      
      <Tabs defaultValue="notifications" className="w-full">
        <TabsList className="grid w-full md:w-auto grid-cols-3 md:grid-cols-3">
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" /> 
            <span className="hidden sm:inline">Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="appearance" className="flex items-center gap-2">
            <Eye className="h-4 w-4" /> 
            <span className="hidden sm:inline">Appearance</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" /> 
            <span className="hidden sm:inline">Privacy</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose how you would like to receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Mail className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="email-notifications" className="text-base">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via email</p>
                  </div>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={notifications.email}
                  onCheckedChange={(checked) => 
                    handleSettingChange("notifications", "email", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Smartphone className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="sms-notifications" className="text-base">SMS Notifications</Label>
                    <p className="text-sm text-muted-foreground">Receive updates via text message</p>
                  </div>
                </div>
                <Switch 
                  id="sms-notifications" 
                  checked={notifications.sms}
                  onCheckedChange={(checked) => 
                    handleSettingChange("notifications", "sms", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <Monitor className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="browser-notifications" className="text-base">Browser Notifications</Label>
                    <p className="text-sm text-muted-foreground">Show notifications in browser</p>
                  </div>
                </div>
                <Switch 
                  id="browser-notifications" 
                  checked={notifications.browser}
                  onCheckedChange={(checked) => 
                    handleSettingChange("notifications", "browser", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <BellOff className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <Label htmlFor="do-not-disturb" className="text-base">Do Not Disturb</Label>
                    <p className="text-sm text-muted-foreground">Temporarily silence all notifications</p>
                  </div>
                </div>
                <Switch 
                  id="do-not-disturb" 
                  checked={!notifications.app}
                  onCheckedChange={(checked) => 
                    handleSettingChange("notifications", "app", !checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Appearance Settings</CardTitle>
              <CardDescription>
                Customize how the application looks
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="compact-view" className="text-base">Compact View</Label>
                  <p className="text-sm text-muted-foreground">Display more information in less space</p>
                </div>
                <Switch 
                  id="compact-view" 
                  checked={appearance.compactView}
                  onCheckedChange={(checked) => 
                    handleSettingChange("appearance", "compactView", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="high-contrast" className="text-base">High Contrast</Label>
                  <p className="text-sm text-muted-foreground">Increase visual distinction between items</p>
                </div>
                <Switch 
                  id="high-contrast" 
                  checked={appearance.highContrast}
                  onCheckedChange={(checked) => 
                    handleSettingChange("appearance", "highContrast", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="large-text" className="text-base">Large Text</Label>
                  <p className="text-sm text-muted-foreground">Increase text size for better readability</p>
                </div>
                <Switch 
                  id="large-text" 
                  checked={appearance.largeText}
                  onCheckedChange={(checked) => 
                    handleSettingChange("appearance", "largeText", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="privacy" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>
                Control how your data is handled
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="show-patient-details" className="text-base">Show Patient Details</Label>
                  <p className="text-sm text-muted-foreground">Display full patient information in lists</p>
                </div>
                <Switch 
                  id="show-patient-details" 
                  checked={privacy.showPatientDetails}
                  onCheckedChange={(checked) => 
                    handleSettingChange("privacy", "showPatientDetails", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="anonymize-data" className="text-base">Anonymize Data in Reports</Label>
                  <p className="text-sm text-muted-foreground">Remove identifiable information from exports</p>
                </div>
                <Switch 
                  id="anonymize-data" 
                  checked={privacy.anonymizeData}
                  onCheckedChange={(checked) => 
                    handleSettingChange("privacy", "anonymizeData", checked)
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="store-history" className="text-base">Store Search History</Label>
                  <p className="text-sm text-muted-foreground">Save recent searches for quick access</p>
                </div>
                <Switch 
                  id="store-history" 
                  checked={privacy.storeHistory}
                  onCheckedChange={(checked) => 
                    handleSettingChange("privacy", "storeHistory", checked)
                  }
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
