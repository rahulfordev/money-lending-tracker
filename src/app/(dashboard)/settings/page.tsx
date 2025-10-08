"use client";

import { useState } from "react";
import { Card } from "../../../components/ui/Card";
import { Button } from "../../../components/ui/Button";
import { Input } from "../../../components/ui/Input";
import {
  User,
  Bell,
  Shield,
  Database,
  Palette,
  Download,
  Upload,
  Trash2,
  Save,
  Key,
  Eye,
  EyeOff,
} from "lucide-react";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");
  const [loading, setLoading] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Profile Settings
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+91 98765 43210",
    company: "My Lending Business",
  });

  // Password Change
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");

  // Notification Settings
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    smsNotifications: false,
    paymentReminders: true,
    overdueAlerts: true,
    weeklyReports: false,
    monthlyReports: true,
  });

  // Security Settings
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    loginAlerts: true,
  });

  // Appearance Settings
  const [appearance, setAppearance] = useState({
    theme: "light",
    language: "en",
    currency: "INR",
    dateFormat: "DD/MM/YYYY",
  });

  const handleSaveSettings = async (section: string) => {
    setLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setLoading(false);
    // In real app, you would save to your backend
  };

  const handleChangePassword = async () => {
    setPasswordError("");

    // Validation
    if (
      !password.oldPassword ||
      !password.newPassword ||
      !password.confirmPassword
    ) {
      setPasswordError("All fields are required");
      return;
    }

    if (password.newPassword.length < 6) {
      setPasswordError("New password must be at least 6 characters long");
      return;
    }

    if (password.newPassword !== password.confirmPassword) {
      setPasswordError("New passwords do not match");
      return;
    }

    if (password.oldPassword === password.newPassword) {
      setPasswordError("New password must be different from old password");
      return;
    }

    setPasswordLoading(true);

    try {
      // Simulate API call to change password
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // In real app, you would call your API like:
      // await apiClient.changePassword({
      //   oldPassword: password.oldPassword,
      //   newPassword: password.newPassword
      // });

      // Reset form on success
      setPassword({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      // Show success message (you can add a toast notification here)
      alert("Password changed successfully!");
    } catch (error) {
      setPasswordError(
        error instanceof Error ? error.message : "Failed to change password"
      );
    } finally {
      setPasswordLoading(false);
    }
  };

  const tabs = [
    { id: "profile", name: "Profile", icon: User },
    { id: "security", name: "Security", icon: Shield },
    { id: "notifications", name: "Notifications", icon: Bell },
    { id: "appearance", name: "Appearance", icon: Palette },
    { id: "data", name: "Data Management", icon: Database },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-600 mt-2">
            Manage your account settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar Navigation */}
        <Card className="lg:col-span-1 p-4">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`
                    w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors
                    ${
                      activeTab === tab.id
                        ? "bg-primary-50 text-primary-700 border-r-2 border-primary"
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900"
                    }
                  `}
                >
                  <Icon className="h-4 w-4 mr-3" />
                  {tab.name}
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Main Content */}
        <div className="lg:col-span-3 space-y-6">
          {/* Profile Settings */}
          {activeTab === "profile" && (
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <User className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Profile Settings
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Full Name"
                  value={profile.name}
                  onChange={(e) =>
                    setProfile({ ...profile, name: e.target.value })
                  }
                  placeholder="Enter your full name"
                />

                <Input
                  label="Email Address"
                  type="email"
                  value={profile.email}
                  onChange={(e) =>
                    setProfile({ ...profile, email: e.target.value })
                  }
                  placeholder="Enter your email"
                />

                <Input
                  label="Phone Number"
                  value={profile.phone}
                  onChange={(e) =>
                    setProfile({ ...profile, phone: e.target.value })
                  }
                  placeholder="Enter your phone number"
                />

                <Input
                  label="Company Name"
                  value={profile.company}
                  onChange={(e) =>
                    setProfile({ ...profile, company: e.target.value })
                  }
                  placeholder="Enter your company name"
                />
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  loading={loading}
                  onClick={() => handleSaveSettings("profile")}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            </Card>
          )}

          {/* Security Settings */}
          {activeTab === "security" && (
            <div className="space-y-6">
              {/* Password Change Section */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <Key className="h-6 w-6 text-gray-700 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Change Password
                  </h2>
                </div>

                {passwordError && (
                  <div className="p-3 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 mb-4">
                    {passwordError}
                  </div>
                )}

                <div className="space-y-4">
                  <div className="relative">
                    <Input
                      label="Current Password"
                      type={showOldPassword ? "text" : "password"}
                      value={password.oldPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          oldPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your current password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowOldPassword(!showOldPassword)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showOldPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="New Password"
                      type={showNewPassword ? "text" : "password"}
                      value={password.newPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          newPassword: e.target.value,
                        })
                      }
                      placeholder="Enter your new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showNewPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>

                  <div className="relative">
                    <Input
                      label="Confirm New Password"
                      type={showConfirmPassword ? "text" : "password"}
                      value={password.confirmPassword}
                      onChange={(e) =>
                        setPassword({
                          ...password,
                          confirmPassword: e.target.value,
                        })
                      }
                      placeholder="Confirm your new password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-8 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="bg-primary-50 p-4 rounded-lg mt-4">
                  <h4 className="text-sm font-medium text-primary-800 mb-2">
                    Password Requirements
                  </h4>
                  <ul className="text-xs text-primary-700 space-y-1">
                    <li>• At least 6 characters long</li>
                    <li>• Different from your current password</li>
                    <li>
                      • Use a combination of letters, numbers, and symbols
                    </li>
                  </ul>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    loading={passwordLoading}
                    onClick={handleChangePassword}
                    className="flex items-center"
                  >
                    <Key className="h-4 w-4 mr-2" />
                    Change Password
                  </Button>
                </div>
              </Card>

              {/* Security Preferences */}
              <Card className="p-6">
                <div className="flex items-center mb-6">
                  <Shield className="h-6 w-6 text-gray-700 mr-2" />
                  <h2 className="text-xl font-semibold text-gray-900">
                    Security Preferences
                  </h2>
                </div>

                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Two-Factor Authentication
                      </h3>
                      <p className="text-sm text-gray-600">
                        Add an extra layer of security to your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.twoFactorAuth}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            twoFactorAuth: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>

                  <div className="p-4 border border-gray-200 rounded-lg">
                    <h3 className="font-medium text-gray-900 mb-2">
                      Session Timeout
                    </h3>
                    <p className="text-sm text-gray-600 mb-4">
                      Automatically log out after period of inactivity
                    </p>
                    <select
                      value={security.sessionTimeout}
                      onChange={(e) =>
                        setSecurity({
                          ...security,
                          sessionTimeout: parseInt(e.target.value),
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    >
                      <option value={15}>15 minutes</option>
                      <option value={30}>30 minutes</option>
                      <option value={60}>1 hour</option>
                      <option value={120}>2 hours</option>
                      <option value={0}>Never</option>
                    </select>
                  </div>

                  <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        Login Alerts
                      </h3>
                      <p className="text-sm text-gray-600">
                        Get notified when someone logs into your account
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={security.loginAlerts}
                        onChange={(e) =>
                          setSecurity({
                            ...security,
                            loginAlerts: e.target.checked,
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <Button
                    loading={loading}
                    onClick={() => handleSaveSettings("security")}
                    className="flex items-center"
                  >
                    <Save className="h-4 w-4 mr-2" />
                    Save Security Settings
                  </Button>
                </div>
              </Card>
            </div>
          )}

          {/* Other tabs remain the same as before */}
          {activeTab === "notifications" && (
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Bell className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Notification Preferences
                </h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                  <div>
                    <h3 className="font-medium text-gray-900">
                      Email Notifications
                    </h3>
                    <p className="text-sm text-gray-600">
                      Receive important updates via email
                    </p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={notifications.emailNotifications}
                      onChange={(e) =>
                        setNotifications({
                          ...notifications,
                          emailNotifications: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>

                {/* Other notification settings... */}
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  loading={loading}
                  onClick={() => handleSaveSettings("notifications")}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* Appearance Settings */}
          {activeTab === "appearance" && (
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Palette className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Appearance & Regional
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Theme
                  </label>
                  <select
                    value={appearance.theme}
                    onChange={(e) =>
                      setAppearance({ ...appearance, theme: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="light">Light</option>
                    <option value="dark">Dark</option>
                    <option value="auto">Auto (System)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Language
                  </label>
                  <select
                    value={appearance.language}
                    onChange={(e) =>
                      setAppearance({ ...appearance, language: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="en">English</option>
                    <option value="hi">Hindi</option>
                    <option value="bn">Bengali</option>
                    <option value="ta">Tamil</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Currency
                  </label>
                  <select
                    value={appearance.currency}
                    onChange={(e) =>
                      setAppearance({ ...appearance, currency: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Date Format
                  </label>
                  <select
                    value={appearance.dateFormat}
                    onChange={(e) =>
                      setAppearance({
                        ...appearance,
                        dateFormat: e.target.value,
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    <option value="DD MMM YYYY">DD MMM YYYY</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end mt-6">
                <Button
                  loading={loading}
                  onClick={() => handleSaveSettings("appearance")}
                  className="flex items-center"
                >
                  <Save className="h-4 w-4 mr-2" />
                  Save Preferences
                </Button>
              </div>
            </Card>
          )}

          {/* Data Management */}
          {activeTab === "data" && (
            <Card className="p-6">
              <div className="flex items-center mb-6">
                <Database className="h-6 w-6 text-gray-700 mr-2" />
                <h2 className="text-xl font-semibold text-gray-900">
                  Data Management
                </h2>
              </div>

              <div className="space-y-6">
                <div className="p-6 border border-gray-200 rounded-lg bg-primary-50">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Export Data
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Download all your data in CSV format for backup or analysis
                  </p>
                  <div className="flex gap-3">
                    <Button variant="secondary" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export Loans
                    </Button>
                    <Button variant="secondary" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export Repayments
                    </Button>
                    <Button variant="secondary" className="flex items-center">
                      <Download className="h-4 w-4 mr-2" />
                      Export All Data
                    </Button>
                  </div>
                </div>

                <div className="p-6 border border-gray-200 rounded-lg bg-green-50">
                  <h3 className="font-medium text-gray-900 mb-2">
                    Import Data
                  </h3>
                  <p className="text-sm text-gray-600 mb-4">
                    Import data from CSV files to quickly set up your account
                  </p>
                  <Button variant="secondary" className="flex items-center">
                    <Upload className="h-4 w-4 mr-2" />
                    Import Data
                  </Button>
                </div>

                <div className="p-6 border border-red-200 rounded-lg bg-red-50">
                  <h3 className="font-medium text-red-900 mb-2">Danger Zone</h3>
                  <p className="text-sm text-red-700 mb-4">
                    Once you delete your account, there is no going back. Please
                    be certain.
                  </p>
                  <div className="flex gap-3">
                    <Button variant="danger" className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete All Data
                    </Button>
                    <Button variant="danger" className="flex items-center">
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete Account
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
