'use client';


export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">Manage your account and application preferences.</p>
      </div>
      <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
        <div className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Account</h3>
            <p className="text-sm text-muted-foreground">
              Update your account information and settings.
            </p>
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-sm font-medium">Name</h4>
              <p className="text-sm text-muted-foreground">Your name</p>
            </div>
            <div>
              <h4 className="text-sm font-medium">Email</h4>
              <p className="text-sm text-muted-foreground">your.email@example.com</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
