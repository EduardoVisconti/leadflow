"use client"

import { useTheme } from "next-themes"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { usePipeline } from "@/lib/hooks/usePipeline"
import { Moon, Sun, Monitor } from "lucide-react"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { data: stages } = usePipeline()

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your preferences.</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
            <CardDescription>Customize how LeadFlow looks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Label>Theme</Label>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">
                    <div className="flex items-center gap-2">
                      <Sun className="h-4 w-4" /> Light
                    </div>
                  </SelectItem>
                  <SelectItem value="dark">
                    <div className="flex items-center gap-2">
                      <Moon className="h-4 w-4" /> Dark
                    </div>
                  </SelectItem>
                  <SelectItem value="system">
                    <div className="flex items-center gap-2">
                      <Monitor className="h-4 w-4" /> System
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Pipeline Stages</CardTitle>
            <CardDescription>Your current pipeline configuration.</CardDescription>
          </CardHeader>
          <CardContent>
            {stages?.map((stage) => (
              <div key={stage.id} className="flex items-center gap-3 py-2">
                <div
                  className="h-3 w-3 rounded-full shrink-0"
                  style={{ backgroundColor: stage.color }}
                />
                <span className="text-sm font-medium">{stage.name}</span>
                <span className="text-xs text-muted-foreground ml-auto">
                  Position {stage.position}
                </span>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Keyboard Shortcuts</CardTitle>
            <CardDescription>Quick actions to boost your productivity.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { keys: "Ctrl + K", action: "Open global search" },
                { keys: "F", action: "Focus search (when not typing)" },
                { keys: "N", action: "New deal (on Pipeline page)" },
              ].map(({ keys, action }) => (
                <div key={keys} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">{action}</span>
                  <kbd className="inline-flex items-center gap-1 rounded border bg-muted px-2 py-1 font-mono text-xs">
                    {keys}
                  </kbd>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Separator />

        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-destructive">Danger Zone</p>
            <p className="text-xs text-muted-foreground">This action cannot be undone.</p>
          </div>
          <Button variant="destructive" size="sm" disabled>
            Delete Account
          </Button>
        </div>
      </div>
    </div>
  )
}
