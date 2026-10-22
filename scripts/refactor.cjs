const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

const moves = [
  { from: 'src/components/Navbar.tsx', to: 'src/layouts/Navbar.tsx' },
  { from: 'src/components/BottomNav.tsx', to: 'src/layouts/BottomNav.tsx' },
  { from: 'src/components/Footer.tsx', to: 'src/layouts/Footer.tsx' },
  { from: 'src/components/SharedUI.tsx', to: 'src/components/ui/SharedUI.tsx' },
  { from: 'src/components/TierBadge.tsx', to: 'src/components/ui/TierBadge.tsx' },
  { from: 'src/components/MapSelector.tsx', to: 'src/components/features/MapSelector.tsx' },
  { from: 'src/components/SiteAgentWidget.tsx', to: 'src/components/features/SiteAgentWidget.tsx' },
  { from: 'src/components/ProtectedRoute.tsx', to: 'src/components/auth/ProtectedRoute.tsx' },
  { from: 'src/firebase.ts', to: 'src/services/firebase.ts' },
  { from: 'src/utils/gemini.ts', to: 'src/services/gemini.ts' },
];

const updateImports = (content, filePath) => {
  let newContent = content;
  
  const replacements = [
    { regex: /['"](?:\.\.\/|\.\/)+components\/Navbar['"]/g, newPath: 'layouts/Navbar' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/BottomNav['"]/g, newPath: 'layouts/BottomNav' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/Footer['"]/g, newPath: 'layouts/Footer' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/SharedUI['"]/g, newPath: 'components/ui/SharedUI' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/TierBadge['"]/g, newPath: 'components/ui/TierBadge' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/MapSelector['"]/g, newPath: 'components/features/MapSelector' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/SiteAgentWidget['"]/g, newPath: 'components/features/SiteAgentWidget' },
    { regex: /['"](?:\.\.\/|\.\/)+components\/ProtectedRoute['"]/g, newPath: 'components/auth/ProtectedRoute' },
    { regex: /['"](?:\.\.\/|\.\/)+firebase['"]/g, newPath: 'services/firebase' },
    { regex: /['"](?:\.\.\/|\.\/)+utils\/gemini['"]/g, newPath: 'services/gemini' },
  ];

  replacements.forEach(({ regex, newPath }) => {
    newContent = newContent.replace(regex, (match) => {
       const targetAbsPath = path.resolve(__dirname, 'src', newPath);
       let rel = path.relative(path.dirname(filePath), targetAbsPath).replace(/\\/g, '/');
       if (!rel.startsWith('.')) rel = './' + rel;
       return `'${rel}'`;
    });
  });
  
  if (filePath.replace(/\\/g, '/').endsWith('services/gemini.ts')) {
     newContent = newContent.replace(/['"]\.\/location['"]/g, "'../utils/location'");
  }
  
  return newContent;
};

// Create dirs
['src/layouts', 'src/services', 'src/components/ui', 'src/components/features', 'src/components/auth', 'src/types'].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

// Move files
moves.forEach(({ from, to }) => {
  if (fs.existsSync(from)) {
    fs.renameSync(from, to);
    console.log(`Moved ${from} to ${to}`);
  }
});

// Update imports in all files
function walk(dir) {
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const newContent = updateImports(content, fullPath);
      if (content !== newContent) {
        fs.writeFileSync(fullPath, newContent, 'utf8');
        console.log(`Updated imports in ${fullPath}`);
      }
    }
  });
}

walk(srcDir);
