import React, { useState, useMemo } from 'react';
import { MarketDemand, User } from '../../types';
import { useMarketDemands } from '../../hooks/useMarketDemands';
import MarketDemandManageCard from './MarketDemandManageCard';
import { ClipboardList, PlusCircle } from 'lucide-react';

import { useNavigate } from 'react-router-dom';

interface MyMarketDemandsSectionProps {
  user: User;
  t: (key: string) => string;
  setActiveTab: (tab: 'info' | 'market' | 'experts' | 'account') => void;
  onUpdateMarketDemandStatus: (
    demand: MarketDemand,
    nextStatus: 'open' | 'matched' | 'closed'
  ) => Promise<void> | void;
}

const MyMarketDemandsSection: React.FC<MyMarketDemandsSectionProps> = ({
  user,
  t,
  setActiveTab,
  onUpdateMarketDemandStatus,
}) => {
  const navigate = useNavigate();
  const { demands, loading } = useMarketDemands(user);
  const [tab, setTab] = useState<'open' | 'matched' | 'closed'>('open');

  const filteredDemands = useMemo(() => {
    return demands.filter((item) => item.status === tab);
  }, [demands, tab]);

  const handleOpenDetails = (demand: MarketDemand) => {
    navigate(`/item-detail/${demand.id}`, { state: { item: demand, type: 'market_demand', from: 'account' } });
  };

  const handleEdit = (demand: MarketDemand) => {
    navigate('/add-product', { state: { editingDemand: demand, isDemand: true, from: 'account' } });
  };

  const handleToggleStatus = async (demand: MarketDemand) => {
    const nextStatus = demand.status === 'closed' ? 'open' : 'closed';
    await onUpdateMarketDemandStatus(demand, nextStatus);
  };

  const counts = {
    open: demands.filter((item) => item.status === 'open').length,
    matched: demands.filter((item) => item.status === 'matched').length,
    closed: demands.filter((item) => item.status === 'closed').length,
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h3 className="text-2xl font-black flex items-center gap-2">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
            {t('account.myMarketDemands')}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {t('account.manageDemandsDesc')}
          </p>
        </div>

        <button
          onClick={() => {
            navigate('/add-product', { state: { isDemand: true, from: 'account' } });
          }}
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-indigo-600 text-white font-bold hover:bg-indigo-700"
        >
          <PlusCircle className="w-5 h-5" />
          {t('account.postDemand')}
        </button>
      </div>

      <div className="grid grid-cols-3 gap-3">
        <button
          onClick={() => setTab('open')}
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            tab === 'open'
              ? 'bg-emerald-600 text-white'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {t('account.open')} ({counts.open})
        </button>

        <button
          onClick={() => setTab('matched')}
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            tab === 'matched'
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {t('account.matched')} ({counts.matched})
        </button>

        <button
          onClick={() => setTab('closed')}
          className={`rounded-2xl px-4 py-3 text-sm font-bold ${
            tab === 'closed'
              ? 'bg-gray-900 text-white dark:bg-white dark:text-black'
              : 'bg-gray-50 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
          }`}
        >
          {t('account.closed')} ({counts.closed})
        </button>
      </div>

      {loading ? (
        <div className="rounded-2xl bg-gray-50 dark:bg-gray-700/30 p-6 text-sm text-gray-500">
          {t('account.loadingDemands')}
        </div>
      ) : filteredDemands.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-200 dark:border-gray-700 p-10 text-center">
          <h4 className="text-lg font-bold mb-2">
            {t('account.noDemandsTitle').replace('{status}', t(`account.${tab}`))}
          </h4>
          <p className="text-sm text-gray-500">
            {tab === 'open' && t('account.noOpenDemands')}
            {tab === 'matched' && t('account.noMatchedDemands')}
            {tab === 'closed' && t('account.noClosedDemands')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredDemands.map((demand) => (
            <MarketDemandManageCard
              key={demand.id}
              demand={demand}
              onOpenDetails={handleOpenDetails}
              onEdit={handleEdit}
              onToggleStatus={handleToggleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyMarketDemandsSection;
