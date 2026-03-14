import React, { useEffect, useRef, useState } from 'react';
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
  Camera,
  Check,
  ChevronsUpDown
} from 'lucide-react';
import { marketCategories, deliveryMethods } from '../data/constants';

interface FormProps {
  t: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: any;
}

type SpecField = {
  key: string;
  label: string;
  placeholder: string;
};

const getSpecFieldsForCategory = (category: string): SpecField[] => {
  switch (category) {
    case 'tools':
    case 'irrigation':
      return [
        { key: 'condition', label: 'Condition', placeholder: 'New / Used / Refurbished' },
        { key: 'brand', label: 'Brand', placeholder: 'e.g. John Deere / Honda' },
        { key: 'model', label: 'Model', placeholder: 'e.g. WB-90 / 5050D' },
        { key: 'capacity', label: 'Power / Capacity', placeholder: 'e.g. 50HP / 120L / 80kg' },
        { key: 'fuelType', label: 'Fuel Type', placeholder: 'Diesel / Petrol / Electric / Manual' },
      ];

    case 'seeds':
      return [
        { key: 'seedType', label: 'Seed Type', placeholder: 'Hybrid / OPV / Local' },
        { key: 'variety', label: 'Variety', placeholder: 'e.g. SC 403' },
        { key: 'packSize', label: 'Pack Size', placeholder: 'e.g. 2kg bag' },
        { key: 'season', label: 'Season', placeholder: 'Rainy / Winter / Summer' },
        { key: 'germinationRate', label: 'Germination Rate', placeholder: 'e.g. 95%' },
      ];

    case 'livestock':
    case 'fish':
      return [
        { key: 'breed', label: 'Breed / Type', placeholder: 'e.g. Boer / Broiler / Tilapia' },
        { key: 'age', label: 'Age', placeholder: 'e.g. 8 months / 6 weeks' },
        { key: 'sex', label: 'Sex', placeholder: 'Male / Female / Mixed' },
        { key: 'healthStatus', label: 'Health Status', placeholder: 'Healthy / Under treatment' },
        { key: 'vaccinationStatus', label: 'Vaccination', placeholder: 'Vaccinated / Not vaccinated' },
      ];

    case 'fertilizers':
    case 'pesticides':
    case 'vet_products':
    case 'feed':
      return [
        { key: 'brand', label: 'Brand', placeholder: 'e.g. Yara / Dudu / Farm Feeds' },
        { key: 'inputType', label: 'Input Type', placeholder: 'Fertilizer / Herbicide / Vet Product / Feed' },
        { key: 'packSize', label: 'Pack Size', placeholder: 'e.g. 50kg / 1L / 25kg' },
        { key: 'usage', label: 'Usage', placeholder: 'What is it used for?' },
        { key: 'expiryDate', label: 'Expiry Date', placeholder: 'e.g. 2027-08-31' },
      ];

    case 'crops':
    case 'animal_products':
      return [
        { key: 'variety', label: 'Variety / Grade', placeholder: 'e.g. Grade A / Fresh / Dry' },
        { key: 'packSize', label: 'Packaging', placeholder: 'e.g. 50kg bags / trays / crates' },
        { key: 'season', label: 'Harvest / Production Season', placeholder: 'e.g. 2026 main season' },
      ];

    default:
      return [];
  }
};

interface AddListingFormProps extends FormProps {
  step: number;
  setStep: (s: number) => void;
  initialData?: any;
  isEditMode?: boolean;
}

