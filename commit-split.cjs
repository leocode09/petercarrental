/**
 * Splits all changes into 40 commits, backdated to 2026-03-08.
 * Uses git add -p to stage one hunk at a time.
 */
const { execSync, spawnSync } = require('child_process');
const path = require('path');

const REPO = __dirname;
const COMMIT_DATE = '2026-03-08 09:00:00';
const NUM_COMMITS = 40;

function run(cmd, opts = {}) {
  return execSync(cmd, { cwd: REPO, encoding: 'utf8', ...opts });
}

const env = {
  ...process.env,
  GIT_AUTHOR_DATE: COMMIT_DATE,
  GIT_COMMITTER_DATE: COMMIT_DATE,
};

// Ensure all changes are unstaged
run('git reset HEAD');

// Add all changes (including untracked) - but we'll use add -p for granularity
// First, add any new files that aren't in the diff
run('git add src/pages/admin/AdminSiteSettings.tsx');
run('git add dist/assets/index-BVuFf_Sp.css dist/assets/index-DS0x43F5.js');
run('git add -u'); // stage all modifications and deletions

// Now reset and do 40 commits via add -p
run('git reset HEAD');

let committed = 0;
for (let i = 0; i < NUM_COMMITS; i++) {
  // Stage one hunk with 'y' then 'q' to quit after first
  spawnSync('git', ['add', '-p'], {
    cwd: REPO,
    input: 'y\nq\n',
    encoding: 'utf8',
  });

  // Check if anything was staged
  const diffCached = run('git diff --cached --stat');
  if (diffCached.trim()) {
    const shortStat = diffCached.split('\n').slice(-1)[0] || '';
    const msg = `chore: incremental update (${i + 1}/${NUM_COMMITS})`;
    try {
      run(`git commit -m "${msg}"`, { env });
      committed++;
    } catch (e) {
      console.error('Commit failed:', e.message);
    }
  } else {
    // No more hunks - break or add remaining as whole
    break;
  }
}

// If we have remaining changes and fewer than 40 commits, add and commit the rest
const remaining = run('git status --porcelain');
if (remaining.trim() && committed < NUM_COMMITS) {
  run('git add -A');
  const stillStaged = run('git diff --cached --stat');
  if (stillStaged.trim()) {
    run('git commit -m "chore: remaining updates"', { env });
    committed++;
  }
}

console.log(`Created ${committed} commits, all dated ${COMMIT_DATE}`);
