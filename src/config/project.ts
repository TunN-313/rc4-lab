/**
 * RC4 Lab - Shared Project & Repository Configuration
 * SPDX-License-Identifier: Apache-2.0
 */

export const REPO_OWNER = 'TunN-313';
export const REPO_NAME = 'rc4-lab';
export const REPO_FULL_NAME = `${REPO_OWNER}/${REPO_NAME}`;
export const REPO_URL = `https://github.com/${REPO_FULL_NAME}`;
export const CLONE_URL = `${REPO_URL}.git`;
export const CLONE_CMD = `git clone ${CLONE_URL}`;

// Set to false when the repository is private; true when public
export const REPO_IS_PUBLIC = false;
