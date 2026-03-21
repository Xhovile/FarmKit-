import React from 'react';
import { User as UserType } from '../../types';

interface AccountTypeCardProps {
  user: UserType;
  roleLabelMap: Record<UserType['primaryRole'], string>;
  statusLabelMap: Record<UserType['status'], string>;
}

const AccountTypeCard: React.FC<AccountTypeCardProps> = ({
  user,
  roleLabelMap,
  statusLabelMap,
}) => {
  return (
    <div className="bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl border border-gray-100 dark:border-gray-700 space-y-4">
      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Account Type
        </h4>
        <div className="flex flex-wrap gap-2">
          <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold">
            {roleLabelMap[user.primaryRole]}
          </span>
          <span className="px-3 py-1 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xs font-bold">
            {statusLabelMap[user.status]}
          </span>
        </div>
      </div>

      <div>
        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">
          Active Roles
        </h4>
        <div className="flex flex-wrap gap-2">
          {user.roles.map((role) => (
            <span
              key={role}
              className="px-3 py-1 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 text-xs font-semibold"
            >
              <div className="flex items-center gap-2">
                <span>{roleLabelMap[role]}</span>
                {user.primaryRole === role && (
                  <span className="text-[10px] font-bold text-primary uppercase">
                    Main
                  </span>
                )}
              </div>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AccountTypeCard;
