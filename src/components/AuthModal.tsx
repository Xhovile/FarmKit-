import React, { useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  deleteUser,
  sendEmailVerification,
  sendPasswordResetEmail,
  updateProfile,
  reauthenticateWithCredential,
  EmailAuthProvider
} from 'firebase/auth';
import { auth, db } from '../lib/firebase';
import { doc, setDoc, deleteDoc } from 'firebase/firestore';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Lock, User, LogOut, Trash2, AlertCircle, CheckCircle2, ShieldAlert } from 'lucide-react';
import toast from 'react-hot-toast';
import { getCleanErrorMessage } from '../lib/auth-errors';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  t: (key: string) => string;
  lang?: string;
}

export default function AuthModal({ isOpen, onClose, t, lang = 'en' }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [reauthPassword, setReauthPassword] = useState('');
  const [showReauth, setShowReauth] = useState(false);
  const [unverifiedUser, setUnverifiedUser] = useState<any>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!isLogin) {
      if (!name.trim()) {
        toast.error(getCleanErrorMessage('name-required', lang));
        return;
      }
      if (password.length < 6) {
        toast.error(getCleanErrorMessage('password-too-short', lang));
        return;
      }
      if (password !== confirmPassword) {
        toast.error(getCleanErrorMessage('passwords-dont-match', lang));
        return;
      }
    }

    setLoading(true);
    setUnverifiedUser(null);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        if (!user.emailVerified) {
          setUnverifiedUser(user);
          await signOut(auth);
          toast.error(t('auth.emailNotVerified'));
          setLoading(false);
          return;
        }

        toast.success(t('auth.welcomeBack') || 'Welcome back!');
        onClose();
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // Update profile with name
        await updateProfile(user, { displayName: name });

        // Create Firestore document
        await setDoc(doc(db, 'users', user.uid), {
          name,
          email,
          tier: 'Free',
          location: '',
          phone: '',
          bio: '',
          emailVerified: false,
          createdAt: new Date().toISOString()
        });

        // Send verification email
        await sendEmailVerification(user);
        
        toast.success(t('auth.accountCreated') || 'Account created! Please verify your email.');
        setUnverifiedUser(user);
        await signOut(auth);
        setIsLogin(true);
      }
    } catch (error: any) {
      toast.error(getCleanErrorMessage(error.code, lang));
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!unverifiedUser) return;
    setLoading(true);
    try {
      await sendEmailVerification(unverifiedUser);
      toast.success(t('auth.verificationSent'));
    } catch (error: any) {
      toast.error(getCleanErrorMessage(error.code, lang));
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error(getCleanErrorMessage('auth/invalid-email', lang));
      return;
    }
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(t('auth.resetEmailSent'));
    } catch (error: any) {
      toast.error(getCleanErrorMessage(error.code, lang));
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success(t('account.loggedOut') || 'Logged out successfully.');
      onClose();
    } catch (error: any) {
      toast.error(getCleanErrorMessage(error.code, lang));
    }
  };

  const handleDeleteAccount = async () => {
    const user = auth.currentUser;
    if (!user) return;

    setLoading(true);
    try {
      // 1. Re-authenticate FIRST to ensure we have a fresh token
      // This minimizes the risk of deleteUser failing after Firestore cleanup
      if (showReauth || !reauthPassword) {
        const credential = EmailAuthProvider.credential(user.email!, reauthPassword);
        await reauthenticateWithCredential(user, credential);
      }

      const uid = user.uid;

      // 2. Delete Firestore document while still authenticated
      // This is safer because we still have the token to pass security rules
      await deleteDoc(doc(db, 'users', uid));

      // 3. Delete Firebase Auth account LAST
      // If this fails, we still have the user but their data is gone (privacy safe)
      // But since we just re-authenticated, the chance of failure is extremely low.
      await deleteUser(user);
      
      toast.success(t('auth.accountDeleted') || 'Account deleted successfully.');
      onClose();
    } catch (error: any) {
      if (error.code === 'auth/requires-recent-login') {
        setShowReauth(true);
        toast.error(getCleanErrorMessage(error.code, lang));
      } else {
        toast.error(getCleanErrorMessage(error.code, lang));
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-white dark:bg-gray-800 w-full max-w-md rounded-3xl shadow-lg overflow-hidden relative"
      >
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        <div className="p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">
              {isLogin ? t('auth.welcomeBackTitle') : t('auth.createAccountTitle')}
            </h2>
            <p className="text-gray-500 mt-1">
              {isLogin ? t('auth.signInDesc') : t('auth.joinCommunity')}
            </p>
          </div>

          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('account.fullName')}</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="text" 
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder="Isaac Mtsiriza"
                  />
                </div>
              </div>
            )}
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('auth.email')}</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="farmer@example.mw"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('auth.password')}</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                <input 
                  type="password" 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                  placeholder="••••••••"
                />
              </div>
              {isLogin && (
                <div className="mt-1 text-right">
                  <button 
                    type="button"
                    onClick={handleForgotPassword}
                    className="text-[10px] font-bold text-primary hover:underline"
                  >
                    {t('auth.forgotPassword')}
                  </button>
                </div>
              )}
            </div>

            {!isLogin && (
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{t('auth.confirmPassword') || 'Confirm Password'}</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-gray-400" />
                  <input 
                    type="password" 
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-100 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-primary outline-none"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            )}

            <button 
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-md shadow-primary/10 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                isLogin ? t('auth.loginButton') : t('auth.signUpButton')
              )}
            </button>

            {unverifiedUser && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="pt-2"
              >
                <button 
                  type="button"
                  onClick={handleResendVerification}
                  disabled={loading}
                  className="w-full py-2 text-xs font-bold text-primary hover:underline flex items-center justify-center gap-2"
                >
                  <Mail className="w-4 h-4" /> {t('auth.resendVerification')}
                </button>
              </motion.div>
            )}
          </form>

          <div className="mt-6 text-center">
            <button 
              onClick={() => {
                setIsLogin(!isLogin);
                setPassword('');
                setConfirmPassword('');
              }}
              className="text-sm font-bold text-primary hover:underline"
            >
              {isLogin ? t("auth.noAccount") : t("auth.haveAccount")}
            </button>
          </div>

          {auth.currentUser && (
            <div className="mt-8 pt-8 border-t border-gray-100 dark:border-gray-700 space-y-4">
              <button 
                onClick={handleLogout}
                className="w-full py-3 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-xl hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
              >
                <LogOut className="w-5 h-5" /> {t('common.logout')}
              </button>

              {showDeleteConfirm ? (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-2xl space-y-3"
                >
                  <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 mb-2">
                    <ShieldAlert className="w-5 h-5" />
                    <p className="text-xs font-bold">
                      {t('auth.deleteConfirm')}
                    </p>
                  </div>

                  {showReauth && (
                    <div className="space-y-2">
                      <p className="text-[10px] text-rose-500 font-medium">
                        {t('auth.reauthRequired') || 'Please enter your password to confirm deletion.'}
                      </p>
                      <input 
                        type="password"
                        value={reauthPassword}
                        onChange={(e) => setReauthPassword(e.target.value)}
                        placeholder="Confirm Password"
                        className="w-full px-3 py-2 bg-white dark:bg-gray-800 border border-rose-200 dark:border-rose-900 rounded-lg text-sm outline-none focus:ring-1 focus:ring-rose-500"
                      />
                    </div>
                  )}

                  <div className="flex gap-2">
                    <button 
                      onClick={() => {
                        setShowDeleteConfirm(false);
                        setShowReauth(false);
                        setReauthPassword('');
                      }}
                      className="flex-1 py-2 bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-lg border border-gray-100 dark:border-gray-700"
                    >
                      {t('common.cancel')}
                    </button>
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={loading || (showReauth && !reauthPassword)}
                      className="flex-1 py-2 bg-rose-600 text-white text-xs font-bold rounded-lg shadow-md disabled:opacity-50"
                    >
                      {t('common.delete')}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full py-3 text-rose-500 text-xs font-bold hover:underline flex items-center justify-center gap-2"
                >
                  <Trash2 className="w-4 h-4" /> {t('auth.deleteAccount')}
                </button>
              )}
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
