import { UserAccount, Order, AccessGrant } from '../types';
import { createAccessGrant } from './access';

export interface StoredUserRecord extends UserAccount {
  passwordHash: string;
  createdAt: string;
}

const STORAGE_KEY_USERS = 'fp_user_accounts_db';
const STORAGE_KEY_SESSION = 'fp_current_session';

// Pre-seeded demo account so testing is immediate and seamless
const DEFAULT_DEMO_ACCOUNT: StoredUserRecord = {
  name: 'Emily Davis',
  email: 'emily.davis@gmail.com',
  passwordHash: 'family123',
  isLoggedIn: false,
  purchasedProductIds: [],
  purchasedAccess: {},
  orderHistory: [],
  createdAt: new Date().toISOString(),
};

/**
 * Retrieve all registered users from localStorage
 */
export function getAllRegisteredUsers(): StoredUserRecord[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_USERS);
    if (!raw) {
      const initial = [DEFAULT_DEMO_ACCOUNT];
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(initial));
      return initial;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [DEFAULT_DEMO_ACCOUNT];
  } catch {
    return [DEFAULT_DEMO_ACCOUNT];
  }
}

/**
 * Save users list back to localStorage
 */
function saveRegisteredUsers(users: StoredUserRecord[]): void {
  try {
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  } catch (err) {
    console.error('Failed to save users database', err);
  }
}

/**
 * Get active user session or default guest session
 */
export function getActiveSession(): UserAccount {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SESSION);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && typeof parsed === 'object') {
        return parsed as UserAccount;
      }
    }
  } catch {
    // fallback
  }

  return {
    name: '',
    email: '',
    isLoggedIn: false,
    purchasedProductIds: [],
    purchasedAccess: {},
    orderHistory: []
  };
}

/**
 * Save active user session
 */
export function saveActiveSession(account: UserAccount): void {
  try {
    localStorage.setItem(STORAGE_KEY_SESSION, JSON.stringify(account));
    
    // If logged in, also synchronize changes with registered users DB
    if (account.isLoggedIn && account.email) {
      const users = getAllRegisteredUsers();
      const idx = users.findIndex(
        (u) => u.email.toLowerCase() === account.email.toLowerCase()
      );
      if (idx !== -1) {
        users[idx] = {
          ...users[idx],
          name: account.name,
          purchasedProductIds: account.purchasedProductIds,
          purchasedAccess: account.purchasedAccess,
          orderHistory: account.orderHistory,
          isLoggedIn: true,
        };
        saveRegisteredUsers(users);
      }
    }
  } catch (err) {
    console.error('Failed to save active session', err);
  }
}

/**
 * Clear session (logout)
 */
export function clearActiveSession(): void {
  try {
    localStorage.removeItem(STORAGE_KEY_SESSION);
  } catch {
    // fallback
  }
}

/**
 * Register a new parent user account
 */
export function registerAccount(
  name: string,
  email: string,
  password: string
): { success: boolean; account?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();
  const cleanName = name.trim() || cleanEmail.split('@')[0];

  if (!cleanEmail || !cleanEmail.includes('@')) {
    return { success: false, error: 'Please enter a valid email address.' };
  }
  if (!password || password.length < 4) {
    return { success: false, error: 'Password must be at least 4 characters long.' };
  }

  const users = getAllRegisteredUsers();
  const existing = users.find((u) => u.email.toLowerCase() === cleanEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please sign in instead.'
    };
  }

  const newUser: StoredUserRecord = {
    name: cleanName,
    email: cleanEmail,
    passwordHash: password,
    isLoggedIn: true,
    purchasedProductIds: [],
    purchasedAccess: {},
    orderHistory: [],
    createdAt: new Date().toISOString()
  };

  users.push(newUser);
  saveRegisteredUsers(users);

  const sessionAccount: UserAccount = {
    name: newUser.name,
    email: newUser.email,
    isLoggedIn: true,
    purchasedProductIds: newUser.purchasedProductIds,
    purchasedAccess: newUser.purchasedAccess,
    orderHistory: newUser.orderHistory
  };

  saveActiveSession(sessionAccount);
  return { success: true, account: sessionAccount };
}

/**
 * Authenticate existing parent user
 */
export function authenticateAccount(
  email: string,
  password: string
): { success: boolean; account?: UserAccount; error?: string } {
  const cleanEmail = email.trim().toLowerCase();

  if (!cleanEmail || !password) {
    return { success: false, error: 'Email and password are required.' };
  }

  const users = getAllRegisteredUsers();
  const user = users.find((u) => u.email.toLowerCase() === cleanEmail);

  if (!user) {
    return {
      success: false,
      error: 'No account found with this email. Please register first.'
    };
  }

  if (user.passwordHash !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify and try again.'
    };
  }

  const sessionAccount: UserAccount = {
    name: user.name,
    email: user.email,
    isLoggedIn: true,
    purchasedProductIds: user.purchasedProductIds || [],
    purchasedAccess: user.purchasedAccess || {},
    orderHistory: user.orderHistory || []
  };

  saveActiveSession(sessionAccount);
  return { success: true, account: sessionAccount };
}

/**
 * Record a completed order into user account, updating purchased IDs and 90-day access grants
 */
export function recordCompletedPurchase(
  order: Order,
  currentAccount: UserAccount
): UserAccount {
  const purchasedIds = order.items.map((i) => i.product.id);
  const updatedIds = Array.from(
    new Set([...(currentAccount.purchasedProductIds || []), ...purchasedIds])
  );

  const updatedAccess: Record<string, AccessGrant> = {
    ...(currentAccount.purchasedAccess || {})
  };

  purchasedIds.forEach((id) => {
    // 90-day strict access grant
    updatedAccess[id] = createAccessGrant(90);
  });

  const updatedAccount: UserAccount = {
    ...currentAccount,
    name: currentAccount.name || order.customerName,
    email: currentAccount.email || order.customerEmail,
    purchasedProductIds: updatedIds,
    purchasedAccess: updatedAccess,
    orderHistory: [order, ...(currentAccount.orderHistory || [])]
  };

  saveActiveSession(updatedAccount);
  return updatedAccount;
}
