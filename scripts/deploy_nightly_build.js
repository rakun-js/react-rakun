/*
 *   Copyright (c) 2021 Eric Fillipe
 *   All rights reserved.

 *   Permission is hereby granted, free of charge, to any person obtaining a copy
 *   of this software and associated documentation files (the "Software"), to deal
 *   in the Software without restriction, including without limitation the rights
 *   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 *   copies of the Software, and to permit persons to whom the Software is
 *   furnished to do so, subject to the following conditions:
 
 *   The above copyright notice and this permission notice shall be included in all
 *   copies or substantial portions of the Software.
 
 *   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 *   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 *   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 *   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 *   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 *   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 *   SOFTWARE.
 */

const { files, version, repository } = require('../package.json');
const { execSync } = require('child_process');

const DEST_FOLDER = 'nightly-build-files/';
const DEST_BRANCH = 'nightly';

const COMMIT_MSG = `Publishing a nightly build as ${version}`;

const SOURCES = ['CHANGELOG.md', 'LICENSE', 'README.md', 'package.json'].concat(
  files,
);

const cwd = process.cwd();

console.log('Starting deploy to Git...');
console.log(`Remove "${DEST_FOLDER}" folder...`);
execSync(`rm -rf ${DEST_FOLDER}`, { cwd });

console.log(`Cloning the repository to "${DEST_FOLDER}" folder...`);
execSync(`git clone -b ${DEST_BRANCH} ${repository} ${DEST_FOLDER} --depth 1`, {
  cwd,
});

console.log('Copying sources...');
execSync(`cp -r ${SOURCES.join(' ')} ${DEST_FOLDER}`, { cwd });

console.log('Committing and pushing...');
execSync(
  [
    `cd ${DEST_FOLDER}`,
    'git config --local include.path "$PWD/../.git/config"', // include orginal git config
    'git add .',
    `git commit --allow-empty -m "${COMMIT_MSG}"`,
    `git push --tags ${repository} ${DEST_BRANCH}`,
  ].join('&&'),
  { cwd },
);

console.log('Deploying to git is finished.');
