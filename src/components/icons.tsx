import {
  LucideProps,
  Menu,
  X,
  Home,
  FileText,
  Upload,
  Settings,
  LogOut,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';

export const Icons = {
  menu: Menu,
  close: X,
  home: Home,
  document: FileText,
  upload: Upload,
  settings: Settings,
  logout: LogOut,
  chevronDown: ChevronDown,
  chevronRight: ChevronRight,
  logo: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2L2 7l10 5 10-5-10-5z" />
      <path d="M2 17l10 5 10-5" />
      <path d="M2 12l10 5 10-5" />
    </svg>
  ),
};
