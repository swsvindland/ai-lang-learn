import { Platform } from 'react-native';
import Purchases, { type CustomerInfo, type PurchasesPackage } from 'react-native-purchases';

import type { CloudEndpoint } from './cloud';

/**
 * Hablo Plus: a monthly subscription (sold through the App Store / Play Store
 * via RevenueCat) that unlocks a hosted tutor model. Requests go to our proxy
 * (`server/ai-proxy`), which checks the subscription with RevenueCat before
 * forwarding to OpenRouter with a server-side key, so no API key ships in the app.
 *
 * Everything here is inert until the build is configured with:
 *   EXPO_PUBLIC_REVENUECAT_IOS_KEY / EXPO_PUBLIC_REVENUECAT_ANDROID_KEY  (public SDK keys)
 *   EXPO_PUBLIC_AI_PROXY_URL                                             (the deployed proxy)
 */

export const PLUS_ENTITLEMENT = process.env.EXPO_PUBLIC_PLUS_ENTITLEMENT || 'plus';

const PROXY_URL = process.env.EXPO_PUBLIC_AI_PROXY_URL;
const SDK_KEY =
  Platform.OS === 'ios'
    ? process.env.EXPO_PUBLIC_REVENUECAT_IOS_KEY
    : Platform.OS === 'android'
      ? process.env.EXPO_PUBLIC_REVENUECAT_ANDROID_KEY
      : undefined;

let initialized: Promise<void> | null = null;
let active = false;
const listeners = new Set<() => void>();

export function plusAvailableInBuild() {
  return !!PROXY_URL && !!SDK_KEY;
}

function update(info: CustomerInfo) {
  const next = !!info.entitlements.active[PLUS_ENTITLEMENT];
  if (next === active) return;
  active = next;
  listeners.forEach((l) => l());
}

/** Configures RevenueCat once and loads the current entitlement. Safe to call repeatedly. */
export function initPlus() {
  if (!plusAvailableInBuild()) return Promise.resolve();
  initialized ??= (async () => {
    try {
      Purchases.configure({ apiKey: SDK_KEY! });
      Purchases.addCustomerInfoUpdateListener(update);
      update(await Purchases.getCustomerInfo());
    } catch {
      // Offline or store unavailable: stay inactive; the next init retries.
      initialized = null;
    }
  })();
  return initialized;
}

export function isPlusActive() {
  return active;
}

export function subscribePlus(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export async function plusPackages(): Promise<PurchasesPackage[]> {
  await initPlus();
  const offerings = await Purchases.getOfferings();
  return offerings.current?.availablePackages ?? [];
}

/** Returns true when the purchase unlocked Plus, false if the learner cancelled. */
export async function buyPlus(pkg: PurchasesPackage): Promise<boolean> {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    update(customerInfo);
    return active;
  } catch (e) {
    if ((e as { userCancelled?: boolean | null }).userCancelled) return false;
    throw e;
  }
}

export async function restorePlus(): Promise<boolean> {
  await initPlus();
  update(await Purchases.restorePurchases());
  return active;
}

/**
 * The proxy identifies subscribers by their RevenueCat app user id (a random
 * anonymous id unless the app logs users in) and verifies it server-side.
 */
export async function plusEndpoint(): Promise<CloudEndpoint> {
  await initPlus();
  const userId = await Purchases.getAppUserID();
  return {
    url: `${PROXY_URL!.replace(/\/$/, '')}/v1/chat/completions`,
    headers: { Authorization: `Bearer ${userId}` },
  };
}
