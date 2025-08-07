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
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 shadow-lg">
              <Settings className="h-7 w-7 text-white" />
            </div>
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-slate-900 tracking-tight">
                Admin Settings
              </h1>
              <p className="text-slate-600 mt-1">
                Configuration Dashboard
              </p>
            </div>
          </div>
          <p className="text-slate-500 max-w-2xl leading-relaxed">
            Manage all application settings, security preferences, and system configurations from this centralized control panel.
          </p>
        </div>

        {/* Stats Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Total Settings
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      {settings.length}
                    </p>
                    <Badge variant="secondary" className="text-xs bg-blue-50 text-blue-700 border-blue-200">
                      Configured
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 shadow-lg">
                  <Sliders className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    System Status
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      Active
                    </p>
                    <Badge variant="outline" className="text-xs bg-emerald-50 text-emerald-700 border-emerald-200">
                      Operational
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 shadow-lg">
                  <Database className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Security Level
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      High
                    </p>
                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-200">
                      Protected
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-green-500 to-green-600 shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-600 mb-1">
                    Last Updated
                  </p>
                  <div className="flex items-baseline gap-2">
                    <p className="text-2xl font-semibold text-slate-900">
                      Now
                    </p>
                    <Badge variant="secondary" className="text-xs bg-purple-50 text-purple-700 border-purple-200">
                      Live
                    </Badge>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-purple-500 to-purple-600 shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
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
                  <CardTitle className="text-lg font-semibold text-slate-900">
                    Application Configuration
                  </CardTitle>
                  <CardDescription className="text-sm text-slate-600">
                    Modify system settings and application preferences
                  </CardDescription>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Badge variant="outline" className="bg-slate-50 text-slate-700 border-slate-200 text-xs">
                  Admin Privileges Required
                </Badge>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="p-6">
            <div className="mb-6 p-4 rounded-lg bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-indigo-500 shadow-sm"></div>
                  <span className="text-slate-600 font-medium">Core Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-sm"></div>
                  <span className="text-slate-600 font-medium">Security Settings</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-amber-500 shadow-sm"></div>
                  <span className="text-slate-600 font-medium">Appearance</span>
                </div>
              </div>
            </div>

            {/* Settings Form */}
            <AdminSettingsForm initialSettings={settingsMap} />

            {/* Footer Note */}
            <div className="mt-6 pt-4 border-t border-slate-100">
              <div className="flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-2">
                  <Shield className="h-3 w-3" />
                  <span>All changes are logged for security purposes</span>
                </div>
                <div className="flex items-center gap-4">
                  <span>Changes take effect immediately</span>
                  <Badge variant="secondary" className="bg-indigo-50 text-indigo-700 border-indigo-200">
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