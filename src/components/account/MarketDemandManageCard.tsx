import { MarketDemand } from '../../types';
import { ClipboardList, MapPin, Clock3, Pencil, ArrowUpRight } from 'lucide-react';

interface MarketDemandManageCardProps {
  demand: MarketDemand;
  onOpenDetails: (demand: MarketDemand) => void;
  onEdit: (demand: MarketDemand) => void;
  onToggleStatus: (demand: MarketDemand) => void;
}

const statusClasses: Record<string, string> = {
  open: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  matched: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  closed: 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300',
};

const MarketDemandManageCard: React.FC<MarketDemandManageCardProps> = ({
  demand,
  onOpenDetails,
  onEdit,
  onToggleStatus,
}) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-100 dark:border-gray-700 p-5 space-y-4">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h4 className="font-bold text-lg">{demand.commodity}</h4>
          <p className="text-sm text-gray-500">
            {demand.quantity} {demand.unit}
          </p>
        </div>

        <span
          className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold ${
            statusClasses[demand.status] || statusClasses.closed
          }`}
        >
          {demand.status}
        </span>
      </div>

      <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-gray-400" />
          <span>{demand.location}</span>
        </div>

        <div className="flex items-center gap-2">
          <ClipboardList className="w-4 h-4 text-gray-400" />
          <span>Found: {demand.quantityFound ?? 0} / {demand.quantity}</span>
        </div>

        <div className="flex items-center gap-2">
          <Clock3 className="w-4 h-4 text-gray-400" />
          <span>{demand.urgency || 'normal'} urgency</span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <button
          onClick={() => onOpenDetails(demand)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-bold"
        >
          <ArrowUpRight className="w-4 h-4" />
          Open
        </button>

        <button
          onClick={() => onEdit(demand)}
          className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 text-sm font-bold"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </button>

        <button
          onClick={() => onToggleStatus(demand)}
          className="px-3 py-2 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 text-sm font-bold"
        >
          {demand.status === 'closed' ? 'Reopen' : 'Close'}
        </button>
      </div>
    </div>
  );
};

export default MarketDemandManageCard;
