import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, UserCircle, Save, Trash2 } from 'lucide-react';
import { User as UserType } from '../../types';

interface PrimaryRoleModalProps {
  user: UserType;
  selectedPrimaryRole: UserType['primaryRole'];
  setSelectedPrimaryRole: (role: UserType['primaryRole']) => void;
  handleSwitchPrimaryRole: () => Promise<void>;
  handleDeleteRole: (role: UserType['primaryRole']) => Promise<void>;
  isSubmittingRoleSwitch: boolean;
  roleLabelMap: Record<UserType['primaryRole'], string>;
}

const PrimaryRoleModal: React.FC<PrimaryRoleModalProps> = ({
  user,
  selectedPrimaryRole,
  setSelectedPrimaryRole,
  handleSwitchPrimaryRole,
  handleDeleteRole,
  isSubmittingRoleSwitch,
  roleLabelMap,
}) => {
  const [confirmDelete, setConfirmDelete] = React.useState<UserType['primaryRole'] | null>(null);

  return (
    <div className="space-y-6">
      <p className="text-sm text-gray-500">
        Select which role you want to use as your primary view. This affects your default dashboard and navigation.
      </p>

      <div className="space-y-3">
        {user.roles?.map((role) => (
          <div key={role} className="relative group">
            <div
              onClick={() => setSelectedPrimaryRole(role)}
              className={`w-full p-4 rounded-2xl border-2 text-left transition-all flex items-center justify-between cursor-pointer ${
                selectedPrimaryRole === role
                  ? 'border-primary bg-primary/5'
                  : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
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
              <div className="flex items-center gap-2">
                {selectedPrimaryRole === role && (
                  <div className="w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center">
                    <Save className="w-3 h-3" />
                  </div>
                )}
                
                {user.roles && user.roles.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setConfirmDelete(confirmDelete === role ? null : role);
                    }}
                    className={`p-2 rounded-lg transition-all ${
                      confirmDelete === role 
                        ? 'bg-rose-500 text-white' 
                        : 'text-gray-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-900/20'
                    }`}
                    title="Remove Role"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <AnimatePresence>
              {confirmDelete === role && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-2 p-4 bg-rose-50 dark:bg-rose-900/20 rounded-xl border border-rose-100 dark:border-rose-800 flex items-center justify-between">
                    <p className="text-xs font-bold text-rose-600 dark:text-rose-400">
                      Remove this role?
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setConfirmDelete(null)}
                        className="px-3 py-1 text-xs font-bold text-gray-500 hover:text-gray-700"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          handleDeleteRole(role);
                          setConfirmDelete(null);
                        }}
                        className="px-3 py-1 bg-rose-500 text-white text-xs font-bold rounded-lg hover:bg-rose-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
