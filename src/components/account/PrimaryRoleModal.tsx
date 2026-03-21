import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCircle, Save } from 'lucide-react';
import { User as UserType } from '../../types';

interface PrimaryRoleModalProps {
  user: UserType;
  selectedPrimaryRole: UserType['primaryRole'];
  setSelectedPrimaryRole: (role: UserType['primaryRole']) => void;
  handleSwitchPrimaryRole: () => Promise<void>;
  isSubmittingRoleSwitch: boolean;
  roleLabelMap: Record<UserType['primaryRole'], string>;
}

const PrimaryRoleModal: React.FC<PrimaryRoleModalProps> = ({
  user,
  selectedPrimaryRole,
  setSelectedPrimaryRole,
  handleSwitchPrimaryRole,
  isSubmittingRoleSwitch,
  roleLabelMap,
}) => {
  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Select which role you want to use as your primary view. This affects your default dashboard and navigation.
      </p>

      <div className="space-y-3">
        {user.roles.map((role) => (
          <button
            key={role}
            onClick={() => setSelectedPrimaryRole(role)}
            className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between group ${
              selectedPrimaryRole === role
                ? 'border-primary bg-primary/5'
                : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                selectedPrimaryRole === role ? 'bg-primary text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-500'
              }`}>
                <UserCircle className="w-6 h-6" />
              </div>
              <span className="font-bold">{roleLabelMap[role]}</span>
            </div>
            {selectedPrimaryRole === role && (
              <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                <Save className="w-3 h-3" />
              </div>
            )}
          </button>
        ))}
      </div>

      <button 
        onClick={handleSwitchPrimaryRole}
        disabled={selectedPrimaryRole === user.primaryRole || isSubmittingRoleSwitch}
        className="w-full py-4 bg-primary text-white font-bold rounded-xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
      >
        {isSubmittingRoleSwitch ? (
          <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <Save className="w-5 h-5" />
        )}
        {isSubmittingRoleSwitch ? 'Switching...' : 'Confirm Switch'}
      </button>
    </div>
  );
};

export default PrimaryRoleModal;
