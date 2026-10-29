import { execFileSync } from 'node:child_process';
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const versionFiles = ['package.json', 'package-lock.json'];

function run(command: string, args: string[], capture = false) {
  return execFileSync(command, args, {
    cwd: root,
    encoding: 'utf8',
    stdio: capture ? 'pipe' : 'inherit',
  })?.trim() || '';
}

function prepareRelease() {
  const [tag, requestedVersion, ...extra] = process.argv.slice(2);
  if (!['latest', 'rc'].includes(tag) || extra.length) {
    throw new Error('Usage: release.ts <latest|rc> [patch|minor|major|version]');
  }

  const increments = ['patch', 'minor', 'major'];
  const isIncrement = requestedVersion && increments.includes(requestedVersion);
  const versionPattern = tag === 'rc' ? /^\d+\.\d+\.\d+-rc\.\d+$/ : /^\d+\.\d+\.\d+$/;
  if (requestedVersion && !isIncrement && !versionPattern.test(requestedVersion)) {
    throw new Error(`Expected patch, minor, major, or an explicit ${tag} version.`);
  }

  if (run('git', ['status', '--porcelain'], true)) {
    throw new Error('You have uncommitted changes. Commit or stash them before preparing a release.');
  }

  const versionChange = requestedVersion
    ? (tag === 'rc' && isIncrement ? `pre${requestedVersion}` : requestedVersion)
    : (tag === 'rc' ? 'prerelease' : 'patch');
  const originals = versionFiles.map((file) => readFileSync(new URL(`../${file}`, import.meta.url)));

  // Restore version files if npm fails or the release branch already exists.
  try {
    run('npm', [
      'version', versionChange, '--no-git-tag-version', '--ignore-scripts', '--allow-same-version',
      ...(tag === 'rc' ? ['--preid', 'rc'] : []),
    ]);
    const { version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
    run('git', ['switch', '-c', `release-v${version}`]);
  } catch (error) {
    versionFiles.forEach((file, index) => writeFileSync(new URL(`../${file}`, import.meta.url), originals[index]));
    throw error;
  }

  const { name, version } = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  run('git', ['add', '--', ...versionFiles]);
  run('git', ['commit', '--allow-empty', '-m', `Release ${name} ${tag}: v${version}`]);

  console.log(`Release prepared! Push release-v${version} and open a PR targeting master.`);
  console.log(`Merging the release branch publishes ${name}@${version} to npm's ${tag} tag.`);
}

try {
  prepareRelease();
} catch (error) {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
