import { getSettings } from '@/lib/data';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Settings, Sliders, Database, Shield } from 'lucide-react';
import AdminSettingsForm from '@/components/admin/admin-settings-form';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  const settingsMap = settings.reduce((acc, setting) => {
    acc[setting.key] = setting.value;
    return acc;
  }, {} as Record<string, string>);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Container with proper responsive width management */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8 max-w-7xl">
        
        {/* Header Section - Enhanced with icon and better typography */}
        <div className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            
            <div>
              <h1 className="text-2xl lg:text-2xl font-light text-slate-900 tracking-tight">
                Admin Settings
              </h1>
              <p className="text-slate-600 mt-1 font-light">
                Configuration Dashboard
              </p>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl leading-relaxed font-light">
            Manage all application settings, security preferences, and system configurations from this centralized control panel.
          </p>
        </div>

        

        {/* Main Settings Card - Enhanced with modern styling */}
        <Card className="border-0 bg-white/80 shadow-xl backdrop-blur-sm overflow-hidden">
          <CardHeader className="border-b border-slate-100 bg-gradient-to-r from-indigo-50 to-purple-50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
                  <Sliders className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg font-light text-slate-900">
                    Application Configuration
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600 font-light">
                    Modify system settings and application preferences
                  </CardDescription>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs font-light">
                  Admin Privileges Required
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
          

            {/* Settings Form */}
            <AdminSettingsForm initialSettings={settingsMap} />

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span className="font-light">All changes are logged for security purposes</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-light">Changes take effect immediately</span>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200 font-light">
                    Admin
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}