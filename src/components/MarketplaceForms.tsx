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
import { 
  marketCategories, 
  deliveryMethods, 
  sellerTypes, 
  standardUnits, 
  malawiRegions, 
  malawiDistrictsByRegion 
} from '../data/constants';
import { StockStatus, BuyerType, User } from '../types';

const computeStockStatus = (
  availableQuantity: number,
  totalQuantity: number
): StockStatus => {
  if (availableQuantity <= 0) return 'out_of_stock';
  if (totalQuantity > 0 && availableQuantity <= totalQuantity * 0.2) return 'low_stock';
  return 'in_stock';
};

const buildLocationLabel = (area: string, district: string, region: string) => {
  const parts = [area, district, region].filter(Boolean);
  return parts.join(', ');
};

interface FormProps {
  t: any;
  onClose: () => void;
  onSubmit: (data: any) => void;
  user: User | null;
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
  isSubmitting?: boolean;
}

export const AddListingForm: React.FC<AddListingFormProps> = ({
  t,
  onClose,
  onSubmit,
  user,
  step,
  setStep,
  initialData,
  isEditMode,
  isSubmitting = false
}) => {
  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    category: initialData?.category || '',
    price: initialData?.price || '',
    unit: initialData?.unit || '',
    customUnit: '',
    quantity: initialData?.quantity || '',
    
    region: initialData?.locationData?.region || '',
    district: initialData?.locationData?.district || '',
    area: initialData?.locationData?.area || '',
    location: initialData?.location || user?.location || '',
    
    deliveryMethod: initialData?.deliveryMethod || 'pickup',
    description: initialData?.description || '',
    businessName: initialData?.businessName || user?.sellerProfile?.businessName || user?.organizationProfile?.organizationName || user?.name || '',
    phone: initialData?.phone || user?.phone || '',
    sellerType: initialData?.sellerType || 'farmer',
    
    imageFiles: [] as File[],
    imagePreviews: initialData?.imagePreviews || (initialData?.imagePreview ? [initialData.imagePreview] : []),

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
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const unitDropdownRef = useRef<HTMLDivElement | null>(null);
  const regionDropdownRef = useRef<HTMLDivElement | null>(null);
  const districtDropdownRef = useRef<HTMLDivElement | null>(null);

  const imageInputRef = useRef<HTMLInputElement | null>(null);

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
      locationData: initialData.locationData,
      deliveryMethod: initialData.deliveryMethod,
      description: initialData.description,
      businessName: initialData.businessName,
      phone: initialData.phone,
      sellerType: initialData.sellerType,
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
      customUnit: '',
      quantity: initialData.quantity || '',
      
      region: initialData.locationData?.region || '',
      district: initialData.locationData?.district || '',
      area: initialData.locationData?.area || '',
      location: initialData.location || user?.location || '',
      
      deliveryMethod: initialData.deliveryMethod || 'pickup',
      description: initialData.description || '',
      businessName: initialData.businessName || user?.sellerProfile?.businessName || user?.organizationProfile?.organizationName || user?.name || '',
      phone: initialData.phone || user?.phone || '',
      sellerType: initialData.sellerType || 'farmer',
      
      imageFiles: [],
      imagePreviews: initialData.imagePreviews || (initialData.imagePreview ? [initialData.imagePreview] : []),

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
      const target = event.target as Node;

      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }

      if (unitDropdownRef.current && !unitDropdownRef.current.contains(target)) {
        setIsUnitOpen(false);
      }

      if (regionDropdownRef.current && !regionDropdownRef.current.contains(target)) {
        setIsRegionOpen(false);
      }

      if (districtDropdownRef.current && !districtDropdownRef.current.contains(target)) {
        setIsDistrictOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 4);

    if (!files.length) return;

    const previews = files.map((file) => URL.createObjectURL(file));

    setFormData({
      ...formData,
      imageFiles: files,
      imagePreviews: previews,
    });
  };

  const handleRemoveImage = (indexToRemove: number) => {
    const nextFiles = formData.imageFiles.filter((_, index) => index !== indexToRemove);
    const nextPreviews = formData.imagePreviews.filter((_, index) => index !== indexToRemove);

    setFormData({
      ...formData,
      imageFiles: nextFiles,
      imagePreviews: nextPreviews,
    });

    if (imageInputRef.current && nextFiles.length === 0) {
      imageInputRef.current.value = '';
    }
  };

  const nextStep = () => {
    setIsCategoryOpen(false);
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmitListing = async () => {
    if (isSubmitting) return;

    if (formData.imagePreviews.length === 0) {
      return;
    }

    const qty = Number(formData.quantity);
    const resolvedUnit =
      formData.unit === 'custom'
        ? ((formData as any).customUnit || '').trim()
        : formData.unit;

    const resolvedLocation = buildLocationLabel(
      formData.area,
      formData.district,
      formData.region
    );

    const normalizedData = {
      ...formData,
      unit: resolvedUnit,
      quantity: qty,
      availableQuantity: qty,
      soldQuantity: 0,
      stockStatus: computeStockStatus(qty, qty),
      location: resolvedLocation,
      locationData: {
        region: formData.region,
        district: formData.district,
        area: formData.area,
        label: resolvedLocation,
      },
    };

    await onSubmit(normalizedData);
  };

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
        <div className="space-y-6 animate-in fade-in slide-in-from-right-4">
          <div className="space-y-4">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Seller Type</label>
            <div className="grid grid-cols-2 gap-2">
              {sellerTypes.map(type => (
                <button
                  key={type.id}
                  type="button"
                  onClick={() => setFormData({...formData, sellerType: type.id as any})}
                  className={`px-4 py-3 rounded-xl border-2 text-sm font-bold transition-all ${
                    formData.sellerType === type.id 
                      ? 'border-primary bg-primary/5 text-primary' 
                      : 'border-gray-100 dark:border-gray-700 text-gray-500'
                  }`}
                >
                  {t(type.name, type.nameNy)}
                </button>
              ))}
            </div>
          </div>

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
            </div>
            <div className="relative" ref={unitDropdownRef}>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Selling unit
              </label>

              <button
                type="button"
                onClick={() => setIsUnitOpen((prev) => !prev)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-left flex items-center justify-between focus:ring-2 focus:ring-primary outline-none"
              >
                <span className={formData.unit ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {formData.unit
                    ? standardUnits.find((u) => u.id === formData.unit)?.label || formData.unit
                    : 'Select unit'}
                </span>
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </button>

              {isUnitOpen && (
                <div className="absolute z-30 mt-2 w-full max-h-72 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <div className="p-2">
                    {standardUnits.map((u) => {
                      const selected = formData.unit === u.id;

                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              unit: u.id,
                              customUnit: u.id === 'custom' ? formData.customUnit : '',
                            });
                            setIsUnitOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="font-medium">{u.label}</span>
                          {selected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          {formData.unit === 'custom' && (
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Custom unit
              </label>
              <input
                type="text"
                value={(formData as any).customUnit || ''}
                onChange={e => setFormData({ ...formData, customUnit: e.target.value })}
                placeholder="e.g. crate, bucket, drum"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Available amount (number of units)</label>
            <input 
              type="number" 
              value={formData.quantity}
              onChange={e => setFormData({...formData, quantity: e.target.value})}
              placeholder="e.g. 50"
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-primary outline-none"
            />
          </div>

          <div className="space-y-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-[24px] border border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Location Details</label>
            <div className="grid grid-cols-2 gap-3">
            <div className="relative" ref={regionDropdownRef}>
              <button
                type="button"
                onClick={() => setIsRegionOpen((prev) => !prev)}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-left flex items-center justify-between focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
              >
                <span className={formData.region ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {formData.region || 'Region'}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
              </button>

              {isRegionOpen && (
                <div className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <div className="p-2">
                    {malawiRegions.map((r) => {
                      const selected = formData.region === r;

                      return (
                        <button
                          key={r}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              region: r,
                              district: '',
                            });
                            setIsRegionOpen(false);
                            setIsDistrictOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="font-medium">{r}</span>
                          {selected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            <div className="relative" ref={districtDropdownRef}>
              <button
                type="button"
                onClick={() => {
                  if (!formData.region) return;
                  setIsDistrictOpen((prev) => !prev);
                }}
                disabled={!formData.region}
                className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-left flex items-center justify-between focus:ring-2 focus:ring-primary outline-none text-sm font-medium disabled:opacity-50"
              >
                <span className={formData.district ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {formData.district || 'District'}
                </span>
                <ChevronsUpDown className="w-4 h-4 text-gray-400" />
              </button>

              {isDistrictOpen && formData.region && (
                <div className="absolute z-30 mt-2 w-full max-h-64 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <div className="p-2">
                    {malawiDistrictsByRegion[formData.region].map((d) => {
                      const selected = formData.district === d;

                      return (
                        <button
                          key={d}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              district: d,
                            });
                            setIsDistrictOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="font-medium">{d}</span>
                          {selected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            </div>
            <input 
              type="text"
              value={formData.area}
              onChange={e => setFormData({...formData, area: e.target.value})}
              placeholder="Area / Village / Trading Center"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-primary outline-none text-sm font-medium"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('forms.deliveryMethod')}</label>
            <div className="grid grid-cols-1 gap-2">
              {deliveryMethods.map(method => (
                <button 
                  key={method.id}
                  type="button"
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
              disabled={
                !formData.price ||
                !formData.quantity ||
                !formData.region ||
                !formData.district ||
                (formData.unit === 'custom' && !(formData as any).customUnit?.trim())
              }
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
              ref={imageInputRef}
              type="file" 
              accept="image/*" 
              multiple
              onChange={handleImageChange}
              className="hidden" 
              id="listing-image"
            />
            <div className="space-y-3">
              <label 
                htmlFor="listing-image"
                className="p-6 bg-gray-50 dark:bg-gray-700 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex flex-col items-center justify-center gap-3 text-gray-400 hover:text-primary hover:border-primary transition-all cursor-pointer overflow-hidden min-h-[120px]"
              >
                <Camera className="w-8 h-8" />
                <span className="text-xs font-bold uppercase tracking-widest">
                  Upload up to 4 images
                </span>
              </label>

              {formData.imagePreviews.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {formData.imagePreviews.slice(0, 4).map((preview: string, index: number) => (
                    <div
                      key={`${preview}-${index}`}
                      className="relative aspect-square rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 bg-gray-100 dark:bg-gray-800"
                    >
                      <img
                        src={preview}
                        alt={`Preview ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {index === 0 && (
                        <div className="absolute top-2 left-2 px-2 py-1 rounded-full bg-black/70 text-white text-[10px] font-semibold">
                          Cover
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => handleRemoveImage(index)}
                        className="absolute top-2 right-2 h-8 w-8 rounded-full bg-black/70 text-white flex items-center justify-center hover:bg-black/85 transition-all"
                        aria-label={`Remove image ${index + 1}`}
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {formData.imagePreviews.length === 0 && (
            <p className="text-xs text-rose-500 font-medium">
              Please upload at least one image before publishing.
            </p>
          )}

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('common.back')}
            </button>
            <button 
              type="button"
              onClick={handleSubmitListing}
              disabled={isSubmitting || formData.imagePreviews.length === 0}
              className="flex-[2] py-4 bg-emerald-600 text-white font-black rounded-2xl shadow-lg shadow-emerald-500/20 hover:bg-emerald-700 transition-all flex items-center justify-center gap-2 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isSubmitting ? 'Publishing...' : (isEditMode ? 'Save Changes' : t('forms.publishListing'))}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export const AddRequestForm: React.FC<FormProps & { 
  step: number; 
  setStep: (s: number) => void;
  initialData?: any;
  isEditMode?: boolean;
}> = ({
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
    commodity: initialData?.commodity || '',
    category: initialData?.category || '',
    quantity: initialData?.quantity || '',
    unit: initialData?.unit || '',

    priceRange: initialData?.priceRange || '',

    region: initialData?.locationData?.region || '',
    district: initialData?.locationData?.district || '',
    area: initialData?.locationData?.area || '',
    location: initialData?.location || user?.location || '',

    neededBy: initialData?.neededBy || '',
    urgency: initialData?.urgency || 'normal' as 'normal' | 'urgent',

    buyerType: initialData?.buyerType || 'individual' as BuyerType,
    deliveryPreference: initialData?.deliveryPreference || 'pickup' as 'pickup' | 'seller_delivery' | 'third_party',
    contactMethod: initialData?.contactMethod || 'whatsapp' as 'whatsapp' | 'phone',
    phone: initialData?.phone || user?.phone || '',

    description: initialData?.description || '',

    imageFile: null as File | null,
    imagePreview: initialData?.referenceImageUrl || '',
    removeExistingImage: false,
  });

  const lastLoadedRef = useRef<string | null>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (!initialData) return;

    const currentKey = JSON.stringify({
      commodity: initialData.commodity,
      category: initialData.category,
      quantity: initialData.quantity,
      unit: initialData.unit,
      priceRange: initialData.priceRange,
      location: initialData.location,
      locationData: initialData.locationData,
      neededBy: initialData.neededBy,
      urgency: initialData.urgency,
      buyerType: initialData.buyerType,
      deliveryPreference: initialData.deliveryPreference,
      contactMethod: initialData.contactMethod,
      phone: initialData.phone,
      description: initialData.description,
      referenceImageUrl: initialData.referenceImageUrl,
    });

    if (lastLoadedRef.current === currentKey) return;
    lastLoadedRef.current = currentKey;

    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }

    setFormData({
      commodity: initialData.commodity || '',
      category: initialData.category || '',
      quantity: initialData.quantity || '',
      unit: initialData.unit || '',
      priceRange: initialData.priceRange || '',
      region: initialData.locationData?.region || '',
      district: initialData.locationData?.district || '',
      area: initialData.locationData?.area || '',
      location: initialData.location || user?.location || '',
      neededBy: initialData.neededBy || '',
      urgency: initialData.urgency || 'normal',
      buyerType: initialData.buyerType || 'individual',
      deliveryPreference: initialData.deliveryPreference || 'pickup',
      contactMethod: initialData.contactMethod || 'whatsapp',
      phone: initialData.phone || user?.phone || '',
      description: initialData.description || '',
      imageFile: null,
      imagePreview: initialData.referenceImageUrl || '',
      removeExistingImage: false,
    });
  }, [initialData, user]);

  useEffect(() => {
    return () => {
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
    };
  }, []);

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isUnitOpen, setIsUnitOpen] = useState(false);
  const [isRegionOpen, setIsRegionOpen] = useState(false);
  const [isDistrictOpen, setIsDistrictOpen] = useState(false);
  const [isBuyerTypeOpen, setIsBuyerTypeOpen] = useState(false);
  const [isDeliveryOpen, setIsDeliveryOpen] = useState(false);

  const categoryDropdownRef = useRef<HTMLDivElement | null>(null);
  const unitDropdownRef = useRef<HTMLDivElement | null>(null);
  const regionDropdownRef = useRef<HTMLDivElement | null>(null);
  const districtDropdownRef = useRef<HTMLDivElement | null>(null);
  const buyerTypeDropdownRef = useRef<HTMLDivElement | null>(null);
  const deliveryDropdownRef = useRef<HTMLDivElement | null>(null);
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;

      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(target)) {
        setIsCategoryOpen(false);
      }

      if (unitDropdownRef.current && !unitDropdownRef.current.contains(target)) {
        setIsUnitOpen(false);
      }

      if (regionDropdownRef.current && !regionDropdownRef.current.contains(target)) {
        setIsRegionOpen(false);
      }

      if (districtDropdownRef.current && !districtDropdownRef.current.contains(target)) {
        setIsDistrictOpen(false);
      }

      if (buyerTypeDropdownRef.current && !buyerTypeDropdownRef.current.contains(target)) {
        setIsBuyerTypeOpen(false);
      }

      if (deliveryDropdownRef.current && !deliveryDropdownRef.current.contains(target)) {
        setIsDeliveryOpen(false);
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
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }

      const previewUrl = URL.createObjectURL(file);
      objectUrlRef.current = previewUrl;

      setFormData({
        ...formData,
        imageFile: file,
        imagePreview: previewUrl,
        removeExistingImage: false,
      });
    }
  };

  const nextStep = () => {
    setIsCategoryOpen(false);
    setIsUnitOpen(false);
    setIsRegionOpen(false);
    setIsDistrictOpen(false);
    setIsBuyerTypeOpen(false);
    setIsDeliveryOpen(false);
    setStep(step + 1);
  };
  const prevStep = () => setStep(step - 1);

  const handleSubmit = () => {
    const resolvedLocation = buildLocationLabel(formData.area, formData.district, formData.region);

    onSubmit({
      ...formData,
      quantity: Number(formData.quantity),
      location: resolvedLocation,
      locationData: {
        region: formData.region,
        district: formData.district,
        area: formData.area,
        label: resolvedLocation
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {isEditMode ? 'Edit Request' : t('forms.postRequest')}
          </h2>
          <p className="text-sm text-gray-500">{t('common.step')} {step - 9} {t('common.of')} 3</p>
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

          <div className="relative" ref={categoryDropdownRef}>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
              {t('common.category')}
            </label>

            <button
              type="button"
              onClick={() => setIsCategoryOpen((prev) => !prev)}
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-600 outline-none"
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
              <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
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
                            ? 'bg-indigo-50 text-indigo-600'
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

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">{t('common.quantity')}</label>
              <input 
                type="number" 
                value={formData.quantity}
                onChange={e => setFormData({...formData, quantity: e.target.value})}
                placeholder="e.g. 500"
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div className="relative" ref={unitDropdownRef}>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                {t('common.unit')}
              </label>

              <button
                type="button"
                onClick={() => setIsUnitOpen((prev) => !prev)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                <span className={formData.unit ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                  {formData.unit
                    ? standardUnits.find((u) => u.id === formData.unit)?.label || formData.unit
                    : 'Select unit'}
                </span>
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </button>

              {isUnitOpen && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <div className="p-2">
                    {standardUnits.map((u) => {
                      const selected = formData.unit === u.id;

                      return (
                        <button
                          key={u.id}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, unit: u.id });
                            setIsUnitOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="font-medium">{u.label}</span>
                          {selected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <button 
            onClick={nextStep}
            disabled={!formData.commodity || !formData.category || !formData.quantity || !formData.unit}
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

          <div className="space-y-4 p-5 bg-gray-50 dark:bg-gray-800/50 rounded-[24px] border border-gray-100 dark:border-gray-700">
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest">Delivery Location</label>
            <div className="grid grid-cols-2 gap-3">
              <div className="relative" ref={regionDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsRegionOpen((prev) => !prev)}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium"
                >
                  <span className={formData.region ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                    {formData.region || 'Region'}
                  </span>
                  <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                </button>

                {isRegionOpen && (
                  <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                    <div className="p-2">
                      {malawiRegions.map((r) => {
                        const selected = formData.region === r;

                        return (
                          <button
                            key={r}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                region: r,
                                district: '',
                              });
                              setIsRegionOpen(false);
                            }}
                            className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                              selected
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            <span className="font-medium">{r}</span>
                            {selected && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>

              <div className="relative" ref={districtDropdownRef}>
                <button
                  type="button"
                  onClick={() => {
                    if (!formData.region) return;
                    setIsDistrictOpen((prev) => !prev);
                  }}
                  disabled={!formData.region}
                  className="w-full px-4 py-3 bg-white dark:bg-gray-700 rounded-xl text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium disabled:opacity-50"
                >
                  <span className={formData.district ? 'text-gray-900 dark:text-white' : 'text-gray-400'}>
                    {formData.district || 'District'}
                  </span>
                  <ChevronsUpDown className="w-4 h-4 text-gray-400" />
                </button>

                {isDistrictOpen && formData.region && (
                  <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                    <div className="p-2">
                      {malawiDistrictsByRegion[formData.region].map((d) => {
                        const selected = formData.district === d;

                        return (
                          <button
                            key={d}
                            type="button"
                            onClick={() => {
                              setFormData({
                                ...formData,
                                district: d,
                              });
                              setIsDistrictOpen(false);
                            }}
                            className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                              selected
                                ? 'bg-indigo-50 text-indigo-600'
                                : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                            }`}
                          >
                            <span className="font-medium">{d}</span>
                            {selected && <Check className="w-4 h-4" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <input 
              type="text"
              value={formData.area}
              onChange={e => setFormData({...formData, area: e.target.value})}
              placeholder="Area / Village / Trading Center"
              className="w-full px-4 py-3 bg-white dark:bg-gray-700 border-none rounded-xl focus:ring-2 focus:ring-indigo-600 outline-none text-sm font-medium"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Needed By</label>
              <input 
                type="date" 
                value={formData.neededBy}
                onChange={e => setFormData({...formData, neededBy: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Urgency</label>
              <div className="flex gap-2">
                {(['normal', 'urgent'] as const).map(u => (
                  <button
                    key={u}
                    type="button"
                    onClick={() => setFormData({...formData, urgency: u})}
                    className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                      formData.urgency === u 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                        : 'border-gray-100 dark:border-gray-700 text-gray-500'
                    }`}
                  >
                    {u.charAt(0).toUpperCase() + u.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('common.back')}
            </button>
            <button 
              onClick={nextStep}
              disabled={!formData.region || !formData.district}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {t('common.next')} <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {step === 12 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="relative" ref={buyerTypeDropdownRef}>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Buyer Type
              </label>

              <button
                type="button"
                onClick={() => setIsBuyerTypeOpen((prev) => !prev)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                <span className="text-gray-900 dark:text-white">
                  {formData.buyerType.charAt(0).toUpperCase() + formData.buyerType.slice(1)}
                </span>
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </button>

              {isBuyerTypeOpen && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <div className="p-2">
                    {(['farmer', 'trader', 'processor', 'business', 'individual'] as BuyerType[]).map((type) => {
                      const selected = formData.buyerType === type;

                      return (
                        <button
                          key={type}
                          type="button"
                          onClick={() => {
                            setFormData({ ...formData, buyerType: type });
                            setIsBuyerTypeOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="font-medium">
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </span>
                          {selected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="relative" ref={deliveryDropdownRef}>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">
                Delivery
              </label>

              <button
                type="button"
                onClick={() => setIsDeliveryOpen((prev) => !prev)}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 rounded-2xl text-left flex items-center justify-between focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                <span className="text-gray-900 dark:text-white">
                  {formData.deliveryPreference === 'pickup'
                    ? 'I will pick up'
                    : formData.deliveryPreference === 'seller_delivery'
                    ? 'Seller delivers'
                    : 'Third party delivery'}
                </span>
                <ChevronsUpDown className="w-5 h-5 text-gray-400" />
              </button>

              {isDeliveryOpen && (
                <div className="absolute z-30 mt-2 w-full max-h-60 overflow-y-auto bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 rounded-2xl shadow-2xl">
                  <div className="p-2">
                    {[
                      { id: 'pickup', label: 'I will pick up' },
                      { id: 'seller_delivery', label: 'Seller delivers' },
                      { id: 'third_party', label: 'Third party delivery' },
                    ].map((option) => {
                      const selected = formData.deliveryPreference === option.id;

                      return (
                        <button
                          key={option.id}
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              deliveryPreference: option.id as 'pickup' | 'seller_delivery' | 'third_party',
                            });
                            setIsDeliveryOpen(false);
                          }}
                          className={`w-full px-4 py-3 rounded-xl text-left flex items-center justify-between transition-all ${
                            selected
                              ? 'bg-indigo-50 text-indigo-600'
                              : 'hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
                          }`}
                        >
                          <span className="font-medium">{option.label}</span>
                          {selected && <Check className="w-4 h-4" />}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Contact Via</label>
              <div className="flex gap-2">
                {(['whatsapp', 'phone'] as const).map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setFormData({...formData, contactMethod: m})}
                    className={`flex-1 py-4 rounded-2xl border-2 font-bold text-sm transition-all ${
                      formData.contactMethod === m 
                        ? 'border-indigo-600 bg-indigo-50 text-indigo-600' 
                        : 'border-gray-100 dark:border-gray-700 text-gray-500'
                    }`}
                  >
                    {m === 'whatsapp' ? 'WhatsApp' : 'Phone'}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Phone Number</label>
              <input 
                type="tel" 
                value={formData.phone}
                onChange={e => setFormData({...formData, phone: e.target.value})}
                className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Additional Details</label>
            <textarea 
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              rows={3}
              placeholder="Any specific requirements, quality standards, etc."
              className="w-full px-5 py-4 bg-gray-50 dark:bg-gray-700 border-none rounded-2xl focus:ring-2 focus:ring-indigo-600 outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Reference Photo (Optional)</label>
            <input 
              ref={imageInputRef}
              type="file" 
              accept="image/*" 
              onChange={handleImageChange}
              className="hidden" 
              id="request-image"
            />
            <div className="flex items-center gap-4">
              <label 
                htmlFor="request-image"
                className="flex-1 p-4 bg-gray-50 dark:bg-gray-700 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-600 flex items-center justify-center gap-3 text-gray-400 hover:text-indigo-600 hover:border-indigo-600 transition-all cursor-pointer"
              >
                <Camera className="w-6 h-6" />
                <span className="text-xs font-bold uppercase tracking-widest">Upload Photo</span>
              </label>
              {formData.imagePreview && (
                <div className="relative w-20 h-20 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700">
                  <img src={formData.imagePreview} className="w-full h-full object-cover" />
                  <button 
                    onClick={() => {
                      if (objectUrlRef.current) {
                        URL.revokeObjectURL(objectUrlRef.current);
                        objectUrlRef.current = null;
                      }

                      setFormData({
                        ...formData,
                        imageFile: null,
                        imagePreview: '',
                        removeExistingImage: true,
                      });

                      if (imageInputRef.current) {
                        imageInputRef.current.value = '';
                      }
                    }}
                    className="absolute top-1 right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70 transition-all"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button onClick={prevStep} className="flex-1 py-4 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 font-bold rounded-2xl hover:bg-gray-200 transition-all">
              {t('common.back')}
            </button>
            <button 
              onClick={handleSubmit}
              className="flex-[2] py-4 bg-indigo-600 text-white font-black rounded-2xl shadow-lg shadow-indigo-500/20 hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              {isEditMode ? 'Save Changes' : t('forms.postNow')}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
