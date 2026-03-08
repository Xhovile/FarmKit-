import { Sprout, Book, Store, GraduationCap } from 'lucide-react';

export const marketCategories = [
  { id: 'crops', name: 'Crops', nameNy: 'Zokolola' },
  { id: 'livestock', name: 'Livestock', nameNy: 'Ziweto' },
  { id: 'animal_products', name: 'Animal Products', nameNy: 'Zochokera ku Ziweto' },
  { id: 'fish', name: 'Fish & Fingerlings', nameNy: 'Nsomba' },
  { id: 'seeds', name: 'Seeds', nameNy: 'Mbewu' },
  { id: 'fertilizers', name: 'Fertilizers', nameNy: 'Feteleza' },
  { id: 'pesticides', name: 'Pesticides', nameNy: 'Mankhwala a Tizilombo' },
  { id: 'vet_products', name: 'Veterinary Products', nameNy: 'Mankhwala a Ziweto' },
  { id: 'feed', name: 'Animal Feed', nameNy: 'Chakudya cha Ziweto' },
  { id: 'tools', name: 'Tools & Equipment', nameNy: 'Zida za Ulimi' },
  { id: 'irrigation', name: 'Irrigation Tech', nameNy: 'Zida za Thira' },
  { id: 'services', name: 'Farm Services', nameNy: 'Ntchito za Ulimi' },
  { id: 'other', name: 'Other', nameNy: 'Zina' },
];

export const deliveryMethods = [
  { id: 'pickup', name: 'Self Pickup', nameNy: 'Kutenga Nokha' },
  { id: 'seller_delivery', name: 'Seller Delivery', nameNy: 'Wogulitsa Adzipereka' },
  { id: 'third_party', name: 'Third-party Transport', nameNy: 'Mayendedwe a Ena' },
];

export const tourSteps = [
  {
    title: "Welcome to FarmKit!",
    titleNy: "Takulandirani ku FarmKit!",
    content: "Your all-in-one digital companion for modern farming in Malawi.",
    contentNy: "Mnzanu wapamtima pa ulimi wamakono m'Malawi muno.",
    icon: Sprout,
    color: "bg-primary"
  },
  {
    title: "Farming Info",
    titleNy: "Zidziwitso za Ulimi",
    content: "Get expert guides on crops, pests, and organic fertilizers.",
    contentNy: "Pezani malangizo a akatswiri pa mbewu, tizilombo, ndi manyowa.",
    icon: Book,
    color: "bg-emerald-500"
  },
  {
    title: "Marketplace",
    titleNy: "Msika",
    content: "Check daily market prices and list your produce for sale.",
    contentNy: "Onani mitengo ya tsiku ndi tsiku ndipo gulitsani zokolola zanu.",
    icon: Store,
    color: "bg-amber-500"
  },
  {
    title: "Expert Knowledge",
    titleNy: "Akatswiri",
    content: "Access curated guides and verified training from NGOs and experts.",
    contentNy: "Pezani malangizo a akatswiri ndi maphunziro kuchokera ku mabungwe.",
    icon: GraduationCap,
    color: "bg-indigo-500"
  }
];

export const authenticityGuidance = {
  title: "How to Identify Genuine Pesticides",
  titleNy: "Momwe Mungadziwire Mankhwala Abwino",
  tips: [
    {
      title: "Check the Seal",
      titleNy: "Onani Chidindo",
      description: "Genuine products always have an intact, tamper-proof seal. If the seal is broken or looks glued, do not buy.",
      descriptionNy: "Mankhwala abwino amakhala ndi chidindo chomwe sichinatsegulidwe. Ngati chidindo chili chotsegula kapena chomata, musagule."
    },
    {
      title: "Verify the Label",
      titleNy: "Onani Chizindikiro",
      description: "Labels should be clear, professionally printed, and include the registration number from the Pesticides Control Board (PCB).",
      descriptionNy: "Zizindikiro ziyenera kukhala zomveka bwino ndipo zikhale ndi nambala yovomerezeka kuchokera ku bungwe la PCB."
    },
    {
      title: "Smell and Appearance",
      titleNy: "Fungo ndi Maonekedwe",
      description: "Unusual smells or strange colors in the liquid/powder can be a sign of a counterfeit product.",
      descriptionNy: "Fungo lachilendo kapena mtundu wachilendo wa mankhwala ukhoza kukhala chizindikiro cha mankhwala onyenga."
    },
    {
      title: "Price Check",
      titleNy: "Onani Mtengo",
      description: "If the price is significantly lower than the market average, it might be a fake or expired product.",
      descriptionNy: "Ngati mtengo uli wotsika kwambiri poyerekeza ndi mitengo ina, ukhoza kukhala mankhwala onyenga kapena otha ntchito."
    }
  ],
  warningSigns: [
    "Hand-written labels or missing expiration dates.",
    "Spelling errors on the packaging.",
    "Sellers who refuse to provide a receipt.",
    "Products sold in unbranded or recycled containers."
  ],
  warningSignsNy: [
    "Zizindikiro zolembedwa ndi manja kapena kusowa kwa tsiku lotha ntchito.",
    "Zolakwika pa kalembedwe pa katundu.",
    "Ogulitsa omwe akukana kupereka risiti.",
    "Mankhwala ogulitsidwa m'mabotolo omwe alibe zizindikiro kapena ogwiritsidwa ntchito kale."
  ]
};
