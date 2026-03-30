import React from 'react';
import { motion } from 'motion/react';
import { ShieldAlert, Clock, AlertCircle, ArrowRight } from 'lucide-react';
import { User } from '../../types';

interface VerificationNoticeProps {
  verification: User['verification'];
  onVerify: () => void;
}

const VerificationNotice: React.FC<VerificationNoticeProps> = ({ verification, onVerify }) => {
  const status = verification?.status || 'none';

  if (status === 'verified') return null;

  const content = {
    pending: {
      icon: Clock,
      title: 'Verification Pending',
      description: `Your documents were submitted on ${verification?.submittedAt ? new Date(verification.submittedAt).toLocaleDateString() : 'recently'} and are currently under review.`,
      color: 'bg-indigo-50 border-indigo-100 text-indigo-700 dark:bg-indigo-900/20 dark:border-indigo-800 dark:text-indigo-300',
      iconColor: 'text-indigo-600 dark:text-indigo-400',
      button: null
    },
    rejected: {
      icon: AlertCircle,
      title: 'Verification Rejected',
      description: verification?.rejectionReason || 'Your verification request was not approved. Please review your documents and try again.',
      color: 'bg-rose-50 border-rose-100 text-rose-700 dark:bg-rose-900/20 dark:border-rose-800 dark:text-rose-300',
      iconColor: 'text-rose-600 dark:text-rose-400',
      button: 'Resubmit Verification'
    },
    none: {
      icon: ShieldAlert,
      title: 'Verify Your Account',
      description: 'Get a verified badge and unlock full selling features by completing your identity verification.',
      color: 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
      iconColor: 'text-amber-600 dark:text-amber-400',
      button: 'Start Verification'
    }
  }[status as 'pending' | 'rejected' | 'none'] || {
    icon: ShieldAlert,
    title: 'Verify Your Account',
    description: 'Get a verified badge and unlock full selling features by completing your identity verification.',
    color: 'bg-amber-50 border-amber-100 text-amber-700 dark:bg-amber-900/20 dark:border-amber-800 dark:text-amber-300',
    iconColor: 'text-amber-600 dark:text-amber-400',
    button: 'Start Verification'
  };

  const Icon = content.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`p-5 rounded-3xl border ${content.color} flex flex-col sm:flex-row sm:items-center gap-4`}
    >
      <div className={`w-12 h-12 rounded-2xl bg-white/50 dark:bg-black/20 flex items-center justify-center shrink-0 ${content.iconColor}`}>
        <Icon className="w-6 h-6" />
      </div>
      
      <div className="flex-1 min-w-0">
        <h4 className="font-bold text-sm uppercase tracking-wider mb-1">{content.title}</h4>
        <p className="text-sm opacity-90 leading-relaxed">{content.description}</p>
      </div>

      {content.button && (
        <button
          onClick={onVerify}
          className="px-5 py-2.5 rounded-xl bg-white dark:bg-gray-800 text-sm font-bold shadow-sm hover:shadow-md transition-all flex items-center gap-2 shrink-0"
        >
          {content.button}
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </motion.div>
  );
};

export default VerificationNotice;
