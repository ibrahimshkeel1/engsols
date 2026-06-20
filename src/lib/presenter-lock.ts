import type { Room } from "livekit-client";
import { publishLiveSyncPacket } from "@/lib/livekit-sync";

let activePresenterId: string | null = null;
const listeners = new Set<() => void>();

function notify(): void {
  listeners.forEach((listener) => listener());
}

export function getActivePresenterId(): string | null {
  return activePresenterId;
}

export function subscribePresenterLock(listener: () => void): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function applyPresenterLockFromRemote(identity: string | null): void {
  activePresenterId = identity;
  notify();
}

export function handleLockClaimPacket(identity: string): void {
  if (!activePresenterId || activePresenterId === identity) {
    activePresenterId = identity;
    notify();
  }
}

export function handleLockReleasePacket(identity: string): void {
  if (activePresenterId === identity) {
    activePresenterId = null;
    notify();
  }
}

export function canLocalEdit(room: Room | undefined): boolean {
  if (!room || room.remoteParticipants.size === 0) return true;
  if (!activePresenterId) return true;
  return activePresenterId === room.localParticipant.identity;
}

export async function claimPresenterLock(room: Room): Promise<boolean> {
  const localId = room.localParticipant.identity;
  if (activePresenterId && activePresenterId !== localId) return false;

  activePresenterId = localId;
  notify();
  await publishLiveSyncPacket(room, { type: "LOCK_CLAIM", identity: localId }, true);
  return true;
}

export async function releasePresenterLock(room: Room): Promise<void> {
  const localId = room.localParticipant.identity;
  if (activePresenterId !== localId) return;

  activePresenterId = null;
  notify();
  await publishLiveSyncPacket(room, { type: "LOCK_RELEASE", identity: localId }, true);
}

export function releasePresenterIfDisconnected(identity: string): void {
  if (activePresenterId === identity) {
    activePresenterId = null;
    notify();
  }
}

/** @internal test helper */
export function __resetPresenterLockForTests(): void {
  activePresenterId = null;
  listeners.clear();
}
