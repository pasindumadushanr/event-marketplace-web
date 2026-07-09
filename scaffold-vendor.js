const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'src', 'app', 'vendor');
const dirs = [
  'business',
  'gallery',
  'packages',
  'bookings',
  'calendar',
  'reviews',
  'revenue',
  'notifications',
  'documents',
  'settings',
  'support',
  'onboarding'
];

if (!fs.existsSync(baseDir)) {
  fs.mkdirSync(baseDir, { recursive: true });
}

// Create a basic dashboard home page
fs.writeFileSync(path.join(baseDir, 'page.tsx'), `export default function VendorDashboardPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Vendor Dashboard</h2>
      <p className="text-muted-foreground">Overview of your business metrics.</p>
    </div>
  );
}
`);

dirs.forEach(dir => {
  const dirPath = path.join(baseDir, dir);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
  
  const formattedName = dir.charAt(0).toUpperCase() + dir.slice(1);
  const content = `export default function Vendor${formattedName}Page() {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">${formattedName}</h2>
      <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
        <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
          <h3 className="mt-4 text-lg font-semibold">Coming Soon 🚀</h3>
          <p className="mb-4 mt-2 text-sm text-muted-foreground">
            The ${formattedName} module is currently under development.
          </p>
        </div>
      </div>
    </div>
  );
}
`;
  
  const filePath = path.join(dirPath, 'page.tsx');
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
  }
});

console.log('Vendor scaffolding complete!');
