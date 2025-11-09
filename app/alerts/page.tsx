"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Header } from "@/components/header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Bell,
  BellOff,
  TrendingUp,
  TrendingDown,
  Plus,
  X,
  Edit,
  Trash2,
  CheckCircle,
  AlertCircle,
} from "lucide-react";
import { useLanguage } from "@/lib/hooks/use-language";
import { getTranslation } from "@/lib/i18n";

interface Alert {
  id: string;
  fundName: string;
  type: "NAV_ABOVE" | "NAV_BELOW" | "RETURN_TARGET" | "NEWS";
  threshold?: number;
  isActive: boolean;
  lastTriggered?: string;
  createdAt: string;
}

export default function AlertsPage() {
  const { language, mounted } = useLanguage();
  const [showAddForm, setShowAddForm] = useState(false);
  const [alerts, setAlerts] = useState<Alert[]>([
    {
      id: "1",
      fundName: "HDFC Top 100 Fund",
      type: "NAV_ABOVE",
      threshold: 250,
      isActive: true,
      createdAt: "2025-11-01",
    },
    {
      id: "2",
      fundName: "SBI Small Cap Fund",
      type: "NAV_BELOW",
      threshold: 245,
      isActive: true,
      lastTriggered: "2025-11-03",
      createdAt: "2025-10-28",
    },
    {
      id: "3",
      fundName: "ICICI Prudential Value Discovery Fund",
      type: "RETURN_TARGET",
      threshold: 15,
      isActive: false,
      createdAt: "2025-10-25",
    },
  ]);

  const [newAlert, setNewAlert] = useState({
    fundName: "",
    type: "NAV_ABOVE" as Alert["type"],
    threshold: "",
  });

  const t = (key: string) => getTranslation(language, key);

  if (!mounted) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const handleToggleAlert = (id: string) => {
    setAlerts((prev) =>
      prev.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  const handleDeleteAlert = (id: string) => {
    setAlerts((prev) => prev.filter((alert) => alert.id !== id));
  };

  const handleAddAlert = () => {
    if (newAlert.fundName && newAlert.threshold) {
      const alert: Alert = {
        id: Date.now().toString(),
        fundName: newAlert.fundName,
        type: newAlert.type,
        threshold: parseFloat(newAlert.threshold),
        isActive: true,
        createdAt: new Date().toISOString().split("T")[0],
      };
      setAlerts((prev) => [alert, ...prev]);
      setNewAlert({ fundName: "", type: "NAV_ABOVE", threshold: "" });
      setShowAddForm(false);
    }
  };

  const getAlertIcon = (type: Alert["type"]) => {
    switch (type) {
      case "NAV_ABOVE":
        return <TrendingUp className="w-5 h-5 text-success" />;
      case "NAV_BELOW":
        return <TrendingDown className="w-5 h-5 text-danger" />;
      case "RETURN_TARGET":
        return <CheckCircle className="w-5 h-5 text-primary" />;
      case "NEWS":
        return <Bell className="w-5 h-5 text-accent" />;
    }
  };

  const getAlertDescription = (alert: Alert) => {
    switch (alert.type) {
      case "NAV_ABOVE":
        return `Alert when NAV goes above ₹${alert.threshold}`;
      case "NAV_BELOW":
        return `Alert when NAV goes below ₹${alert.threshold}`;
      case "RETURN_TARGET":
        return `Alert when returns reach ${alert.threshold}%`;
      case "NEWS":
        return "Alert on important fund news";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Page Header */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-foreground flex items-center gap-3">
              <Bell className="w-8 h-8" />
              Price Alerts
            </h1>
            <p className="mt-2 text-muted">
              Get notified when funds hit your target price
            </p>
          </div>
          <Button onClick={() => setShowAddForm(!showAddForm)} size="lg">
            <Plus className="w-4 h-4 mr-2" />
            New Alert
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Total Alerts</p>
                  <p className="text-3xl font-bold text-foreground">
                    {alerts.length}
                  </p>
                </div>
                <Bell className="w-8 h-8 text-primary" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Active Alerts</p>
                  <p className="text-3xl font-bold text-success">
                    {alerts.filter((a) => a.isActive).length}
                  </p>
                </div>
                <CheckCircle className="w-8 h-8 text-success" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted">Triggered Today</p>
                  <p className="text-3xl font-bold text-accent">2</p>
                </div>
                <AlertCircle className="w-8 h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Add Alert Form */}
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Create New Alert</CardTitle>
                    <CardDescription>
                      Set up a price alert for any fund
                    </CardDescription>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowAddForm(false)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="fundName">Fund Name</Label>
                    <Input
                      id="fundName"
                      placeholder="Enter fund name"
                      value={newAlert.fundName}
                      onChange={(e) =>
                        setNewAlert({ ...newAlert, fundName: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="alertType">Alert Type</Label>
                    <Select
                      value={newAlert.type}
                      onValueChange={(value) =>
                        setNewAlert({
                          ...newAlert,
                          type: value as Alert["type"],
                        })
                      }
                    >
                      <SelectTrigger id="alertType">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="NAV_ABOVE">
                          NAV Goes Above
                        </SelectItem>
                        <SelectItem value="NAV_BELOW">
                          NAV Goes Below
                        </SelectItem>
                        <SelectItem value="RETURN_TARGET">
                          Return Target
                        </SelectItem>
                        <SelectItem value="NEWS">Fund News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="threshold">
                    {newAlert.type.includes("NAV")
                      ? "NAV Threshold (₹)"
                      : "Return Target (%)"}
                  </Label>
                  <Input
                    id="threshold"
                    type="number"
                    placeholder="Enter value"
                    value={newAlert.threshold}
                    onChange={(e) =>
                      setNewAlert({ ...newAlert, threshold: e.target.value })
                    }
                  />
                </div>

                <div className="flex gap-3 pt-4">
                  <Button onClick={handleAddAlert} className="flex-1">
                    Create Alert
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowAddForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Alerts List */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Your Alerts</h2>

          {alerts.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <BellOff className="w-12 h-12 text-muted mx-auto mb-4" />
                <p className="text-lg text-muted mb-2">No alerts set up yet</p>
                <p className="text-sm text-muted mb-4">
                  Create your first alert to get notified about price changes
                </p>
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Alert
                </Button>
              </CardContent>
            </Card>
          ) : (
            alerts.map((alert, index) => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className={alert.isActive ? "" : "opacity-60"}>
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="mt-1">{getAlertIcon(alert.type)}</div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-1">
                            {alert.fundName}
                          </h3>
                          <p className="text-sm text-muted mb-2">
                            {getAlertDescription(alert)}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-muted">
                            <span>
                              Created:{" "}
                              {new Date(alert.createdAt).toLocaleDateString()}
                            </span>
                            {alert.lastTriggered && (
                              <span className="text-accent">
                                Last triggered:{" "}
                                {new Date(
                                  alert.lastTriggered
                                ).toLocaleDateString()}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-2">
                          <Label
                            htmlFor={`switch-${alert.id}`}
                            className="text-xs text-muted cursor-pointer"
                          >
                            {alert.isActive ? "Active" : "Paused"}
                          </Label>
                          <Switch
                            id={`switch-${alert.id}`}
                            checked={alert.isActive}
                            onCheckedChange={() => handleToggleAlert(alert.id)}
                          />
                        </div>

                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteAlert(alert.id)}
                        >
                          <Trash2 className="w-4 h-4 text-danger" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>

        {/* Notification Settings */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Notification Preferences</CardTitle>
            <CardDescription>
              Choose how you want to receive alerts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Email Notifications
                </p>
                <p className="text-sm text-muted">Receive alerts via email</p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">SMS Notifications</p>
                <p className="text-sm text-muted">Receive alerts via SMS</p>
              </div>
              <Switch />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">
                  Push Notifications
                </p>
                <p className="text-sm text-muted">
                  Receive browser push notifications
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">Daily Summary</p>
                <p className="text-sm text-muted">
                  Get a daily digest of all alerts
                </p>
              </div>
              <Switch defaultChecked />
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