export const AddListingForm: React.FC<AddListingFormProps> = ({
  t,
  onClose,
  onSubmit,
  user,
  step,
  setStep,
  initialData,
  isEditMode
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    unit: initialData?.unit || '',
    quantity: initialData?.quantity || '',
    location: initialData?.location || user?.location || '',
    deliveryMethod: initialData?.deliveryMethod || 'pickup',
    description: initialData?.description || '',
    businessName: initialData?.businessName || user?.businessName || user?.name || '',
    phone: initialData?.phone || user?.phone || '',
    imageFile: null as File | null,
    imagePreview: initialData?.imagePreview || '',

    condition: initialData?.condition || '',
    brand: initialData?.brand || '',
    model: initialData?.model || '',
    capacity: initialData?.capacity || '',
    fuelType: initialData?.fuelType || '',

    seedType: initialData?.seedType || '',
    variety: initialData?.variety || '',
    packSize: initialData?.packSize || '',
    season: initialData?.season || '',
    germinationRate: initialData?.germinationRate || '',

    breed: initialData?.breed || '',
    age: initialData?.age || '',
    sex: initialData?.sex || '',
    healthStatus: initialData?.healthStatus || '',
    vaccinationStatus: initialData?.vaccinationStatus || '',

    inputType: initialData?.inputType || '',
    usage: initialData?.usage || '',
    expiryDate: initialData?.expiryDate || '',
  });

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);

  const specFields = getSpecFieldsForCategory(formData.category);

  const lastLoadedRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialData) return;

    const currentKey = JSON.stringify({
      title: initialData.title,
      category: initialData.category,
      price: initialData.price,
      unit: initialData.unit,
      quantity: initialData.quantity,
      location: initialData.location,
      deliveryMethod: initialData.deliveryMethod,
      description: initialData.description,
      businessName: initialData.businessName,
      phone: initialData.phone,
      imagePreview: initialData.imagePreview,
      condition: initialData.condition,
      brand: initialData.brand,
      model: initialData.model,
      capacity: initialData.capacity,
      fuelType: initialData.fuelType,
      seedType: initialData.seedType,
      variety: initialData.variety,
      packSize: initialData.packSize,
      season: initialData.season,
      germinationRate: initialData.germinationRate,
      breed: initialData.breed,
      age: initialData.age,
      sex: initialData.sex,
      healthStatus: initialData.healthStatus,
      vaccinationStatus: initialData.vaccinationStatus,
      inputType: initialData.inputType,
      usage: initialData.usage,
      expiryDate: initialData.expiryDate,
    });

    if (lastLoadedRef.current === currentKey) return;
    lastLoadedRef.current = currentKey;

    setFormData({
      title: initialData.title || '',
      category: initialData.category || '',
      price: initialData.price || '',
      unit: initialData.unit || '',
      quantity: initialData.quantity || '',
      location: initialData.location || user?.location || '',
      deliveryMethod: initialData.deliveryMethod || 'pickup',
      description: initialData.description || '',
      businessName: initialData.businessName || user?.businessName || user?.name || '',
      phone: initialData.phone || user?.phone || '',
      imageFile: null,
      imagePreview: initialData.imagePreview || '',

      condition: initialData.condition || '',
      brand: initialData.brand || '',
      model: initialData.model || '',
      capacity: initialData.capacity || '',
      fuelType: initialData.fuelType || '',

      seedType: initialData.seedType || '',
      variety: initialData.variety || '',
      packSize: initialData.packSize || '',
      season: initialData.season || '',
      germinationRate: initialData.germinationRate || '',

      breed: initialData.breed || '',
      age: initialData.age || '',
      sex: initialData.sex || '',
      healthStatus: initialData.healthStatus || '',
      vaccinationStatus: initialData.vaccinationStatus || '',

      inputType: initialData.inputType || '',
      usage: initialData.usage || '',
      expiryDate: initialData.expiryDate || '',
    });
  }, [initialData, user]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        categoryDropdownRef.current &&
        !categoryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCategoryOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: URL.createObjectURL(file)
      });
    }
  };

  const nextStep = () => {
    setIsCategoryOpen(false);
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Listing' : t('forms.addListing')}
          </h2>
          <p className="text-sm text-gray-500">{t('common.step')} {step} {t('common.of')} 3</p>
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
              {t('forms.verifiedSellerTip')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('forms.productName')}</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder={t('forms.productNamePlaceholder')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="relative" ref={categoryDropdownRef}>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              {t('common.category')}
            </label>

            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-left flex items-center justify-between focus:ring-2 focus:ring-primary outline-none"
            >
              <span className={formData.category ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                {formData.category
                  ? t(
                      marketCategories.find((cat) => cat.id === formData.category)?.name || formData.category,
                      marketCategories.find((cat) => cat.id === formData.category)?.nameNy || formData.category
                    )
                  : t('forms.selectCategory')}
              </span>
              <ChevronsUpDown className="w-5 h-5 text-gray-400" />
            </button>

            {isCategoryOpen && (
              <div className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                <div className="p-2">
                  {marketCategories.map((cat) => {
                    const selected = formData.category === cat.id;

                    return (
                      <button
                        key={cat.id}
                        type="button"
                        onClick={() => {
                          setFormData({ ...formData, category: cat.id });
                          setIsCategoryOpen(false);
                        }}
                        className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                          selected
                            ? 'bg-primary/10 text-primary'
                            : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                        }`}
                      >
                        <span className="font-medium">{t(cat.name, cat.nameNy)}</span>
                        {selected && <Check className="w-4 h-4" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <button 
            onClick={nextStep}
            disabled={!formData.title || !formData.category}
            className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('common.next')} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Price per unit (MWK)</label>
              <input 
                type="number" 
                value={formData.price}
                onChange={e => setFormData({...formData, price: e.target.value})}
                placeholder="e.g. 5000"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              />
              <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
                This is the price for one unit, such as 1 kg, 1 goat, 1 bottle, 1 truck, or 1 bag.
              </p>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Selling unit</label>
              <input 
                type="text" 
                value={formData.unit}
                onChange={e => setFormData({...formData, unit: e.target.value})}
                placeholder="e.g. kg, bag, litre, tray, bunch"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Available amount (number of units)</label>
            <input 
              type="number" 
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
              placeholder="e.g. 50"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
            />
            <p className="mt-2 text-[11px] text-gray-500 dark:text-gray-400 leading-relaxed">
              Enter only the number. Put the selling basis in “Selling unit”, such as kg, 1 goat, 1 bottle, or 1 truck.
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('forms.deliveryMethod')}</label>
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
              {t('common.back')}
            </button>
            <button 
              onClick={nextStep}
              disabled={!formData.price || !formData.quantity}
              className="flex-[2] py-4 bg-primary text-white font-black rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {t('common.next')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          {specFields.length > 0 && (
            <div className="space-y-4">
              <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-100 dark:border-blue-800">
                <p className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                  Category details
                </p>
                <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                  Add the key specifications that matter for this type of product.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {specFields.map((field) => (
                  <div key={field.key}>
                    <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      value={(formData as any)[field.key]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder={field.placeholder}
                      className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('common.description')}</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder={t('forms.descriptionPlaceholder')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none resize-none"
            />
          </div>

          <div className="relative">
            <input 
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden" 
              id="listing-image"
            />
            <label 
              htmlFor="listing-image"
              className="p-6 bg-gray-50 dark:bg-gray-700 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer overflow-hidden min-h-[120px]"
            >
              {formData.imagePreview ? (
                <img src={formData.imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
              ) : (
                <>
                  <Camera className="w-8 h-8" />
                  <span className="text-xs font-bold uppercase tracking-widest">{t('forms.uploadImage')}</span>
                </>
              )}
            </label>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('common.back')}
            </button>
            <button 
              onClick={() => onSubmit(formData)}
              className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isEditMode ? 'Save Changes' : t('forms.publishListing')}
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
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">{t('forms.postRequest')}</h2>
          <p className="text-sm text-gray-500">{t('common.step')} {step - 9} {t('common.of')} 2</p>
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
              {t('forms.buyerRequestTip')}
            </p>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('forms.commodityWanted')}</label>
            <input 
              type="text" 
              value={formData.commodity}
              onChange={e => setFormData({...formData, commodity: e.target.value})}
              placeholder={t('forms.commodityPlaceholder')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('common.quantity')}</label>
              <input 
                type="text" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                placeholder="500"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('common.unit')}</label>
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
            {t('common.next')} <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {step === 11 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('forms.targetPriceRange')}</label>
            <input 
              type="text" 
              value={formData.priceRange}
              onChange={e => setFormData({...formData, priceRange: e.target.value})}
              placeholder={t('forms.priceRangePlaceholder')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('common.location')}</label>
            <input 
              type="text" 
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
              placeholder={t('forms.locationPlaceholder')}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('common.back')}
            </button>
            <button 
              onClick={() => onSubmit(formData)}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {t('forms.postNow')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
