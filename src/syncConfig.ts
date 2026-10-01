// Where synced progress is kept (FreeChess, Oct 2026): a Supabase project set
// up with docs/sync-setup.sql. The key here is the public ("anon") one, made
// to be inside apps: on its own it can only call sync_get and sync_put with a
// code you already know. Empty means sync is switched off.
export const SYNC_URL = ''
export const SYNC_KEY = ''
