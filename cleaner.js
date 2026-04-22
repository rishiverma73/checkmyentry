const fs = require('fs');
const path = require('path');

function cleanTailwind(content) {
  let newContent = content;
  
  const replacements = [
    [/bg-background text-white font-sans selection:bg-blue-200 dark:selection:bg-purple-500\/30 overflow-x-hidden relative transition-colors duration-300/g, 'bg-background text-foreground font-sans selection:bg-accent-blue/30 overflow-x-hidden relative transition-colors duration-300'],
    [/bg-blue-400\/20 dark:bg-blue-600\/10/g, 'bg-accent-blue/15'],
    [/bg-purple-400\/20 dark:bg-purple-600\/10/g, 'bg-accent-purple/15'],
    [/bg-blue-400\/10 dark:bg-blue-600\/20/g, 'bg-accent-blue/15'],
    [/bg-purple-400\/10 dark:bg-purple-600\/20/g, 'bg-accent-purple/15'],
    [/text-neutral-400 hover:text-white dark:text-neutral-400 dark:hover:text-white/g, 'text-neutral-400 hover:text-white'],
    [/hover:bg-white\/5 dark:hover:bg-white\/5/g, 'hover:bg-white/5'],
    [/shadow-sm dark:shadow-xl/g, 'shadow-[0_2px_20px_rgba(0,0,0,0.3)]'],
    [/shadow-xl dark:shadow-2xl/g, 'shadow-[0_10px_40px_rgba(0,0,0,0.5)]'],
    [/border-b-2 transition-colors border-transparent text-neutral-400 hover:text-neutral-300 dark:text-neutral-400 dark:hover:text-white/g, 'border-b-2 transition-colors border-transparent text-neutral-400 hover:text-white'],
    [/border-blue-600 text-accent-blue dark:border-blue-400 dark:text-accent-blue/g, 'border-accent-blue text-accent-blue'],
    [/border-purple-600 text-accent-purple dark:border-purple-400 dark:text-accent-purple/g, 'border-accent-purple text-accent-purple'],
    [/border-emerald-600 text-emerald-600 dark:border-emerald-400 dark:text-emerald-400/g, 'border-emerald-400 text-emerald-400'],
    [/placeholder-slate-400 dark:placeholder-neutral-500/g, 'placeholder-neutral-500'],
    [/dark:focus:bg-white\/10/g, 'focus:bg-white/10'],
    [/dark:border-white\/30/g, 'border-white/30'],
    [/dark:hover:border-white\/30/g, 'hover:border-white/30'],
    [/text-accent-blue dark:text-blue-300/g, 'text-accent-blue'],
    [/text-neutral-500 dark:text-white\/30/g, 'text-white/30'],
    [/selection:bg-blue-200 dark:selection:bg-purple-500\/30/g, 'selection:bg-accent-blue/30'],
    [/bg-blue-400 dark:bg-blue-600/g, 'bg-accent-blue'],
    [/mix-blend-multiply dark:mix-blend-screen/g, 'mix-blend-screen'],
    [/opacity-10 dark:opacity-30/g, 'opacity-30'],
    [/bg-accent-blue\/20 text-blue-700 dark:bg-accent-blue\/100\/10 dark:text-accent-blue/g, 'bg-accent-blue/10 text-accent-blue'],
    [/border-blue-200 dark:border-blue-500\/20/g, 'border-accent-blue/20'],
    [/shadow-sm dark:shadow-\[0_0_10px_rgba\(59,130,246,0\.2\)\]/g, 'shadow-[0_0_10px_rgba(0,229,255,0.2)]'],
    [/shadow-sm dark:shadow-none/g, ''],
    [/text-white dark:text-neutral-200/g, 'text-white'],
    [/text-indigo-600 dark:text-indigo-400/g, 'text-indigo-400'],
    [/text-neutral-500 dark:text-neutral-500/g, 'text-neutral-500'],
    [/text-white dark:text-neutral-300/g, 'text-white'],
    [/dark:group-hover:text-white/g, 'group-hover:text-white'],
    [/border-purple-200 dark:border-purple-500\/20/g, 'border-accent-purple/20'],
    [/dark:focus:bg-purple-500\/10/g, 'focus:bg-accent-purple/10'],
    [/placeholder-purple-300\/50 dark:placeholder-purple-300\/50/g, 'placeholder-purple-300/50'],
    [/dark:border-neutral-500/g, 'border-white/20'],
    [/dark:bg-\[#0A0A0F\]/g, 'bg-surface'],
    [/dark:border-white\/20/g, 'border-white/20'],
    [/dark:hover:bg-white\/10/g, 'hover:bg-white/10'],
    [/dark:border-transparent/g, 'border-transparent'],
    [/dark:border-white\/10/g, 'border-white/10'],
    [/dark:text-emerald-400/g, 'text-emerald-400'],
    [/bg-purple-50/g, 'bg-accent-purple/5'],
    [/bg-purple-500\/5/g, 'bg-accent-purple/5'],
    [/text-slate-800/g, 'text-white'],
    [/bg-white\/100\/20/g, 'bg-accent-blue/20'],
    [/border-blue-500\/30/g, 'border-accent-blue/30'],
    [/text-blue-300/g, 'text-accent-blue'],
    [/text-slate-300/g, 'text-neutral-300'],
    [/text-slate-400/g, 'text-neutral-400'],
    [/text-slate-500/g, 'text-neutral-400'],
    [/text-slate-600/g, 'text-neutral-400'],
    [/bg-slate-800/g, 'bg-surface'],
    [/bg-slate-900/g, 'bg-background'],
    [/border-slate-700/g, 'border-white/10'],
    [/border-slate-800/g, 'border-white/5'],
    [/text-emerald-600/g, 'text-emerald-400']
  ];

  for (const [pattern, replacement] of replacements) {
    newContent = newContent.replace(pattern, replacement);
  }
  
  newContent = newContent.replace(/dark:[a-zA-Z0-9_/-]+/g, '');
  newContent = newContent.replace(/ className="(.*?)"/g, (match, p1) => {
    return ' className="' + p1.replace(/\s+/g, ' ').trim() + '"';
  });

  return newContent;
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      processDir(filePath);
    } else if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
      if (filePath.includes('page.tsx') || filePath.includes('layout.tsx')) {
        let content = fs.readFileSync(filePath, 'utf8');
        content = cleanTailwind(content);
        fs.writeFileSync(filePath, content);
      }
    }
  }
}

processDir(path.join(process.cwd(), 'app'));
console.log('Finished deep cleaning app directory');
