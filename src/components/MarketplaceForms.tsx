import React, { useState } from 'react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Package, 
  MapPin, 
  Truck, 
  Tag, 
  Info,
  Building2,
  Phone,
  CheckCircle2,
  AlertCircle,
  Plus,
  Camera
} from 'lucide-react';
import { marketCategories, deliveryMethods } from '../data/mockData';

interface FormProps {
  t: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: any;
}

export const AddListingForm: React.FC<FormProps & { step: number; setStep: (s: number) => void }> = ({ t, onClose, onSubmit, user, step, setStep }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    price: '',
    unit: '',
    quantity: '',
    location: user?.location || '',
    deliveryMethod: 'pickup',
    description: '',
    businessName: user?.businessName || user?.name || '',
    phone: user?.phone || ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('Add New Listing', 'Wonjezani Zogulitsa')}</h2>
          <p className="text-sm text-gray-500">{t('Step', 'Gawo')} {step} {t('of', 'mwa')} 3</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {step === 1 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800 flex items-start gap-3 mb-6">
            <Info className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-700 dark:text-emerald-400 leading-relaxed">
              {t('As a Verified Seller, your listings will appear with a trust badge and reach more premium buyers.', 'Monga wogulitsa wotsimikizika, zogulitsa zanu zidzaoneka ndi chizindikiro chodalirika.')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Product Name', 'Dzina la Zokolola')}</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder={t('e.g. Hybrid Maize', 'mwachitsanzo Chimanga cha Hybrid')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Category', 'Gulu')}</label>
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none appearance-none"
            >
              <option value="">{t('Select Category', 'Sankhani Gulu')}</option>
              {marketCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{t(cat.name, cat.nameNy)}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={nextStep}
            disabled={!formData.title || !formData.category}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('Next Step', 'Chotsatira')} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Price (MK)', 'Mtengo (MK)')}</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="45000"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Unit', 'Muyeso')}</label>
              <input 
                type="text" 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                placeholder="50kg Bag"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Quantity Available', 'Kuchuluka Komwe Kuli')}</label>
            <input 
              type="number" 
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
              placeholder="100"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Delivery Method', 'Mayendedwe')}</label>
            <div className="grid grid-cols-1 gap-2">
              {deliveryMethods.map(method => (
                <button 
                  key={method.id}
                  onClick={() => setFormData({...formData, deliveryMethod: method.id})}
                  className={`flex items-center gap-3 p-4 rounded-2xl border-2 transition-all ${formData.deliveryMethod === method.id ? 'border-primary bg-primary/5 text-primary' : 'border-gray-100 dark:border-gray-700 text-gray-500'}`}
                >
                  <Truck className="w-5 h-5" />
                  <span className="font-bold text-sm">{t(method.name, method.nameNy)}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('Back', 'Kubwerera')}
            </button>
            <button 
              onClick={nextStep}
              disabled={!formData.price || !formData.quantity}
              className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {t('Next Step', 'Chotsatira')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Description', 'Zambiri')}</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder={t('Describe quality, harvest date, etc.', 'Fotokozani za mtundu, tsiku lokolola, ndi zina.')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer">
            <Camera className="w-8 h-8" />
            <span className="text-xs font-bold uppercase tracking-widest">{t('Upload Product Image', 'Ikani Chithunzi')}</span>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('Back', 'Kubwerera')}
            </button>
            <button 
              onClick={() => onSubmit(formData)}
              className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('Publish Listing', 'Lembani Tsopano')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AddRequestForm: React.FC<FormProps & { step: number; setStep: (s: number) => void }> = ({ t, onClose, onSubmit, user, step, setStep }) => {
  const [formData, setFormData] = useState({
    commodity: '',
    quantity: '',
    unit: '',
    priceRange: '',
    location: user?.location || '',
    deliveryPreference: 'pickup',
    contactMethod: 'WhatsApp',
    phone: user?.phone || ''
  });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('Post Buyer Request', 'Lembani Chofunika')}</h2>
          <p className="text-sm text-gray-500">{t('Step', 'Gawo')} {step - 9} {t('of', 'mwa')} 2</p>
        </div>
        <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-all">
          <X className="w-6 h-6" />
        </button>
      </div>

      {step === 10 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-2xl border border-indigo-100 dark:border-indigo-800 flex items-start gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <p className="text-xs text-indigo-700 dark:text-indigo-400 leading-relaxed">
              {t('Posting a request helps sellers find you. Specify exactly what you need to get the best offers.', 'Kulemba chofunika kumathandiza ogulitsa kukupezani. Fotokozani bwino zomwe mukufuna.')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Commodity Wanted', 'Zofunika')}</label>
            <input 
              type="text" 
              value={formData.commodity}
              onChange={e => setFormData({...formData, commodity: e.target.value})}
              placeholder={t('e.g. Soya Beans', 'mwachitsanzo Soya')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Quantity', 'Kuchuluka')}</label>
              <input 
                type="text" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                placeholder="500"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Unit', 'Muyeso')}</label>
              <input 
                type="text" 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                placeholder="Metric Tons"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <button 
            onClick={nextStep}
            disabled={!formData.commodity || !formData.quantity}
            className="w-full py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {t('Next Step', 'Chotsatira')} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 11 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Target Price Range', 'Mtengo Omwe Mukufuna')}</label>
            <input 
              type="text" 
              value={formData.priceRange}
              onChange={e => setFormData({...formData, priceRange: e.target.value})}
              placeholder="MK 800 - MK 950 per kg"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('Location / District', 'Malo / Boma')}</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder="Lilongwe, Kanengo"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('Back', 'Kubwerera')}
            </button>
            <button 
              onClick={() => onSubmit(formData)}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('Post Request', 'Lembani Tsopano')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
