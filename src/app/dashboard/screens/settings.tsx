'use client';

export function SettingsScreen() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Account</h2>
          <div className="rounded-lg border bg-card p-6">
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium leading-none">Name</label>
                <p className="mt-1 text-sm text-muted-foreground">John Doe</p>
              </div>
              <div>
                <label className="text-sm font-medium leading-none">Email</label>
                <p className="mt-1 text-sm text-muted-foreground">john@example.com</p>
              </div>
              <div className="pt-2">
                <button className="text-sm font-medium text-primary hover:underline">
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Preferences</h2>
          <div className="rounded-lg border bg-card p-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium leading-none">Theme</label>
                <p className="text-sm text-muted-foreground">
                  Choose how Academic Lens looks to you
                </p>
              </div>
              <select className="rounded-md border border-input bg-background px-3 py-2 text-sm">
                <option>System</option>
                <option>Light</option>
                <option>Dark</option>
              </select>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Danger Zone</h2>
          <div className="rounded-lg border border-destructive/50 bg-destructive/5 p-6">
            <div className="space-y-2">
              <h3 className="font-medium">Delete Account</h3>
              <p className="text-sm text-muted-foreground">
                Permanently delete your account and all of its contents from our servers. This
                action is not reversible.
              </p>
              <button className="mt-2 text-sm font-medium text-destructive hover:underline">
                Delete Account
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
