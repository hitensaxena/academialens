'use client';

import { signOut } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { UserAvatar } from '@/components/user-avatar';

interface UserNavProps {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export function UserNav({ user }: UserNavProps) {
  if (!user) {
    return (
      <Button asChild variant="outline">
        <a href="/api/auth/signin">Sign in</a>
      </Button>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <UserAvatar user={user} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || 'User'}</p>
            {user.email && (
              <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
            )}
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <a href="/profile">Profile</a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href="/settings">Settings</a>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="text-destructive focus:text-destructive"
          onSelect={() => signOut({ callbackUrl: '/' })}
        >
          Sign out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
