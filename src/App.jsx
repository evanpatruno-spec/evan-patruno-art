// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  doc, 
  getDoc,
  onSnapshot, 
  query, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { 
  Sparkles, 
  Flame, 
  Zap, 
  Gem, 
  Hammer, 
  ChevronRight, 
  ChevronLeft, 
  CheckCircle2, 
  Mail, 
  Phone, 
  MapPin, 
  Send,
  MessageSquare,
  Scissors,
  Printer,
  Camera,
  ChefHat,
  Calculator,
  History,
  Search,
  DollarSign,
  Info
} from 'lucide-react';

const Instagram = ({ size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const Facebook = ({ size = 24, ...props }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    {...props}
  >
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  </svg>
);

const portfolioItems = [
  {
    id: 1,
    title: "Table Ronde Frêne & Rivière Turquoise",
    category: "table",
    categoryName: "Table & Mobilier",
    desc: "Table ronde en frêne massif sublimée par une rivière de résine époxy turquoise. Chaque pièce de bois a été soigneusement sélectionnée pour révéler ses veines et ses nœuds uniques.",
    image: "/assets/table-ronde-turquoise.jpg",
    images: ["/assets/table-ronde-turquoise.jpg", "/assets/table-ronde-turquoise-argent.jpg", "/assets/table-ronde-noir-argent.jpg"],
    status: "custom-only",
    statusText: "Sur commande uniquement",
    price: "Sur demande",
    wood: "Frêne",
    dimensions: "Diamètre 24\" / Hauteur 20\"",
    mediums: "Résine époxy turquoise"
  },
  {
    id: 2,
    title: "Table Ronde Frêne & Turquoise/Argent",
    category: "table",
    categoryName: "Table & Mobilier",
    desc: "Table ronde de 24\" en frêne massif et résine époxy turquoise et argent métallique, offrant un contraste saisissant.",
    image: "/assets/table-ronde-turquoise-argent.jpg",
    images: ["/assets/table-ronde-turquoise-argent.jpg", "/assets/table-ronde-turquoise.jpg"],
    status: "available",
    statusText: "Disponible",
    price: "Sur demande",
    wood: "Frêne",
    dimensions: "Diamètre 24\"",
    mediums: "Résine époxy turquoise & pigments argent"
  },
  {
    id: 3,
    title: "Table Haute Ronde Frêne & Noir/Argent",
    category: "table",
    categoryName: "Table & Mobilier",
    desc: "Table ronde haute (24\" de diamètre, 30\" de hauteur) en bois de frêne naturel et résine époxy noir et argent métallique.",
    image: "/assets/table-ronde-noir-argent.jpg",
    images: ["/assets/table-ronde-noir-argent.jpg", "/assets/table-ronde-turquoise.jpg"],
    status: "available",
    statusText: "Disponible",
    price: "Sur demande",
    wood: "Frêne",
    dimensions: "Diamètre 24\" / Hauteur 30\"",
    mediums: "Résine époxy noire & pigments argent"
  },
  {
    id: 4,
    title: "Table Basse en Bois Brûlé (Shou Sugi Ban)",
    category: "table",
    categoryName: "Table & Mobilier",
    desc: "Table basse fabriquée à partir de bois de récupération, brûlé à la torche pour une finition noire délicate et moderne.",
    image: "/assets/table-basse-brulee.jpg",
    images: ["/assets/table-basse-brulee.jpg", "/assets/table-basse-chambre.jpg"],
    status: "sold",
    statusText: "Vendu",
    price: "Sur demande",
    wood: "Bois de récupération (pin/épinette)",
    dimensions: "40\" x 20\" x 18\"",
    mediums: "Bois brûlé à la torche, vernis de protection"
  },
  {
    id: 5,
    title: "Dessus de Table Basse en Frêne",
    category: "table",
    categoryName: "Table & Mobilier",
    desc: "Plateau en frêne massif destiné à une future table basse de chambre à coucher.",
    image: "/assets/table-basse-chambre.jpg",
    images: ["/assets/table-basse-chambre.jpg", "/assets/table-basse-brulee.jpg"],
    status: "custom-only",
    statusText: "Sur commande uniquement",
    price: "Sur demande",
    wood: "Frêne",
    dimensions: "36\" x 18\"",
    mediums: "Huile de finition naturelle"
  },
  {
    id: 6,
    title: "Créations de Bijoux en Bois & Résine Époxy",
    category: "jewelry",
    categoryName: "Bijoux",
    desc: "Bijoux uniques fabriqués de façon artisanale à partir de loupe de bois noble et de résine époxy teintée et polie.",
    image: "/assets/jewelry-real.jpg",
    images: ["/assets/jewelry-real.jpg", "/assets/table-ronde-turquoise-argent.jpg"],
    has3DModel: true,
    status: "custom-only",
    statusText: "Sur commande uniquement",
    price: "Sur demande",
    wood: "Loupe de bois (érable/noyer)",
    dimensions: "Tailles variées (pendentifs)",
    mediums: "Résine époxy teintée, cordons en cuir"
  },
  {
    id: 7,
    title: "Gravure Fractale Lichtenberg sur Bois",
    category: "lichtenberg",
    categoryName: "Fractale Lichtenberg",
    desc: "Brûlage fractal Lichtenberg par décharge électrique de haute tension (10 000V) sur bois.",
    image: "/assets/lichtenberg-real.jpg",
    images: ["/assets/lichtenberg-real.jpg", "/assets/table-ronde-noir-argent.jpg"],
    status: "sold",
    statusText: "Vendu",
    price: "Sur demande",
    wood: "Cèdre / Frêne",
    dimensions: "Dimensions variables",
    mediums: "Brûlage haute tension, résine de couleur"
  },
  {
    id: 8,
    title: "Toile Fluid Art - Exoplanète",
    category: "laser",
    categoryName: "Art Laser & Acrylique",
    desc: "Peinture acrylique fluide (pouring) aux textures d'écorce vivante évoquant le cosmos et le ballet de moons exoplanétaires.",
    image: "/assets/pouring-exoplanete.jpg",
    images: ["/assets/pouring-exoplanete.jpg", "/assets/fluid-art-ai.jpg"],
    status: "available",
    statusText: "Disponible",
    price: "380 $",
    wood: "Support toile sur châssis de bois",
    dimensions: "20\" x 20\"",
    mediums: "Acrylique fluide (coulée/pouring), vernis brillant"
  },
  {
    id: 9,
    title: "Toile Fluid Art - Monstre Cosmique",
    category: "laser",
    categoryName: "Art Laser & Acrylique",
    desc: "Toile pouring acrylique fusionnée à des détails d'illustration numérique créant un monstre cosmique.",
    image: "/assets/fluid-art-ai.jpg",
    images: ["/assets/fluid-art-ai.jpg", "/assets/pouring-exoplanete.jpg"],
    status: "available",
    statusText: "Disponible",
    price: "420 $",
    wood: "Support toile sur châssis de bois",
    dimensions: "24\" x 24\"",
    mediums: "Acrylique pouring, illustration numérique, technique mixte"
  }
];

const craftCapabilities = [
  { type: 'ébénisterie', name: 'Ébénisterie & Mobilier Résine', icon: '🪵', desc: 'Conception et fabrication de tables rivières haut de gamme et objets de service en bois nobles (noyer, érable, cèdre) combinés à de la résine époxy.' },
  { type: 'bijoux', name: 'Bijoux en Bois & Résine', icon: '💎', desc: 'Façonnage de pièces d\'orfèvrerie brute, pendentifs, bagues et colliers alliant l\'essence naturelle du bois à la transparence colorée de l\'époxy.' },
  { type: 'laser', name: 'Gravure & Découpe Laser 4\'x4\'', icon: '📐', desc: 'Marquage et découpe de précision grand format (jusqu\'à 4 pieds par 4 pieds) sur bois massif, acrylique et cuir pour enseignes, décors multicouches et logos.' },
  { type: 'peinture', name: 'Toiles d\'Art & Peinture Acrylique', icon: '🎨', desc: 'Création d\'œuvres abstraites et toiles Fluid Art (pouring) aux textures fluides et organiques évoquant le cosmos ou des textures minérales.' },
  { type: 'impression3d', name: 'Impression 3D Multicolore (Bambu P1S)', icon: '⚙️', desc: 'Fabrication additive haute vitesse et multicolore (jusqu\'à 4 couleurs par pièce) pour du prototypage fonctionnel, pièces de rechange ou décors personnalisés.' },
  { type: 'kumihimo', name: 'Bracelets & Tressage Kumihimo', icon: '🧶', desc: 'Tissage artisanal traditionnel japonais réalisé entièrement à la main avec des cordons en soie, coton ciré ou polyester pour des bracelets uniques.' },
  { type: 'drone', name: 'Production Média & Drone (DJI Mini 3 Pro)', icon: '🚁', desc: 'Captations aériennes haute résolution (photos 48 Mpx et vidéos 4K) pour suivis de chantiers, imagerie immobilière ou contenus artistiques.' }
];

const droneVideos = [
  { id: 1, title: "Survol de l'Atelier & Forêt Sauvage", embedUrl: "https://www.youtube.com/embed/5vP9go4Jdxs", desc: "Vidéo aérienne cinématique capturant les grands espaces sauvages d'où proviennent nos essences de bois nobles." },
  { id: 2, title: "Suivi de Chantier & Intégration Paysagère", embedUrl: "https://www.youtube.com/embed/1nf61dNdzPc", desc: "Démonstration d'imagerie drone DJI Mini 3 Pro pour le suivi d'une structure architecturale en bois massif." },
  { id: 3, title: "L'Art sous un Autre Angle (Perspective vertical)", embedUrl: "https://www.youtube.com/embed/gS0N_W6-QeA", desc: "Vidéo artistique montrant le contraste entre le bois brut et la rivière d'époxy sous perspective aérienne." }
];

const faqItems = [
  { category: "general", question: "Quels sont les délais de fabrication pour un projet sur mesure ?", answer: "Les délais varient selon la complexité : environ 4 à 8 semaines pour une table rivière (séchage, coulée et finition), 2 semaines pour des découpes/gravures laser personnalisées, et 3 à 5 jours pour des pièces imprimées en 3D standard." },
  { category: "wood", question: "Quelles essences de bois utilisez-vous pour vos tables ?", answer: "Nous travaillons principalement avec des bois locaux d'une grande noblesse : le Noyer noir (sombre et veiné), l'Érable (très clair et dense), le Cerisier (ambré) et le Cèdre (chaud, odorant et résistant à l'humidité)." },
  { category: "wood", question: "La résine époxy est-elle résistante à la chaleur et aux rayures ?", answer: "Nos résines sont traitées contre les rayons UV (jaunissement) et reçoivent un vernis de protection haute résistance. Cependant, pour préserver la brillance, il est fortement recommandé d'utiliser des sous-plats pour les plats chauds et d'éviter les rayures directes avec des objets tranchants." },
  { category: "3dprint", question: "Quels sont les formats de fichiers acceptés pour l'impression 3D ?", answer: "Nous acceptons principalement les fichiers de modèles 3D au format .STL, .OBJ ou .3MF. Vous pouvez téléverser votre fichier directement lors de votre demande de devis ou coller un lien Thingiverse/Printables." },
  { category: "3dprint", question: "Quels matériaux de filaments utilisez-vous sur votre Bambu P1S ?", answer: "Nous imprimons principalement en PLA (biodégradable, parfait pour la décoration et le multi-couleurs), en PETG (plus résistant, idéal pour l'extérieur) et en TPU (flexible et caoutchouteux)." },
  { category: "laser", question: "Quelle est la taille maximale pour les gravures et découpes laser ?", answer: "Notre équipement laser professionnel dispose d'une surface de travail maximale de 4 pieds par 4 pieds (48\" x 48\"). Nous pouvons graver ou découper le bois massif, le contreplaqué, l'acrylique (plexiglas) et le cuir." },
  { category: "drone", question: "Quelles sont les réglementations respectées lors de vos vols de drone ?", answer: "Nos opérations de drone DJI Mini 3 Pro respectent scrupuleusement la réglementation de Transports Canada pour les drones de moins de 250g. Les vols sont effectués en toute sécurité, hors des zones de restriction aérienne et dans le respect de la vie privée." }
];

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [currency, setCurrency] = useState('CAD');
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const formatPrice = (priceStr) => {
    if (!priceStr || priceStr.toLowerCase().includes('demande')) {
      return priceStr;
    }
    const match = priceStr.replace(/\s/g, '').match(/\d+/);
    if (!match) return priceStr;
    const amountCAD = parseFloat(match[0]);
    
    let rate = 1;
    let symbol = ' $ CAD';
    if (currency === 'USD') {
      rate = 0.74;
      symbol = ' $ USD';
    } else if (currency === 'EUR') {
      rate = 0.68;
      symbol = ' €';
    }
    
    const converted = Math.round(amountCAD * rate);
    return `${converted.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}${symbol}`;
  };
  
  // Dynamic Creations List State - initialized with fallback portfolioItems
  const [creations, setCreations] = useState(portfolioItems);

  // Wood price mapping per board foot
  const woodPriceMapping = {
    'Noyer noir (Foncé, grain riche)': 14,
    'Érable (Clair, très robuste)': 9,
    'Cèdre (Chaud, excellent parfum, résistant)': 7,
    'Cerisier (Ambré, grain fin)': 10,
    'Autre / Je ne sais pas encore': 9
  };

  // Admin Dashboard States
  const [isAdminVisible, setIsAdminVisible] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');
  const [editingCreation, setEditingCreation] = useState(null);
  const [adminForm, setAdminForm] = useState({
    title: '',
    category: 'table',
    desc: '',
    price: '',
    status: 'available',
    image: '',
    wood: '',
    dimensions: '',
    mediums: ''
  });

  // Admin Pricing Calculator & References States
  const [adminActiveTab, setAdminActiveTab] = useState('boutique'); // 'boutique', 'calculator', 'feed'
  const [savedEstimates, setSavedEstimates] = useState([]);
  const [calcForm, setCalcForm] = useState({
    title: '',
    category: 'board',
    woodSpecies: 'Noyer noir (Foncé, grain riche)',
    length: '18',
    width: '12',
    thickness: '1',
    epoxyPercent: '15',
    laborHours: '4',
    hourlyRate: '40',
    woodCostPerBF: '14',
    epoxyCostPerL: '28',
    finishingCost: '20',
    marginMultiplier: '1.4',
    notes: ''
  });
  const [estimateSearch, setEstimateSearch] = useState('');
  const [estimateCategoryFilter, setEstimateCategoryFilter] = useState('all');
  const [selectedEstimateDetail, setSelectedEstimateDetail] = useState(null);
  const [adminHistorySearch, setAdminHistorySearch] = useState('');
  const [adminHistoryTab, setAdminHistoryTab] = useState('all'); // 'all', 'devis', 'orders'

  // Custom Project Builder State
  const [devisActiveTab, setDevisActiveTab] = useState('configurator'); // 'configurator', 'history'
  const [devisHistorySearch, setDevisHistorySearch] = useState('');
  const [devisHistoryFilter, setDevisHistoryFilter] = useState('all');
  const [builderStep, setBuilderStep] = useState(1);
  const [projectData, setProjectData] = useState({
    type: '',
    wood: '',
    epoxy: '',
    legs: '',
    dimensions: '',
    notes: '',
    name: '',
    email: '',
    phone: '',
    fileBase64: '',
    fileName: '',
    fileSize: '',
    cloudLink: '',
    presetSize: '',
    length: '',
    width: '',
    thickness: ''
  });
  const [builderSubmitted, setBuilderSubmitted] = useState(false);

  // Simple Contact Form State
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactData, setContactData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  // Premium Features States
  const [pigmentTab, setPigmentTab] = useState('all');
  const [activeAccordion, setActiveAccordion] = useState(null);
  
  // Checkout Modal State
  const [checkoutItem, setCheckoutItem] = useState(null);
  const [selectedItemDetails, setSelectedItemDetails] = useState(null);
  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [view3DActive, setView3DActive] = useState(false);
  const [currentReviews, setCurrentReviews] = useState([]);
  const [newReviewName, setNewReviewName] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewComment, setNewReviewComment] = useState('');
  const [purchaseCertificate, setPurchaseCertificate] = useState(null);
  
  const [checkoutForm, setCheckoutForm] = useState({
    name: '',
    email: '',
    address: '',
    city: '',
    zip: '',
    cardNumber: '',
    expiry: '',
    cvc: ''
  });
  const [checkoutSubmitting, setCheckoutSubmitting] = useState(false);
  
  // Admin Activity Log State
  const [activityFeed, setActivityFeed] = useState([]);

  // Chatbot State
  const [chatbotOpen, setChatbotOpen] = useState(false);
  const [chatbotWidgetActive, setChatbotWidgetActive] = useState(false);
  const [chatMessages, setChatMessages] = useState([]);
  const [chatbotStep, setChatbotStep] = useState(0);
  const [chatbotAnswers, setChatbotAnswers] = useState({});
  const [chatbotInputVisible, setChatbotInputVisible] = useState(false);
  const [chatbotInputValue, setChatbotInputValue] = useState('');

  // Order Tracking States
  const [trackingOrderId, setTrackingOrderId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackingError, setTrackingError] = useState('');
  
  // Searchable FAQ States
  const [faqSearchQuery, setFaqSearchQuery] = useState('');
  const [faqActiveCategory, setFaqActiveCategory] = useState('all');
  const [faqActiveAccordion, setFaqActiveAccordion] = useState(null);

  // Track scroll position to add class to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fetch reviews when selectedItemDetails changes
  useEffect(() => {
    if (!db || !selectedItemDetails) {
      setCurrentReviews([]);
      return;
    }
    
    // Reset index & view states
    setActiveImageIdx(0);
    setView3DActive(false);

    const q = query(
      collection(db, 'reviews'),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const allReviews = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      const filtered = allReviews.filter(r => r.creationId === selectedItemDetails.id);
      setCurrentReviews(filtered);
    }, (err) => {
      console.error("Err reading reviews:", err);
    });

    return () => unsubscribe();
  }, [selectedItemDetails]);

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    if (!newReviewName.trim() || !newReviewComment.trim()) {
      alert("Veuillez remplir votre nom et votre commentaire.");
      return;
    }
    if (!db) return;
    try {
      await addDoc(collection(db, 'reviews'), {
        creationId: selectedItemDetails.id,
        name: newReviewName.trim(),
        rating: newReviewRating,
        comment: newReviewComment.trim(),
        createdAt: serverTimestamp()
      });
      setNewReviewName('');
      setNewReviewComment('');
      setNewReviewRating(5);
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Une erreur est survenue lors de l'enregistrement de l'avis.");
    }
  };

  const instagramPosts = [
    {
      id: 1,
      image: "/assets/sunset-montreal.jpg",
      postUrl: "https://www.instagram.com/evanpatruno.art/reel/DZtvKL9NNhm/",
      caption: "Le soleil s'étire et doucement décline... 🌅",
      likes: "142",
      comments: "12"
    },
    {
      id: 2,
      image: "/assets/mauricie-landscape.jpg",
      postUrl: "https://www.instagram.com/evanpatruno.art/p/DZnLQAslieN/",
      caption: "Une virée en Mauricie à capturer les contrastes sauvages... 🌲",
      likes: "89",
      comments: "5"
    },
    {
      id: 3,
      image: "/assets/pouring-exoplanete.jpg",
      postUrl: "https://www.instagram.com/evanpatruno.art/p/DZDzSU2hZkc/",
      caption: "Une coulée de matière... Toile Exoplanète 🌌",
      likes: "155",
      comments: "18"
    },
    {
      id: 4,
      image: "/assets/fluid-art-ai.jpg",
      postUrl: "https://www.instagram.com/evanpatruno.art/p/DY8P9DuNtc8/",
      caption: "Toiles pouring/abstraites et monstre cosmique 🎨",
      likes: "178",
      comments: "14"
    },
    {
      id: 5,
      image: "/assets/jewelry-real.jpg",
      postUrl: "https://www.instagram.com/evanpatruno.art/p/DRIowfnAbMa/",
      caption: "Créations uniques : bijoux en bois et résine époxy 🪵✨",
      likes: "115",
      comments: "9"
    },
    {
      id: 6,
      image: "/assets/table-ronde-turquoise.jpg",
      postUrl: "https://www.instagram.com/evanpatruno.art/p/DOQsJAfDQv-/",
      caption: "Table ronde en frêne & résine époxy turquoise 🌊",
      likes: "135",
      comments: "16"
    }
  ];

  // Load data from Firestore or fallback to mock
  useEffect(() => {
    if (!db) {
      setCreations(portfolioItems);
      return;
    }

    const q = query(collection(db, 'creations'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetched = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      if (fetched.length === 0) {
        setCreations(portfolioItems);
      } else {
        setCreations(fetched);
      }
    }, (error) => {
      console.error("Erreur lors de la récupération Firestore :", error);
      setCreations(portfolioItems);
    });

    // Fetch saved estimates publicly on mount
    const unsubEstimates = onSnapshot(collection(db, 'saved_estimates'), (snap) => {
      const ests = snap.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      setSavedEstimates(ests.sort((a, b) => b.date - a.date));
    }, (err) => {
      console.error("Err feed estimates:", err);
    });

    return () => {
      unsubscribe();
      unsubEstimates();
    };
  }, []);

  // Fetch orders, projects, inquiries, chatbot leads for Admin Activity Feed
  useEffect(() => {
    if (!db || !isAdminLoggedIn) return;

    const feedMap = { orders: [], projects: [], inquiries: [], chatbot: [] };
    const updateFeed = (key, data) => {
      feedMap[key] = data;
      const combined = [
        ...feedMap.orders,
        ...feedMap.projects,
        ...feedMap.inquiries,
        ...feedMap.chatbot
      ].sort((a, b) => b.date - a.date);
      setActivityFeed(combined);
    };

    const unsubOrders = onSnapshot(collection(db, 'orders'), (snap) => {
      const o = snap.docs.map(doc => ({
        id: doc.id,
        type: 'order',
        title: 'Nouvelle commande d\'art',
        details: `${doc.data().customerName} (${doc.data().customerEmail}) a commandé "${doc.data().creationTitle}" pour ${doc.data().convertedPrice || doc.data().priceCAD}`,
        status: doc.data().status || 'received',
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      updateFeed('orders', o);
    }, (err) => console.error("Err feed orders:", err));

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const p = snap.docs.map(doc => ({
        id: doc.id,
        type: 'project',
        title: 'Nouveau projet sur mesure (devis)',
        details: `${doc.data().name || 'Anonyme'} (${doc.data().email || 'pas de courriel'}) veut un projet de type "${doc.data().type}" en ${doc.data().wood || 'bois non spécifié'}, résine: ${doc.data().epoxy || 'non spécifié'}, piétement: ${doc.data().legs || 'non spécifié'}. Notes: ${doc.data().notes || 'aucune'}${doc.data().estimatedPrice ? ` [Est: ${doc.data().estimatedPrice}]` : ''}`,
        fileBase64: doc.data().fileBase64 || '',
        fileName: doc.data().fileName || '',
        fileSize: doc.data().fileSize || '',
        cloudLink: doc.data().cloudLink || '',
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      updateFeed('projects', p);
    }, (err) => console.error("Err feed projects:", err));

    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snap) => {
      const i = snap.docs.map(doc => ({
        id: doc.id,
        type: 'inquiry',
        title: 'Nouveau message de contact',
        details: `${doc.data().name || 'Nom non spécifié'} (${doc.data().email || 'pas de courriel'}) : Sujet: "${doc.data().subject}". Message: "${doc.data().message}"`,
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      updateFeed('inquiries', i);
    }, (err) => console.error("Err feed inquiries:", err));

    const unsubChatbot = onSnapshot(collection(db, 'chatbot_leads'), (snap) => {
      const c = snap.docs.map(doc => ({
        id: doc.id,
        type: 'chatbot',
        title: 'Lead qualifié par le Chatbot',
        details: `${doc.data().name || 'Anonyme'} (${doc.data().contact || 'pas de contact'}) est intéressé par "${doc.data().project || 'un projet'}", bois: ${doc.data().wood_detail || 'non spécifié'}, délai: ${doc.data().delay || 'non spécifié'}`,
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      updateFeed('chatbot', c);
    }, (err) => console.error("Err feed chatbot:", err));

    return () => {
      unsubOrders();
      unsubProjects();
      unsubInquiries();
      unsubChatbot();
    };
  }, [isAdminLoggedIn]);

  // Set mock saved estimates if firebase is absent (fallback for local mock mode)
  useEffect(() => {
    if (!db && savedEstimates.length === 0) {
      setSavedEstimates([
        {
          id: 'mock-est-1',
          title: "Planche apéro en noyer pour Sophie",
          category: "board",
          woodSpecies: "Noyer noir (Foncé, grain riche)",
          dimensions: "10\" x 14\" x 0.75\"",
          length: 14,
          width: 10,
          thickness: 0.75,
          woodCost: 18,
          epoxyVolume: 0.35,
          epoxyCost: 10,
          laborHours: 4,
          laborCost: 160,
          otherCosts: 15,
          margin: 1.4,
          finalPrice: 284,
          notes: "Poignées intégrées et gravure au laser d'un logo de famille.",
          date: new Date(Date.now() - 3600000 * 24 * 3)
        },
        {
          id: 'mock-est-2',
          title: "Table rivière en érable pour Tremblay",
          category: "table",
          woodSpecies: "Érable (Clair, très robuste)",
          dimensions: "36\" x 72\" x 1.75\"",
          length: 72,
          width: 36,
          thickness: 1.75,
          woodCost: 350,
          epoxyVolume: 12.5,
          epoxyCost: 350,
          laborHours: 25,
          laborCost: 1000,
          otherCosts: 120,
          margin: 1.4,
          finalPrice: 2548,
          notes: "Pieds en X, rivière bleu océan translucide.",
          date: new Date(Date.now() - 3600000 * 24 * 10)
        },
        {
          id: 'mock-est-3',
          title: "Planche charcuterie géante - Le Cargo",
          category: "board",
          woodSpecies: "Cerisier (Ambré, grain fin)",
          dimensions: "18\" x 36\" x 1.25\"",
          length: 36,
          width: 18,
          thickness: 1.25,
          woodCost: 75,
          epoxyVolume: 1.8,
          epoxyCost: 50,
          laborHours: 6,
          laborCost: 240,
          otherCosts: 25,
          margin: 1.3,
          finalPrice: 507,
          notes: "Série de 3 planches pour le service du bar à vin.",
          date: new Date(Date.now() - 3600000 * 24 * 15)
        }
      ]);
    }
  }, [db]);

  const handleAdminLogin = (e) => {
    e.preventDefault();
    const envPassword = import.meta.env.VITE_ADMIN_PASSWORD || "admin123";
    if (adminPassword === envPassword) {
      setIsAdminLoggedIn(true);
      setIsAdminVisible(false);
      setAdminError('');
      setAdminPassword('');
      setTimeout(() => {
        document.getElementById('admin-dashboard')?.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    } else {
      setAdminError("Mot de passe incorrect");
    }
  };

  const handleSaveCreation = async (e) => {
    e.preventDefault();
    if (!db) {
      alert("Firebase n'est pas configuré. Impossible d'enregistrer.");
      return;
    }

    const mappingCategoryName = {
      table: "Table & Mobilier",
      jewelry: "Bijoux",
      lichtenberg: "Fractale Lichtenberg",
      laser: "Art Laser & Acrylique"
    };

    const mappingStatusText = {
      available: "Disponible",
      sold: "Vendu (Sur commande)",
      'custom-only': "Sur commande uniquement"
    };

    const newDoc = {
      title: adminForm.title,
      category: adminForm.category,
      categoryName: mappingCategoryName[adminForm.category] || "Art",
      desc: adminForm.desc,
      price: adminForm.price,
      status: adminForm.status,
      statusText: mappingStatusText[adminForm.status] || "Disponible",
      image: adminForm.image.startsWith('/') ? adminForm.image : `/assets/${adminForm.image}`,
      wood: adminForm.wood || '',
      dimensions: adminForm.dimensions || '',
      mediums: adminForm.mediums || ''
    };

    try {
      if (editingCreation) {
        const docRef = doc(db, 'creations', String(editingCreation.id));
        await setDoc(docRef, newDoc, { merge: true });
      } else {
        await addDoc(collection(db, 'creations'), {
          ...newDoc,
          createdAt: serverTimestamp()
        });
      }
      setAdminForm({
        title: '',
        category: 'table',
        desc: '',
        price: '',
        status: 'available',
        image: '',
        wood: '',
        dimensions: '',
        mediums: ''
      });
      setEditingCreation(null);
      alert("Œuvre enregistrée avec succès !");
    } catch (error) {
      console.error("Erreur lors de l'enregistrement :", error);
      alert("Erreur lors de l'enregistrement dans la base de données.");
    }
  };

  const handleSelectEdit = (item) => {
    setEditingCreation(item);
    let cleanImage = item.image || '';
    if (cleanImage.startsWith('/assets/')) {
      cleanImage = cleanImage.replace('/assets/', '');
    }
    setAdminForm({
      title: item.title,
      category: item.category,
      desc: item.desc,
      price: item.price,
      status: item.status,
      image: cleanImage,
      wood: item.wood || '',
      dimensions: item.dimensions || '',
      mediums: item.mediums || ''
    });
  };

  const handleDeleteCreation = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette création ?")) return;
    
    // Update local state immediately so it's responsive and works in mock/offline mode
    setCreations(prev => prev.filter(item => item.id !== id));

    if (!db) {
      alert("Œuvre supprimée localement.");
      return;
    }
    try {
      // Cast the ID to a string to prevent Firestore type errors (e.g. for numeric fallback IDs)
      await deleteDoc(doc(db, 'creations', String(id)));
      alert("Œuvre supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression :", error);
      alert("Erreur lors de la suppression dans la base de données.");
    }
  };

  const filteredPortfolio = galleryFilter === 'all' 
    ? creations 
    : galleryFilter === 'sold'
      ? creations.filter(item => item.status === 'sold')
      : creations.filter(item => item.category === galleryFilter);

  // Custom Builder Next/Prev handlers
  const handleNextStep = () => {
    if (builderStep < 4) setBuilderStep(prev => prev + 1);
  };

  const handlePrevStep = () => {
    if (builderStep > 1) setBuilderStep(prev => prev - 1);
  };

  const selectProjectType = (type) => {
    setProjectData(prev => ({ ...prev, type }));
    handleNextStep();
  };

  const selectWoodType = (wood) => {
    setProjectData(prev => ({ ...prev, wood }));
    handleNextStep();
  };

  const selectEpoxyColor = (epoxy) => {
    setProjectData(prev => ({ ...prev, epoxy }));
    handleNextStep();
  };

  const handleSelectPreset = (preset, dims) => {
    let parsed = {};
    if (dims !== 'custom') {
      const cleanDims = dims.replace(/"/g, '');
      const parts = cleanDims.split(' x ');
      if (parts.length === 3) {
        parsed = {
          length: parseFloat(parts[0]) || '',
          width: parseFloat(parts[1]) || '',
          thickness: parseFloat(parts[2]) || ''
        };
      }
    }
    setProjectData(prev => {
      const l = dims === 'custom' ? (prev.length || '') : (parsed.length || '');
      const w = dims === 'custom' ? (prev.width || '') : (parsed.width || '');
      const t = dims === 'custom' ? (prev.thickness || '') : (parsed.thickness || '');
      return {
        ...prev,
        presetSize: preset,
        dimensions: dims === 'custom' ? `${l}" x ${w}" x ${t}"` : dims,
        length: l,
        width: w,
        thickness: t
      };
    });
  };

  const handleCustomDimensionChange = (field, value) => {
    setProjectData(prev => {
      const updated = { ...prev, [field]: value };
      const l = updated.length || '0';
      const w = updated.width || '0';
      const t = updated.thickness || '0';
      updated.dimensions = `${l}" x ${w}" x ${t}"`;
      return updated;
    });
  };

  const calculateLiveEstimate = (data) => {
    if (!data.type) return null;
    
    // Non-wood/epoxy projects simple pricing fallbacks
    if (data.type === 'Bijou en bois/époxy') return { min: 45, max: 95 };
    if (data.type === 'Fractale de Lichtenberg') return { min: 140, max: 280 };
    if (data.type === 'Découpe & Gravure laser') return { min: 60, max: 220 };
    if (data.type === 'Impression 3D') return { min: 25, max: 150 };
    if (data.type === 'Bracelet Kumihimo') return { min: 20, max: 45 };
    if (data.type === 'Photo/Vidéo Drone') return { min: 180, max: 450 };

    // Wood & Epoxy projects calculations (Tables and Presentation boards)
    let length = parseFloat(data.length);
    let width = parseFloat(data.width);
    let thickness = parseFloat(data.thickness);

    // Fallback if dimensions aren't fully specified
    if (isNaN(length) || isNaN(width) || isNaN(thickness) || length <= 0 || width <= 0 || thickness <= 0) {
      if (data.type === 'Planche de présentation') {
        return { min: 120, max: 290 }; // generic range for presentation board
      }
      if (data.type === 'Table rivière') {
        return { min: 1200, max: 3200 }; // generic range for table
      }
      return null;
    }

    // Wood price factor
    let bfPrice = 9; // average/default
    if (data.wood) {
      if (data.wood.includes('Noyer')) bfPrice = 14;
      else if (data.wood.includes('Érable')) bfPrice = 9;
      else if (data.wood.includes('Cèdre')) bfPrice = 7;
      else if (data.wood.includes('Cerisier')) bfPrice = 10;
    }

    // Epoxy inclusion factor
    let hasEpoxy = data.epoxy && !data.epoxy.includes("Sans résine") && !data.epoxy.includes("Pas d'époxy");
    let epoxyFraction = 0;
    if (hasEpoxy) {
      epoxyFraction = data.type === 'Table rivière' ? 0.30 : 0.15;
    }

    // Calculations
    const totalVolume = length * width * thickness;
    const woodBF = (totalVolume * (1 - epoxyFraction)) / 12;
    const woodCost = woodBF * bfPrice;

    let epoxyCost = 0;
    if (hasEpoxy) {
      const epoxyVolumeLiters = totalVolume * epoxyFraction * 0.0163871;
      epoxyCost = epoxyVolumeLiters * 28; // $28 per liter
    }

    // Labor hours estimate
    let laborHours = 0;
    if (data.type === 'Planche de présentation') {
      laborHours = length > 20 ? 6 : 4;
    } else if (data.type === 'Table rivière') {
      laborHours = length > 60 ? 30 : 20;
    }
    const laborCost = laborHours * 40; // $40 per hour

    // Piétement (legs) for tables
    let legsCost = 0;
    if (data.type === 'Table rivière' && data.legs) {
      if (data.legs.includes('X')) legsCost = 130;
      else if (data.legs.includes('Trapèze') || data.legs.includes('H')) legsCost = 150;
      else if (data.legs.includes('Épingle')) legsCost = 80;
      else if (data.legs.includes('Mikado') || data.legs.includes('Araignée')) legsCost = 250;
    }

    const finishingCost = data.type === 'Table rivière' ? 100 : 20;

    const baseCost = woodCost + epoxyCost + laborCost + legsCost + finishingCost;
    const retailPrice = baseCost * 1.4; // 1.4x markup

    // Return a realistic range (+/- 10%)
    const min = Math.round(retailPrice * 0.9);
    const max = Math.round(retailPrice * 1.1);
    
    return { min, max, woodBF: woodBF.toFixed(1), epoxyLiters: (totalVolume * epoxyFraction * 0.0163871).toFixed(2) };
  };

  const handleSaveEstimate = async (e) => {
    e.preventDefault();
    
    // Calculate final price mathematically
    const length = parseFloat(calcForm.length) || 0;
    const width = parseFloat(calcForm.width) || 0;
    const thickness = parseFloat(calcForm.thickness) || 0;
    const epoxyPercent = parseFloat(calcForm.epoxyPercent) || 0;
    const laborHours = parseFloat(calcForm.laborHours) || 0;
    const hourlyRate = parseFloat(calcForm.hourlyRate) || 40;
    const woodCostPerBF = parseFloat(calcForm.woodCostPerBF) || 0;
    const epoxyCostPerL = parseFloat(calcForm.epoxyCostPerL) || 0;
    const finishingCost = parseFloat(calcForm.finishingCost) || 20;
    const marginMultiplier = parseFloat(calcForm.marginMultiplier) || 1.4;

    const totalVolume = length * width * thickness;
    const epoxyFraction = epoxyPercent / 100;
    const woodBF = (totalVolume * (1 - epoxyFraction)) / 12;
    const woodCost = woodBF * woodCostPerBF;
    const epoxyVolumeLiters = totalVolume * epoxyFraction * 0.0163871;
    const epoxyCost = epoxyVolumeLiters * epoxyCostPerL;
    const laborCost = laborHours * hourlyRate;
    const baseCost = woodCost + epoxyCost + laborCost + finishingCost;
    const finalPrice = Math.round(baseCost * marginMultiplier);

    const estimateData = {
      title: calcForm.title || `Simulation ${calcForm.category === 'board' ? 'Planche' : 'Table'} ${new Date().toLocaleDateString('fr-CA')}`,
      category: calcForm.category,
      woodSpecies: calcForm.woodSpecies,
      dimensions: `${length}" x ${width}" x ${thickness}"`,
      length,
      width,
      thickness,
      woodCost: Math.round(woodCost),
      epoxyVolume: parseFloat(epoxyVolumeLiters.toFixed(2)),
      epoxyCost: Math.round(epoxyCost),
      laborHours,
      laborCost: Math.round(laborCost),
      otherCosts: Math.round(finishingCost),
      margin: marginMultiplier,
      finalPrice,
      notes: calcForm.notes
    };

    if (db) {
      try {
        await addDoc(collection(db, 'saved_estimates'), {
          ...estimateData,
          createdAt: serverTimestamp()
        });
        alert("Simulation enregistrée avec succès comme référence !");
      } catch (err) {
        console.error("Erreur lors de l'enregistrement de l'estimation :", err);
        alert("Erreur lors de l'enregistrement dans Firestore.");
      }
    } else {
      const newEst = {
        id: 'mock-est-' + Date.now(),
        ...estimateData,
        date: new Date()
      };
      setSavedEstimates(prev => [newEst, ...prev]);
      alert("Firebase n'est pas configuré. L'estimation a été enregistrée en mode local (mémoire).");
    }

    setCalcForm(prev => ({
      ...prev,
      title: '',
      notes: ''
    }));
  };

  const handleDeleteEstimate = async (id) => {
    if (!window.confirm("Êtes-vous sûr de vouloir supprimer cette simulation ?")) return;
    
    setSavedEstimates(prev => prev.filter(item => item.id !== id));
    
    if (!db) {
      alert("Simulation supprimée localement.");
      return;
    }
    
    try {
      await deleteDoc(doc(db, 'saved_estimates', String(id)));
      alert("Simulation supprimée avec succès !");
    } catch (error) {
      console.error("Erreur lors de la suppression de l'estimation :", error);
      alert("Erreur de suppression dans Firestore.");
    }
  };

  const handleBuilderSubmit = async (e) => {
    e.preventDefault();
    
    const est = calculateLiveEstimate(projectData);
    const calculatedPrice = est ? `${est.min} $ - ${est.max} $ CAD` : 'Sur demande';

    if (db) {
      try {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          estimatedPrice: calculatedPrice,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Erreur lors de la soumission du projet :", err);
      }
    }

    // Envoi de la notification par courriel à evan.patruno@gmail.com via FormSubmit
    const emailPayload = {
      _subject: `Nouveau devis reçu - ${projectData.type || 'Projet sur mesure'}`,
      Nom: projectData.name || 'Anonyme',
      Courriel: projectData.email || 'Pas de courriel',
      Téléphone: projectData.phone || 'Pas de téléphone',
      Type: projectData.type || 'Non spécifié',
      Bois: projectData.wood || 'Non spécifié',
      Époxy: projectData.epoxy || 'Non spécifié',
      Piétement: projectData.legs || 'Non spécifié',
      Dimensions: projectData.dimensions || 'Non spécifié',
      Estimation: calculatedPrice,
      Notes: projectData.notes || 'Aucune',
      Fichier: projectData.fileName ? `${projectData.fileName} (${projectData.fileSize})` : 'Aucun',
      Lien_Conception: projectData.cloudLink || 'Aucun'
    };

    fetch("https://formsubmit.co/ajax/evan.patruno@gmail.com", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(emailPayload)
    }).catch(err => console.error("Erreur lors de l'envoi de l'email :", err));

    setBuilderSubmitted(true);
  };

  const handleContactSubmit = async (e) => {
    e.preventDefault();
    if (db) {
      try {
        await addDoc(collection(db, 'inquiries'), {
          ...contactData,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Erreur lors de l'envoi du message :", err);
      }
    }
    setContactSubmitted(true);
  };

  const handleStartCheckout = (item) => {
    setCheckoutItem(item);
    setCheckoutForm({
      name: '',
      email: '',
      address: '',
      city: '',
      zip: '',
      cardNumber: '',
      expiry: '',
      cvc: ''
    });
  };

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    setCheckoutSubmitting(true);
    
    // Simuler le délai de paiement Stripe
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    let docId = "EPA-" + Math.floor(Math.random() * 900000 + 100000);
    if (db) {
      try {
        const docRef = await addDoc(collection(db, 'orders'), {
          creationId: checkoutItem.id,
          creationTitle: checkoutItem.title,
          priceCAD: checkoutItem.price,
          currency: currency,
          convertedPrice: formatPrice(checkoutItem.price),
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          customerAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zip}`,
          status: 'received',
          createdAt: serverTimestamp()
        });
        docId = docRef.id;
      } catch (err) {
        console.error("Erreur lors de la sauvegarde de la commande :", err);
      }
    }
    
    const orderData = {
      orderId: docId,
      creationTitle: checkoutItem.title,
      priceCAD: checkoutItem.price,
      customerName: checkoutForm.name,
      customerEmail: checkoutForm.email,
      customerAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zip}`,
      wood: checkoutItem.wood || "N/A",
      dimensions: checkoutItem.dimensions || "N/A",
      mediums: checkoutItem.mediums || "N/A",
      date: new Date().toLocaleDateString('fr-FR')
    };

    setCheckoutSubmitting(false);
    setPurchaseCertificate(orderData);
    setCheckoutItem(null);
  };

  const handleTrackOrder = async (e) => {
    e.preventDefault();
    if (!trackingOrderId.trim()) {
      setTrackingError("Veuillez saisir un numéro de commande.");
      return;
    }
    setTrackingError("");
    setTrackedOrder(null);
    try {
      const docRef = doc(db, "orders", trackingOrderId.trim());
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        setTrackedOrder({ id: docSnap.id, ...docSnap.data() });
      } else {
        setTrackingError("Aucune commande trouvée avec cet identifiant. Vérifiez le format (ex: 2cT9...)");
      }
    } catch (err) {
      console.error("Error fetching order status:", err);
      setTrackingError("Une erreur est survenue lors de la recherche. Veuillez réessayer.");
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    if (!db) return;
    try {
      await setDoc(doc(db, 'orders', orderId), { status: newStatus }, { merge: true });
      alert("✅ Statut de la commande mis à jour avec succès !");
    } catch (err) {
      console.error("Erreur lors de la mise à jour du statut :", err);
      alert("Une erreur est survenue lors de la mise à jour.");
    }
  };

  const resetBuilder = () => {
    setBuilderStep(1);
    setProjectData({
      type: '',
      wood: '',
      epoxy: '',
      legs: '',
      dimensions: '',
      notes: '',
      name: '',
      email: '',
      phone: '',
      fileBase64: '',
      fileName: '',
      fileSize: '',
      cloudLink: ''
    });
    setBuilderSubmitted(false);
  };

  // Qualificateur Chatbot Config
  const contextQuestions = {
    '🪵 Table sur mesure': { key: 'wood_detail', msg: '🌲 Quelle essence de bois préférez-vous ?', choices: ['Noyer noir', 'Frêne massif', 'Cèdre sauvage', 'Pas de préférence'] },
    '💎 Bijou unique': { key: 'jewelry_type', msg: '💍 Quel type de bijou recherchez-vous ?', choices: ['Pendentif', 'Bague', 'Boucles d\'oreilles', 'Sur-mesure'] },
    '⚡ Laser & Lichtenberg': { key: 'laser_type', msg: '⚡ Quel type de travail souhaitez-vous ?', choices: ['Gravure Laser 4\'x4\'', 'Découpe de mandalas/logos', 'Fractale de Lichtenberg'] },
    '🎨 Peinture & Toiles': { key: 'art_notes', msg: '🖌️ Quel format de toile ou style recherchez-vous ?', choices: ['Toile Fluid Art (Pouring)', 'Peinture abstraite', 'Autre format'] },
    '⚙️ Impression 3D': { key: 'print3d_type', msg: '⚙️ Quel type d\'impression 3D souhaitez-vous réaliser sur la Bambu P1S ?', choices: ['Figurine / Déco multi-couleurs', 'Prototypage mécanique / Boîtier', 'Autre pièce sur mesure'] },
    '🧶 Bracelet Kumihimo': { key: 'kumihimo_style', msg: '🧶 Quel style de tressage ou couleur préférez-vous ?', choices: ['Tons chauds (Rouge/Or)', 'Tons froids (Bleu/Argent)', 'Autre préférence'] },
    '🚁 Vidéo / Photo Drone': { key: 'drone_job', msg: '🚁 Quel type de prestation drone désirez-vous (DJI Mini 3 Pro) ?', choices: ['Photo Immobilière', 'Suivi de chantier / Paysage', 'Vidéo événementielle'] }
  };

  const chatbotFlow = [
    { key: 'project', msg: '👋 Bonjour ! Je suis l\'assistant virtuel d\'Evan Patruno Art. Quel est votre projet ?', choices: ['🪵 Table sur mesure', '💎 Bijou unique', '⚡ Laser & Lichtenberg', '🎨 Peinture & Toiles', '⚙️ Impression 3D', '🧶 Bracelet Kumihimo', '🚁 Vidéo / Photo Drone'] },
    { key: 'delay', msg: 'Parfait ! Dans quel délai souhaitez-vous concrétiser ce projet ?', choices: ['🔥 Rapidement (0-3 mois)', '📅 Moyen terme (3-6 mois)', '🔭 Je planifie pour plus tard'] },
    { key: 'name', msg: '😊 Super ! Pour personnaliser votre demande, quel est votre prénom ?', input: true, placeholder: 'Votre prénom...' },
    { key: 'contact', msg: 'Comment peut-on vous contacter (courriel ou téléphone) ?', input: true, placeholder: 'Téléphone ou courriel...' }
  ];

  const handleOpenChatbot = () => {
    setChatbotOpen(true);
    setChatbotWidgetActive(false);
    if (chatMessages.length === 0) {
      setChatMessages([
        { sender: 'bot', text: '👋 Bonjour ! Je suis l\'assistant virtuel d\'Evan Patruno Art. Quel est votre projet ?', choices: ['🪵 Table sur mesure', '💎 Bijou unique', '⚡ Laser & Lichtenberg', '🎨 Peinture & Toiles', '⚙️ Impression 3D', '🧶 Bracelet Kumihimo', '🚁 Vidéo / Photo Drone'] }
      ]);
      setChatbotStep(0);
      setChatbotAnswers({});
      setChatbotInputVisible(false);
    }
  };

  const getDynamicFlow = (choiceVal, answersVal) => {
    const selectedProject = answersVal?.project || choiceVal || chatbotAnswers.project;
    const ctxQ = contextQuestions[selectedProject];
    if (ctxQ) {
      return [chatbotFlow[0], ctxQ, ...chatbotFlow.slice(1)];
    }
    return chatbotFlow;
  };

  const handleBotChoice = async (choice) => {
    // Add user message
    setChatMessages(prev => [...prev, { sender: 'user', text: choice }]);
    
    const updatedAnswers = { ...chatbotAnswers };
    const dynamicFlowBefore = getDynamicFlow(choice, chatbotAnswers);
    const currentFlowItem = dynamicFlowBefore[chatbotStep];
    updatedAnswers[currentFlowItem.key] = choice;
    setChatbotAnswers(updatedAnswers);

    const nextStepIndex = chatbotStep + 1;
    setChatbotStep(nextStepIndex);
    
    // Simuler le temps de frappe du bot
    await new Promise(resolve => setTimeout(resolve, 600));

    const dynamicFlowAfter = getDynamicFlow(choice, updatedAnswers);
    if (nextStepIndex >= dynamicFlowAfter.length) {
      // Fin du chatbot : enregistrement dans Firestore
      if (db) {
        try {
          await addDoc(collection(db, 'chatbot_leads'), {
            ...updatedAnswers,
            createdAt: serverTimestamp()
          });
        } catch (err) {
          console.error("Erreur lors de l'enregistrement du lead :", err);
        }
      }
      setChatMessages(prev => [...prev, { sender: 'bot', text: `✅ Merci ${updatedAnswers.name || ''} ! Vos coordonnées ont été enregistrées. Evan va vous recontacter très bientôt.` }]);
      setChatbotInputVisible(false);
      return;
    }

    const nextFlowItem = dynamicFlowAfter[nextStepIndex];
    let nextMsgText = nextFlowItem.msg;
    if (nextFlowItem.key === 'contact') {
      nextMsgText = `${updatedAnswers.name ? updatedAnswers.name + ', comment' : 'Comment'} peut-on vous contacter (courriel ou téléphone) ?`;
    }

    setChatMessages(prev => [...prev, { 
      sender: 'bot', 
      text: nextMsgText, 
      choices: nextFlowItem.choices || null
    }]);

    if (nextFlowItem.input) {
      setChatbotInputVisible(true);
    } else {
      setChatbotInputVisible(false);
    }
  };

  const handleBotSubmitInput = () => {
    const val = chatbotInputValue.trim();
    if (!val) return;
    setChatbotInputValue('');
    handleBotChoice(val);
  };
  const downloadInvoice = (cert) => {
    const text = `==================================================
                 EVAN PATRUNO ART
               FACTURE DE COMMANDE
==================================================
No. Commande  : ${cert.orderId}
Date          : ${cert.date}
Client        : ${cert.customerName}
Courriel      : ${cert.customerEmail}
Adresse       : ${cert.customerAddress}
--------------------------------------------------
Produit       : ${cert.creationTitle}
Bois          : ${cert.wood}
Dimensions    : ${cert.dimensions}
Médiums       : ${cert.mediums}
--------------------------------------------------
Total Payé    : ${cert.priceCAD} (Sécurisé via Stripe)
==================================================
Merci pour votre confiance et votre achat d'art !
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Facture_${cert.orderId}.txt`;
    link.click();
  };

  const downloadCertificate = (cert) => {
    const text = `==================================================
              CERTIFICAT D'AUTHENTICITÉ
                  EVAN PATRUNO ART
==================================================
Nous certifions que l'œuvre d'art originale suivante :

Titre         : ${cert.creationTitle}
Bois utilisé  : ${cert.wood}
Dimensions    : ${cert.dimensions}
Médiums/Style : ${cert.mediums}

a été entièrement fabriquée de façon artisanale par
l'artiste ébéniste Evan Patruno dans son atelier de
Montréal, Québec, Canada.

Date de vente : ${cert.date}
No. Certificat: CERT-${cert.orderId}
Signature     : Evan Patruno

--------------------------------------------------
Scannez le QR Code de votre œuvre pour voir
les détails de fabrication originaux et l'état
de commande en temps réel sur evanpatruno.art.
==================================================
`;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Certificat_${cert.orderId}.txt`;
    link.click();
  };

  return (
    <div id="root">
      {/* Background Decorative Glow Blurs */}
      <div className="glow-blur" style={{ top: '5%', left: '10%', width: '450px', height: '450px', background: 'var(--accent-wood-glow)' }}></div>
      <div className="glow-blur" style={{ top: '25%', right: '5%', width: '500px', height: '500px', background: 'var(--accent-epoxy-glow)' }}></div>
      <div className="glow-blur" style={{ top: '50%', left: '5%', width: '400px', height: '400px', background: 'var(--accent-voltage-glow)' }}></div>
      <div className="glow-blur" style={{ top: '70%', right: '10%', width: '450px', height: '450px', background: 'var(--accent-wood-glow)' }}></div>
      <div className="glow-blur" style={{ top: '90%', left: '15%', width: '500px', height: '500px', background: 'var(--accent-epoxy-glow)' }}></div>

      {/* Header/Navigation */}
      <nav id="navbar" className={`header-nav glass ${scrolled ? 'scrolled' : ''}`}>
        <a href="#accueil" className="logo-brand" id="nav-logo" style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
          <img src="/assets/logo.png" alt="Evan Patruno Art" style={{ height: '40px', width: 'auto', objectFit: 'contain' }} />
        </a>

        {/* Desktop links */}
        <ul className="nav-links">
          <li><a href="#accueil" className="nav-link">Accueil</a></li>
          <li><a href="#portfolio" className="nav-link">Portfolio</a></li>
          <li><a href="#devis" className="nav-link">Projet sur Mesure</a></li>
          <li><a href="#historique" className="nav-link">Historique</a></li>
          <li><a href="#atelier" className="nav-link">L'Atelier</a></li>
          <li><a href="#contact" className="nav-link">Contact</a></li>
          {isAdminLoggedIn && <li><a href="#admin-dashboard" className="nav-link" style={{ color: 'var(--accent-epoxy)' }}>Tableau de bord</a></li>}
        </ul>

        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <a href="#devis" className="btn-cta-nav" id="nav-cta-btn">Créer un Devis</a>
          <div className="currency-dropdown-container">
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="currency-select"
              aria-label="Sélectionner la devise"
            >
              <option value="CAD">CAD ($)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
            </select>
          </div>
        </div>

        <button 
          className="mobile-nav-toggle" 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          id="menu-toggle"
        >
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: 'currentColor', marginBottom: '6px' }}></span>
          <span style={{ display: 'block', width: '20px', height: '2px', backgroundColor: 'currentColor', marginBottom: '6px' }}></span>
          <span style={{ display: 'block', width: '24px', height: '2px', backgroundColor: 'currentColor' }}></span>
        </button>
      </nav>

      {/* Main Content */}
      <main className="main-content">
        
        {/* HERO SECTION */}
        <section id="accueil" className="hero-section">
          <div className="hero-wrapper animate-slide-up">
            <div className="badge">
              <span className="badge-dot"></span>
              <span>Créations uniques faites à la main au Québec</span>
            </div>
            
            <h1 className="hero-title">
              Plusieurs <span className="wood">arts</span>, une <span className="epoxy">passion</span>
            </h1>
            
            <p className="hero-description">
              Ébénisterie d'art, résine époxy, gravure laser grand format (4'x4'), toiles de peinture, bijoux, bracelets Kumihimo, impression 3D (Bambu P1S) &amp; imagerie drone (DJI). Façonner la matière et la technologie sous toutes leurs formes pour donner vie à vos projets personnalisés.
            </p>
            
            <div className="hero-ctas">
              <a href="#portfolio" className="btn-primary">Découvrir le Portfolio</a>
              <a href="#devis" className="btn-secondary">Concevoir ma Pièce</a>
            </div>
          </div>
        </section>

        {/* PORTFOLIO GALLERY */}
        <section id="portfolio">
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Mes Créations</h2>
            <p className="section-subtitle">
              Explorez mon travail à travers les différents domaines d'artisanat. Chaque pièce est entièrement unique et fabriquée dans mon atelier.
            </p>
          </div>

          {/* Filter Bar */}
          <div className="gallery-filters" id="gallery-filter-bar">
            <button 
              className={`filter-btn ${galleryFilter === 'all' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('all')}
              id="filter-all"
            >
              Tout voir
            </button>
            <button 
              className={`filter-btn ${galleryFilter === 'table' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('table')}
              id="filter-tables"
            >
              🪵 Tables &amp; Mobilier
            </button>
            <button 
              className={`filter-btn ${galleryFilter === 'jewelry' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('jewelry')}
              id="filter-jewelry"
            >
              💎 Bijoux Résine
            </button>
            <button 
              className={`filter-btn ${galleryFilter === 'lichtenberg' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('lichtenberg')}
              id="filter-lichtenberg"
            >
              ⚡ Lichtenberg
            </button>
            <button 
              className={`filter-btn ${galleryFilter === 'laser' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('laser')}
              id="filter-laser"
            >
              🎨 Gravure &amp; Laser
            </button>
            <button 
              className={`filter-btn ${galleryFilter === 'sold' ? 'active' : ''}`}
              onClick={() => setGalleryFilter('sold')}
              id="filter-sold"
            >
              📜 Projets Réalisés
            </button>
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid" id="portfolio-grid">
            {filteredPortfolio.map((item) => (
              <div 
                key={item.id} 
                className="art-card glass" 
                id={`portfolio-item-${item.id}`}
                style={{ cursor: 'pointer' }}
                onClick={() => setSelectedItemDetails(item)}
              >
                <div className="art-image-wrapper">
                  <span className={`art-badge ${item.category}`}>{item.categoryName}</span>
                  <img src={item.image} alt={item.title} className="art-image" loading="lazy" />
                </div>
                
                <div className="art-info">
                  <div>
                    <h3 className="art-title">{item.title}</h3>
                    <p className="art-desc">{item.desc}</p>
                  </div>
                  
                  {(item.wood || item.dimensions || item.mediums) && (
                    <div className="art-specs" style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '12px', marginBottom: '12px', borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '10px' }}>
                      {item.wood && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>🪵</span> <span><strong>Bois :</strong> {item.wood}</span></div>}
                      {item.dimensions && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>📏</span> <span><strong>Dimensions :</strong> {item.dimensions}</span></div>}
                      {item.mediums && <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}><span>✨</span> <span><strong>Matériaux :</strong> {item.mediums}</span></div>}
                    </div>
                  )}

                  <div className="art-footer" style={{ display: 'flex', flexDirection: 'column', gap: '10px', alignItems: 'stretch', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
                      <span className="art-status">
                        <span className={`status-dot ${item.status}`}></span>
                        {item.statusText}
                      </span>
                      <span className="art-price">{formatPrice(item.price)}</span>
                    </div>
                    {item.status === 'available' && !item.price.toLowerCase().includes('demande') ? (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleStartCheckout(item);
                        }}
                        className="btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem', width: '100%', marginTop: '5px' }}
                      >
                        Commander
                      </button>
                    ) : (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // Pre-populate custom builder with this item category and open it
                          setProjectData(prev => ({ ...prev, type: item.category === 'table' ? '🪵 Table sur mesure' : item.category === 'jewelry' ? '💎 Bijou unique' : '🎨 Autre projet d\'art' }));
                          setBuilderStep(1);
                          window.location.hash = 'devis';
                        }}
                        className="btn-secondary" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem', width: '100%', marginTop: '5px' }}
                      >
                        Sur Mesure
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIALS & TECH SECTION */}
        <section id="materials" className="rounded-section">
          <div className="section-header">
            <h2 className="section-title">Ce que je peux produire</h2>
            <p className="section-subtitle">
              De l'ébénisterie d'art de luxe à la haute technologie de fabrication : explorez mes capacités de production et d'artisanat.
            </p>
          </div>

          <div className="pigments-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginTop: '20px' }}>
            {craftCapabilities.map((item, idx) => (
              <div key={idx} className="pigment-card glass" style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: '25px', textAlign: 'left', alignItems: 'flex-start' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', width: '60px', height: '60px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', marginBottom: '20px' }}>
                  {item.icon}
                </div>
                <h3 className="pigment-name" style={{ fontSize: '1.2rem', marginBottom: '10px', fontWeight: '600' }}>{item.name}</h3>
                <p className="pigment-desc" style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', lineHeight: '1.5', margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </section>



        {/* CARE GUIDE SECTION */}
        <section id="entretien">
          <div className="section-header">
            <h2 className="section-title">Guide d'Entretien &amp; de Durabilité</h2>
            <p className="section-subtitle">
              Conseils professionnels pour préserver l'éclat de vos mobiliers, toiles, bijoux et pièces imprimées en 3D.
            </p>
          </div>

          <div className="care-guide-container">
            {[
              { title: '🪵 Mobilier en Bois & Époxy', emoji: '🪵', content: 'Nettoyage doux avec un chiffon microfibre humide. Évitez les produits abrasifs, protégez de la lumière directe prolongée du soleil et utilisez des sous-plats pour les objets chauds. Appliquez une huile protectrice (Rubio/Osmo) tous les 1 à 2 ans sur la partie bois.' },
              { title: '🎨 Toiles & Peintures Acryliques', emoji: '🎨', content: 'Dépoussiérez uniquement avec un plumeau doux ou un pinceau sec et propre. Évitez l\'eau ou les chiffons humides sur la couche picturale. Conservez vos toiles à l\'abri de l\'humidité extrême et de l\'exposition directe au soleil.' },
              { title: '💎 Bijoux Résine & Bracelets Kumihimo', emoji: '💎', content: 'Évitez de vaporiser du parfum ou d\'appliquer des crèmes directement sur le bijou. Retirez vos bijoux et bracelets Kumihimo avant la douche, la piscine ou le sport pour préserver l\'éclat des fibres tressées et de la résine.' },
              { title: '⚙️ Impression 3D (PLA / PETG)', emoji: '⚙️', content: 'Les pièces imprimées en 3D (Bambu P1S) ne doivent pas être exposées à des températures supérieures à 50°C (comme dans une voiture en été) sous peine de ramollissement et déformation. Nettoyez à l\'eau tiède savonneuse.' }
            ].map((item, idx) => (
              <div key={idx} className={`care-accordion-item glass ${activeAccordion === idx ? 'active' : ''}`}>
                <button 
                  className="care-accordion-header"
                  onClick={() => setActiveAccordion(activeAccordion === idx ? null : idx)}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>{item.emoji}</span>
                    <span>{item.title}</span>
                  </span>
                  <span className="care-accordion-icon" style={{ transform: activeAccordion === idx ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▼</span>
                </button>
                <div 
                  className="care-accordion-content" 
                  style={{ maxHeight: activeAccordion === idx ? '200px' : '0', transition: 'all 0.3s ease-out' }}
                >
                  <div className="care-accordion-content-inner">
                    {item.content}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* FAQ SECTION */}
        <section id="faq" className="rounded-section">
          <div className="section-header">
            <h2 className="section-title">Foire Aux Questions (FAQ)</h2>
            <p className="section-subtitle">
              Retrouvez toutes les réponses concernant nos processus, nos technologies laser, 3D, drone et nos bois.
            </p>
          </div>

          <div className="faq-search-wrapper">
            <span className="faq-search-icon">🔍</span>
            <input 
              type="text" 
              className="faq-search-input"
              placeholder="Rechercher une question ou un mot-clé (ex: laser, résine, délai)..."
              value={faqSearchQuery}
              onChange={(e) => setFaqSearchQuery(e.target.value)}
            />
          </div>

          <div className="faq-category-filters">
            {[
              { id: 'all', label: 'Toutes les catégories' },
              { id: 'general', label: '📅 Général & Délais' },
              { id: 'wood', label: '🪵 Ébénisterie & Résine' },
              { id: '3dprint', label: '⚙️ Impression 3D' },
              { id: 'laser', label: '📐 Découpe & Laser' },
              { id: 'drone', label: '🚁 Réglementation Drone' }
            ].map((cat) => (
              <button
                key={cat.id}
                className={`faq-filter-btn ${faqActiveCategory === cat.id ? 'active' : ''}`}
                onClick={() => setFaqActiveCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="care-guide-container" style={{ maxWidth: '800px', margin: '0 auto' }}>
            {faqItems
              .filter(item => {
                const matchesCat = faqActiveCategory === 'all' || item.category === faqActiveCategory;
                const matchesQuery = item.question.toLowerCase().includes(faqSearchQuery.toLowerCase()) || 
                                     item.answer.toLowerCase().includes(faqSearchQuery.toLowerCase());
                return matchesCat && matchesQuery;
              })
              .map((item, idx) => (
                <div key={idx} className={`care-accordion-item glass ${faqActiveAccordion === idx ? 'active' : ''}`}>
                  <button 
                    className="care-accordion-header"
                    onClick={() => setFaqActiveAccordion(faqActiveAccordion === idx ? null : idx)}
                    style={{ textAlign: 'left' }}
                  >
                    <span style={{ fontWeight: '600', color: '#fff' }}>{item.question}</span>
                    <span className="care-accordion-icon" style={{ transform: faqActiveAccordion === idx ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▼</span>
                  </button>
                  <div 
                    className="care-accordion-content" 
                    style={{ maxHeight: faqActiveAccordion === idx ? '250px' : '0', transition: 'all 0.3s ease-out' }}
                  >
                    <div className="care-accordion-content-inner" style={{ color: 'var(--text-secondary)', lineHeight: '1.6', fontSize: '0.9rem' }}>
                      {item.answer}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* CUSTOM INQUIRY BUILDER */}
        <section id="devis" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="section-header">
            <h2 className="section-title">Créez votre Projet Personnalisé</h2>
            <p className="section-subtitle">
              Vous avez une idée précise ? Utilisez notre configurateur interactif pour définir vos besoins et recevoir une proposition sur mesure.
            </p>
          </div>

          <div className="builder-card glass" id="custom-builder-container">
            <div className="builder-header">
              <span className="builder-title-step">
                {builderStep === 1 && "Étape 1 : Type de création"}
                {builderStep === 2 && "Étape 2 : Matériaux & Design"}
                {builderStep === 3 && "Étape 3 : Dimensions & Détails"}
                {builderStep === 4 && "Étape 4 : Vos Coordonnées"}
              </span>
              
              <div className="builder-steps">
                <span className={`builder-step-dot ${builderStep === 1 ? 'active' : builderStep > 1 ? 'completed' : ''}`} id="step-dot-1">1</span>
                <span className={`builder-step-dot ${builderStep === 2 ? 'active' : builderStep > 2 ? 'completed' : ''}`} id="step-dot-2">2</span>
                <span className={`builder-step-dot ${builderStep === 3 ? 'active' : builderStep > 3 ? 'completed' : ''}`} id="step-dot-3">3</span>
                <span className={`builder-step-dot ${builderStep === 4 ? 'active' : builderStep > 4 ? 'completed' : ''}`} id="step-dot-4">4</span>
              </div>
            </div>

            <div className="builder-content">
              {!builderSubmitted ? (
                <>
                  {/* Step 1: Project Type */}
                  {builderStep === 1 && (
                    <div className="choices-grid" id="builder-step-1">
                      <div 
                        className={`choice-card ${projectData.type === 'Table rivière' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Table rivière')}
                        id="choice-table"
                      >
                        <div className="choice-icon"><Hammer size={24} /></div>
                        <span className="choice-title">Table rivière</span>
                        <span className="choice-desc">Mobilier haut de gamme en bois massif & résine</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Planche de présentation' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Planche de présentation')}
                        id="choice-presentation-board"
                      >
                        <div className="choice-icon"><ChefHat size={24} /></div>
                        <span className="choice-title">Planche de présentation</span>
                        <span className="choice-desc">Planches à découper, de service &amp; charcuterie en bois et époxy</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Bijou en bois/époxy' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Bijou en bois/époxy')}
                        id="choice-jewelry"
                      >
                        <div className="choice-icon"><Gem size={24} /></div>
                        <span className="choice-title">Bijoux artisanaux</span>
                        <span className="choice-desc">Colliers, pendentifs et bagues uniques</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Fractale de Lichtenberg' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Fractale de Lichtenberg')}
                        id="choice-lichtenberg"
                      >
                        <div className="choice-icon"><Zap size={24} /></div>
                        <span className="choice-title">Art Lichtenberg</span>
                        <span className="choice-desc">Brûlures électriques haute tension</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Découpe & Gravure laser' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Découpe & Gravure laser')}
                        id="choice-laser"
                      >
                        <div className="choice-icon"><Scissors size={24} /></div>
                        <span className="choice-title">Gravure Laser 4'x4'</span>
                        <span className="choice-desc">Découpes et gravures grand format</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Impression 3D' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Impression 3D')}
                        id="choice-print3d"
                      >
                        <div className="choice-icon"><Printer size={24} /></div>
                        <span className="choice-title">Impression 3D</span>
                        <span className="choice-desc">Pièces multi-couleurs Bambu P1S</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Bracelet Kumihimo' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Bracelet Kumihimo')}
                        id="choice-kumihimo"
                      >
                        <div className="choice-icon"><Sparkles size={24} /></div>
                        <span className="choice-title">Bracelet Kumihimo</span>
                        <span className="choice-desc">Tissage traditionnel fait main</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Photo/Vidéo Drone' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Photo/Vidéo Drone')}
                        id="choice-drone"
                      >
                        <div className="choice-icon"><Camera size={24} /></div>
                        <span className="choice-title">Imagerie Drone</span>
                        <span className="choice-desc">Photos/Vidéos 4K DJI Mini 3 Pro</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Custom options based on project type */}
                  {builderStep === 2 && (
                    <div className="choices-grid" id="builder-step-2">
                      {/* For Wood & Resin projects (Tables, Boards, Jewelry, Lichtenberg, Laser) */}
                      {['Table rivière', 'Planche de présentation', 'Bijou en bois/époxy', 'Fractale de Lichtenberg', 'Découpe & Gravure laser'].includes(projectData.type) && (
                        <>
                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="wood-select">Essence de bois privilégiée</label>
                            <select 
                              id="wood-select"
                              className="builder-select" 
                              value={projectData.wood}
                              onChange={(e) => setProjectData(prev => ({ ...prev, wood: e.target.value }))}
                            >
                              <option value="">Sélectionnez une option...</option>
                              <option value="Noyer noir (Foncé, grain riche)">Noyer noir (Foncé, grain riche)</option>
                              <option value="Érable (Clair, très robuste)">Érable (Clair, très robuste)</option>
                              <option value="Cèdre (Chaud, excellent parfum, résistant)">Cèdre (Chaud, excellent parfum)</option>
                              <option value="Cerisier (Ambré, grain fin)">Cerisier (Ambré, grain fin)</option>
                              <option value="Autre / Je ne sais pas encore">Autre / Pas de préférence</option>
                            </select>
                          </div>

                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="epoxy-select">Style ou Couleur de la résine Époxy / Finition</label>
                            <select 
                              id="epoxy-select" 
                              className="builder-select"
                              value={projectData.epoxy}
                              onChange={(e) => setProjectData(prev => ({ ...prev, epoxy: e.target.value }))}
                            >
                              <option value="">Sélectionnez une option...</option>
                              <option value="Bleu Abysse Translucide">🌊 Bleu Abysse Translucide</option>
                              <option value="Bleu Océan &amp; Vagues Blanches (Effet Mer)">🌊 Bleu Océan &amp; Vagues Blanches (Effet Mer)</option>
                              <option value="Turquoise Caraïbes Cristallin">🏝️ Turquoise Caraïbes Cristallin</option>
                              <option value="Vert Émeraude Nacré (Pigments Métalliques)">🍃 Vert Émeraude Nacré (Pigments Métalliques)</option>
                              <option value="Noir Fumé Translucide (Look Moderne)">🌑 Noir Fumé Translucide (Look Moderne)</option>
                              <option value="Noir Onyx Opaque (Contraste Saisissant)">⚫ Noir Onyx Opaque (Contraste Saisissant)</option>
                              <option value="Doré / Cuivré Métallique Scintillant">✨ Doré / Cuivré Métallique Scintillant</option>
                              <option value="Rouge Lave &amp; Bronze Nacré">🔥 Rouge Lave &amp; Bronze Nacré</option>
                              <option value="Améthyste Violet Translucide">🔮 Améthyste Violet Translucide</option>
                              <option value="Résine Transparente Limpide (Fini Verre)">💎 Résine Transparente Limpide (Fini Verre)</option>
                              <option value="Couleur Personnalisée sur Mesure">🎨 Autre couleur sur mesure (à spécifier)</option>
                              <option value="Pas d'époxy (Bois brut ou gravure seule)">🪵 Sans résine / Fini naturel (Bois brut)</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* For 3D Printing projects */}
                      {projectData.type === 'Impression 3D' && (
                        <>
                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="filament-select">Matériau / Filament d'Impression</label>
                            <select 
                              id="filament-select"
                              className="builder-select" 
                              value={projectData.wood}
                              onChange={(e) => setProjectData(prev => ({ ...prev, wood: e.target.value }))}
                            >
                              <option value="">Sélectionnez un matériau...</option>
                              <option value="PLA (Standard, biodégradable, grand choix de couleurs)">PLA (Standard, excellent fini)</option>
                              <option value="PETG (Résistant aux intempéries et chocs)">PETG (Robuste, extérieur)</option>
                              <option value="TPU (Flexible / Caoutchouteux)">TPU (Flexible, joints/coques)</option>
                              <option value="Autre / Je ne sais pas">Autre / Conseil requis</option>
                            </select>
                          </div>

                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="printcolor-select">Style de couleur &amp; Finition</label>
                            <select 
                              id="printcolor-select" 
                              className="builder-select"
                              value={projectData.epoxy}
                              onChange={(e) => setProjectData(prev => ({ ...prev, epoxy: e.target.value }))}
                            >
                              <option value="">Sélectionnez un style...</option>
                              <option value="Couleur unie simple">Couleur unie simple</option>
                              <option value="Multi-couleurs précis (Bambu AMS)">Multi-couleurs précis (Bambu AMS)</option>
                              <option value="Phosphorescent (Glow in the dark)">Phosphorescent (Glow-in-the-dark)</option>
                              <option value="Transparent / Translucide">Transparent / Translucide</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* For Kumihimo bracelets */}
                      {projectData.type === 'Bracelet Kumihimo' && (
                        <>
                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="cord-select">Type de fil / Cordon</label>
                            <select 
                              id="cord-select"
                              className="builder-select" 
                              value={projectData.wood}
                              onChange={(e) => setProjectData(prev => ({ ...prev, wood: e.target.value }))}
                            >
                              <option value="">Sélectionnez une matière...</option>
                              <option value="Soie artificielle (Lisse, brillant et élégant)">Soie artificielle (Finition brillante)</option>
                              <option value="Coton ciré (Mat, style rustique et solide)">Coton ciré (Style mat/naturel)</option>
                              <option value="Polyester haute résistance (Idéal sport/eau)">Polyester robuste</option>
                            </select>
                          </div>

                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="kumihimo-colors">Préférences de couleurs (ex: Bleu, Blanc, Or)</label>
                            <input 
                              type="text" 
                              id="kumihimo-colors"
                              className="builder-input"
                              placeholder="Indiquez les couleurs souhaitées..."
                              value={projectData.epoxy}
                              onChange={(e) => setProjectData(prev => ({ ...prev, epoxy: e.target.value }))}
                            />
                          </div>
                        </>
                      )}

                      {/* For Drone photography/videography */}
                      {projectData.type === 'Photo/Vidéo Drone' && (
                        <>
                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="drone-service">Type de service requis</label>
                            <select 
                              id="drone-service"
                              className="builder-select" 
                              value={projectData.wood}
                              onChange={(e) => setProjectData(prev => ({ ...prev, wood: e.target.value }))}
                            >
                              <option value="">Sélectionnez un service...</option>
                              <option value="Prises de vue Immobilières (Vente/Promotion)">Immobilier (Photos &amp; Vidéos)</option>
                              <option value="Inspection de toiture / structures">Inspection de structures</option>
                              <option value="Paysage / Suivi de chantier de construction">Suivi de chantier / Paysage</option>
                              <option value="Événementiel / Créatif">Événementiel / Créatif</option>
                            </select>
                          </div>

                          <div className="builder-form-group" style={{ gridColumn: 'span 2' }}>
                            <label htmlFor="drone-format">Format &amp; Résolution de livraison</label>
                            <select 
                              id="drone-format"
                              className="builder-select" 
                              value={projectData.epoxy}
                              onChange={(e) => setProjectData(prev => ({ ...prev, epoxy: e.target.value }))}
                            >
                              <option value="">Sélectionnez un format...</option>
                              <option value="4K Horizontal standard (YouTube, Web, TV)">4K Horizontal (Standard)</option>
                              <option value="9:16 Vertical (Idéal TikTok, Instagram Reels)">9:16 Vertical (Réseaux sociaux)</option>
                              <option value="Les deux formats (Optimisation complète)">Les deux formats (Complet)</option>
                            </select>
                          </div>
                        </>
                      )}

                      {/* Table legs configurator (Only for tables) */}
                      {projectData.type === 'Table rivière' && (
                        <div className="builder-form-group" style={{ gridColumn: 'span 2', marginTop: '20px' }}>
                          <label>Style de piétement (Pattes de table)</label>
                          <div className="legs-grid">
                            {[
                              { id: 'trapeze', title: 'Pieds Trapèze / H', emoji: '🪵', desc: 'Acier noir, style industriel moderne' },
                              { id: 'x-shape', title: 'Pieds en X', emoji: '❌', desc: 'Design croisé classique et stable' },
                              { id: 'hairpin', title: 'Pieds Épingle', emoji: '📍', desc: 'Look vintage mid-century épuré' },
                              { id: 'spider', title: 'Pieds Mikado (Araignée)', emoji: '🕷️', desc: 'Pied central idéal pour les tables rondes' }
                            ].map((leg) => (
                              <div 
                                key={leg.id} 
                                className={`leg-card ${projectData.legs === leg.title ? 'active' : ''}`}
                                onClick={() => setProjectData(prev => ({ ...prev, legs: leg.title }))}
                              >
                                <div className="leg-check">✓</div>
                                <div className="leg-image-placeholder" style={{ fontSize: '1.8rem' }}>{leg.emoji}</div>
                                <div className="leg-card-title">{leg.title}</div>
                                <div className="leg-card-price" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{leg.desc}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Step 3: Dimensions & Notes */}
                  {builderStep === 3 && (
                    <div className="choices-grid" id="builder-step-3" style={{ display: 'flex', flexDirection: 'column' }}>
                      {['Table rivière', 'Planche de présentation'].includes(projectData.type) ? (
                        <div className="builder-form-group">
                          <label>Dimensions souhaitées (pouces)</label>
                          <div className="presets-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px', marginBottom: '15px' }}>
                            {projectData.type === 'Planche de présentation' ? [
                              { id: 'small', title: 'Petite planche', desc: '10" x 14" x 0.75" (Apéro/Service)', dimensions: '14" x 10" x 0.75"' },
                              { id: 'medium', title: 'Moyenne planche', desc: '12" x 18" x 1.0" (Standard)', dimensions: '18" x 12" x 1.0"' },
                              { id: 'large', title: 'Grande planche', desc: '16" x 24" x 1.25" (Charcuterie géante)', dimensions: '24" x 16" x 1.25"' },
                              { id: 'custom', title: 'Sur mesure', desc: 'Définissez vos propres dimensions', dimensions: 'custom' }
                            ].map(p => (
                              <div 
                                key={p.id}
                                className={`preset-card glass ${projectData.presetSize === p.id ? 'active' : ''}`}
                                onClick={() => handleSelectPreset(p.id, p.dimensions)}
                                style={{
                                  padding: '12px',
                                  borderRadius: '12px',
                                  border: projectData.presetSize === p.id ? '2px solid var(--accent-epoxy)' : '1px solid var(--border-color)',
                                  cursor: 'pointer',
                                  background: projectData.presetSize === p.id ? 'rgba(176, 84, 156, 0.1)' : 'transparent',
                                  textAlign: 'center',
                                  transition: 'all 0.3s'
                                }}
                              >
                                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>{p.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.desc}</div>
                              </div>
                            )) : [
                              { id: 'small', title: 'Table Basse', desc: '36" x 20" x 1.5"', dimensions: '36" x 20" x 1.5"' },
                              { id: 'medium', title: 'Table de repas moyenne', desc: '60" x 36" x 1.75" (4-6 pers.)', dimensions: '60" x 36" x 1.75"' },
                              { id: 'large', title: 'Table de repas grande', desc: '84" x 40" x 2.0" (6-8 pers.)', dimensions: '84" x 40" x 2.0"' },
                              { id: 'custom', title: 'Sur mesure', desc: 'Définissez vos propres dimensions', dimensions: 'custom' }
                            ].map(p => (
                              <div 
                                key={p.id}
                                className={`preset-card glass ${projectData.presetSize === p.id ? 'active' : ''}`}
                                onClick={() => handleSelectPreset(p.id, p.dimensions)}
                                style={{
                                  padding: '12px',
                                  borderRadius: '12px',
                                  border: projectData.presetSize === p.id ? '2px solid var(--accent-epoxy)' : '1px solid var(--border-color)',
                                  cursor: 'pointer',
                                  background: projectData.presetSize === p.id ? 'rgba(176, 84, 156, 0.1)' : 'transparent',
                                  textAlign: 'center',
                                  transition: 'all 0.3s'
                                }}
                              >
                                <div style={{ fontWeight: '600', fontSize: '0.9rem', color: '#fff' }}>{p.title}</div>
                                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>{p.desc}</div>
                              </div>
                            ))}
                          </div>

                          {projectData.presetSize === 'custom' && (
                            <div className="custom-dimensions-inputs" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '15px' }}>
                              <div className="builder-form-group">
                                <label style={{ fontSize: '0.8rem' }}>Longueur (L - pouces)</label>
                                <input 
                                  type="number" 
                                  className="builder-input" 
                                  placeholder='ex: 18'
                                  value={projectData.length || ''}
                                  onChange={(e) => handleCustomDimensionChange('length', e.target.value)}
                                />
                              </div>
                              <div className="builder-form-group">
                                <label style={{ fontSize: '0.8rem' }}>Largeur (W - pouces)</label>
                                <input 
                                  type="number" 
                                  className="builder-input" 
                                  placeholder='ex: 12'
                                  value={projectData.width || ''}
                                  onChange={(e) => handleCustomDimensionChange('width', e.target.value)}
                                />
                              </div>
                              <div className="builder-form-group">
                                <label style={{ fontSize: '0.8rem' }}>Épaisseur (T - pouces)</label>
                                <input 
                                  type="number" 
                                  step="0.25"
                                  className="builder-input" 
                                  placeholder='ex: 1'
                                  value={projectData.thickness || ''}
                                  onChange={(e) => handleCustomDimensionChange('thickness', e.target.value)}
                                />
                              </div>
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="builder-form-group">
                          <label htmlFor="input-dimensions">Dimensions approximatives (ex: 30" x 60" ou en mm)</label>
                          <input 
                            type="text" 
                            id="input-dimensions"
                            className="builder-input" 
                            placeholder="Entrez les dimensions souhaitées"
                            value={projectData.dimensions}
                            onChange={(e) => setProjectData(prev => ({ ...prev, dimensions: e.target.value }))}
                          />
                        </div>
                      )}

                      <div className="builder-form-group">
                        <label htmlFor="textarea-notes">Détails ou instructions spécifiques</label>
                        <textarea 
                          id="textarea-notes"
                          className="builder-textarea" 
                          placeholder="Décrivez votre vision pour cette pièce unique (forme, usage, style de grain, etc.)"
                          value={projectData.notes}
                          onChange={(e) => setProjectData(prev => ({ ...prev, notes: e.target.value }))}
                        ></textarea>
                      </div>

                      <div className="builder-form-group">
                        <label>Fichier de conception ou croquis (optionnel)</label>
                        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                          Importez un croquis ou modèle (.jpg, .png, .svg, .stl) OU insérez un lien de partage (Google Drive, Thingiverse) ci-dessous.
                        </p>
                        
                        {projectData.fileBase64 ? (
                          <div className="file-upload-preview-container">
                            {projectData.fileBase64.startsWith('data:image/') ? (
                              <img src={projectData.fileBase64} alt="Preview" className="file-upload-preview" />
                            ) : (
                              <div className="file-upload-preview" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(255,255,255,0.05)', fontSize: '1.2rem' }}>📄</div>
                            )}
                            <div className="file-upload-meta">
                              <div className="file-upload-filename">{projectData.fileName}</div>
                              <div className="file-upload-size">{projectData.fileSize}</div>
                            </div>
                            <button 
                              type="button" 
                              className="file-upload-remove"
                              onClick={() => setProjectData(prev => ({ ...prev, fileBase64: '', fileName: '', fileSize: '' }))}
                            >
                              &times;
                            </button>
                          </div>
                        ) : (
                          <div 
                            className="file-upload-wrapper"
                            onClick={() => document.getElementById('builder-file-input').click()}
                          >
                            <span>📁 Cliquez pour choisir un fichier</span>
                            <input 
                              type="file" 
                              id="builder-file-input" 
                              style={{ display: 'none' }} 
                              accept=".jpg,.jpeg,.png,.svg,.stl,.dxf,.obj"
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  if (file.size > 2 * 1024 * 1024) {
                                    alert("Le fichier est trop lourd. Veuillez privilégier un lien cloud ci-dessous pour les fichiers de plus de 2 Mo.");
                                    return;
                                  }
                                  const reader = new FileReader();
                                  reader.onload = (uploadEvent) => {
                                    setProjectData(prev => ({
                                      ...prev,
                                      fileBase64: uploadEvent.target.result,
                                      fileName: file.name,
                                      fileSize: (file.size / 1024).toFixed(1) + ' KB'
                                    }));
                                  };
                                  reader.readAsDataURL(file);
                                }
                              }}
                            />
                          </div>
                        )}
                      </div>

                      {/* Client live pricing estimate card */}
                      {(() => {
                        const est = calculateLiveEstimate(projectData);
                        if (!est) return null;
                        return (
                          <div className="estimate-card glass" style={{
                            marginTop: '25px',
                            padding: '20px',
                            borderRadius: '16px',
                            border: '1px solid rgba(176, 84, 156, 0.3)',
                            background: 'linear-gradient(135deg, rgba(30, 10, 25, 0.9) 0%, rgba(18, 0, 16, 0.95) 100%)',
                            boxShadow: '0 8px 32px 0 rgba(176, 84, 156, 0.15)'
                          }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--accent-epoxy)', fontWeight: '600', marginBottom: '10px' }}>
                              <Sparkles size={18} />
                              <span>Estimation de Devis en Temps Réel</span>
                            </div>
                            <div style={{ fontSize: '1.8rem', fontWeight: 'bold', color: '#fff', margin: '10px 0' }}>
                              {est.min.toLocaleString('fr-CA')} $ - {est.max.toLocaleString('fr-CA')} $ CAD
                            </div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: '1.4' }}>
                              Cette estimation comprend :
                              <ul style={{ paddingLeft: '20px', marginTop: '5px', listStyleType: 'circle' }}>
                                {projectData.wood && <li>Essence : <strong>{projectData.wood.split(' ')[0]}</strong> {est.woodBF ? `(~${est.woodBF} BF)` : ''}</li>}
                                {est.epoxyLiters > 0 && <li>Résine Époxy : <strong>{projectData.epoxy ? projectData.epoxy.split(' ')[0] : 'Inclus'}</strong> ({est.epoxyLiters} Litres)</li>}
                                {projectData.legs && <li>Piétement : <strong>{projectData.legs}</strong></li>}
                                <li>Main d'œuvre artisanale &amp; finition haut de gamme</li>
                              </ul>
                            </div>
                            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '12px', fontStyle: 'italic' }}>
                              * Les prix sont indicatifs et dépendent de la complexité finale. Un devis officiel vous sera envoyé après validation de vos croquis.
                            </p>
                          </div>
                        );
                      })()}

                      <div className="builder-form-group">
                        <label htmlFor="input-cloud-link">Lien vers fichier de conception externe (ex: Google Drive, Dropbox, Thingiverse)</label>
                        <input 
                          type="url" 
                          id="input-cloud-link"
                          className="builder-input" 
                          placeholder="https://drive.google.com/... ou https://thingiverse.com/..."
                          value={projectData.cloudLink}
                          onChange={(e) => setProjectData(prev => ({ ...prev, cloudLink: e.target.value }))}
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 4: Contact Form & Summary */}
                  {builderStep === 4 && (
                    <form onSubmit={handleBuilderSubmit} className="choices-grid" id="builder-step-4" style={{ display: 'flex', flexDirection: 'column' }}>
                      <div className="builder-summary">
                        <h4 style={{ marginBottom: '15px', color: 'var(--accent-wood)' }}>Récapitulatif de votre demande :</h4>
                        <div className="summary-row">
                          <span className="summary-label">Projet :</span>
                          <span className="summary-value">{projectData.type || 'Non spécifié'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Bois :</span>
                          <span className="summary-value">{projectData.wood || 'Non spécifié'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Époxy :</span>
                          <span className="summary-value">{projectData.epoxy || 'Non spécifié'}</span>
                        </div>
                        <div className="summary-row">
                          <span className="summary-label">Taille :</span>
                          <span className="summary-value">{projectData.dimensions || 'Non spécifié'}</span>
                        </div>
                        {(() => {
                          const est = calculateLiveEstimate(projectData);
                          if (!est) return null;
                          return (
                            <div className="summary-row" style={{ borderTop: '1px solid var(--border-color)', paddingTop: '10px', marginTop: '10px' }}>
                              <span className="summary-label" style={{ color: 'var(--accent-epoxy)', fontWeight: 'bold' }}>Prix estimé :</span>
                              <span className="summary-value" style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>{est.min.toLocaleString('fr-CA')} $ - {est.max.toLocaleString('fr-CA')} $ CAD</span>
                            </div>
                          );
                        })()}
                      </div>

                      <div className="builder-form-group">
                        <label htmlFor="builder-name">Votre Nom complet *</label>
                        <input 
                          type="text" 
                          id="builder-name"
                          className="builder-input" 
                          required
                          value={projectData.name}
                          onChange={(e) => setProjectData(prev => ({ ...prev, name: e.target.value }))}
                        />
                      </div>

                      <div className="form-row">
                        <div className="builder-form-group">
                          <label htmlFor="builder-email">Adresse Courriel *</label>
                          <input 
                            type="email" 
                            id="builder-email"
                            className="builder-input" 
                            required
                            value={projectData.email}
                            onChange={(e) => setProjectData(prev => ({ ...prev, email: e.target.value }))}
                          />
                        </div>
                        <div className="builder-form-group">
                          <label htmlFor="builder-phone">Numéro de Téléphone</label>
                          <input 
                            type="tel" 
                            id="builder-phone"
                            className="builder-input"
                            value={projectData.phone}
                            onChange={(e) => setProjectData(prev => ({ ...prev, phone: e.target.value }))}
                          />
                        </div>
                      </div>
                    </form>
                  )}
                </>
              ) : (
                <div className="success-message" id="builder-success">
                  <div className="success-icon"><CheckCircle2 size={36} /></div>
                  <h3 className="success-title">Demande Envoyée !</h3>
                  <p className="success-text">
                    Merci {projectData.name}. Votre demande de devis personnalisé pour un projet de type <strong>{projectData.type}</strong> a bien été enregistrée. Je vais l'étudier et vous recontacter sous 48 heures.
                  </p>
                  <button onClick={resetBuilder} className="btn-secondary" id="reset-builder-btn">Faire une autre demande</button>
                </div>
              )}
            </div>

            {!builderSubmitted && (
              <div className="builder-actions">
                <button 
                  onClick={handlePrevStep} 
                  className="btn-secondary" 
                  disabled={builderStep === 1}
                  style={{ opacity: builderStep === 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', gap: '8px' }}
                  id="btn-builder-prev"
                >
                  <ChevronLeft size={16} /> Retour
                </button>
                
                {builderStep < 4 ? (
                  <button 
                    onClick={handleNextStep} 
                    className="btn-primary"
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    id="btn-builder-next"
                  >
                    Suivant <ChevronRight size={16} />
                  </button>
                ) : (
                  <button 
                    onClick={handleBuilderSubmit} 
                    className="btn-primary" 
                    style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                    id="btn-builder-submit"
                  >
                    <Send size={16} /> Envoyer la demande
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        {/* HISTORIQUE DE PROJETS SECTION */}
        <section id="historique" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="section-header animate-fade-in">
            <h2 className="section-title">Historique des Projets &amp; Tarifs</h2>
            <p className="section-subtitle">
              Découvrez nos réalisations passées pour vous inspirer et estimer les tarifs de vos futurs projets sur mesure.
            </p>
          </div>

          <div className="devis-history-wrapper animate-fade-in" style={{ maxWidth: '1000px', margin: '0 auto' }}>
              <div className="glass" style={{ padding: '30px', borderRadius: '24px', marginBottom: '30px' }}>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '250px', position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Rechercher une réalisation (ex: noyer, planche, Tremblay)..." 
                      className="builder-input" 
                      style={{ paddingLeft: '35px', margin: 0, fontSize: '0.9rem', height: '42px', width: '100%' }}
                      value={devisHistorySearch}
                      onChange={(e) => setDevisHistorySearch(e.target.value)}
                    />
                    <span style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-secondary)' }}>🔍</span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: 'Toutes les créations' },
                      { id: 'board', label: '🍳 Planches' },
                      { id: 'table', label: '🪵 Tables' },
                      { id: 'jewelry', label: '💎 Bijoux' },
                      { id: 'lichtenberg', label: '⚡ Lichtenberg' },
                      { id: 'laser', label: '🎨 Laser' }
                    ].map(btn => (
                      <button
                        key={btn.id}
                        onClick={() => setDevisHistoryFilter(btn.id)}
                        className={`btn-tab ${devisHistoryFilter === btn.id ? 'active' : ''}`}
                        style={{
                          background: devisHistoryFilter === btn.id ? 'var(--accent-epoxy)' : 'rgba(255,255,255,0.02)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '6px 12px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {(() => {
                const filtered = savedEstimates.filter(est => {
                  const matchSearch = est.title.toLowerCase().includes(devisHistorySearch.toLowerCase()) || 
                                      (est.woodSpecies && est.woodSpecies.toLowerCase().includes(devisHistorySearch.toLowerCase())) ||
                                      (est.notes && est.notes.toLowerCase().includes(devisHistorySearch.toLowerCase()));
                  const matchCat = devisHistoryFilter === 'all' || est.category === devisHistoryFilter;
                  return matchSearch && matchCat;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="glass" style={{ padding: '40px', borderRadius: '24px', textAlign: 'center', color: 'var(--text-muted)' }}>
                      Aucun projet historique ne correspond à votre recherche actuelle.
                    </div>
                  );
                }

                return (
                  <div className="devis-history-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '20px' }}>
                    {filtered.map((est) => (
                      <div key={est.id} className="glass card-history" style={{ 
                        padding: '24px', 
                        borderRadius: '20px', 
                        border: '1px solid rgba(255,255,255,0.06)',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between',
                        transition: 'all 0.3s ease',
                        background: 'linear-gradient(135deg, rgba(20, 10, 20, 0.4) 0%, rgba(10, 0, 10, 0.6) 100%)'
                      }}>
                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                            <span style={{ 
                              fontSize: '0.75rem', 
                              padding: '4px 10px', 
                              borderRadius: '20px', 
                              background: 'rgba(176, 84, 156, 0.15)',
                              color: 'var(--accent-epoxy-glow)',
                              fontWeight: '600',
                              border: '1px solid rgba(176, 84, 156, 0.25)'
                            }}>
                              {est.category === 'board' && '🍳 Planche de service'}
                              {est.category === 'table' && '🪵 Table rivière'}
                              {est.category === 'jewelry' && '💎 Bijou'}
                              {est.category === 'lichtenberg' && '⚡ Lichtenberg'}
                              {est.category === 'laser' && '🎨 Laser'}
                            </span>
                            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                              {est.date ? new Date(est.date).toLocaleDateString('fr-CA', { year: 'numeric', month: 'long' }) : 'Référence'}
                            </span>
                          </div>
                          
                          <h3 style={{ fontSize: '1.05rem', fontWeight: 'bold', color: '#fff', margin: '0 0 10px 0', lineHeight: '1.3' }}>
                            {est.title}
                          </h3>

                          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', display: 'flex', flexDirection: 'column', gap: '5px', marginBottom: '15px' }}>
                            <div>📏 Dimensions : <strong style={{ color: '#fff' }}>{est.dimensions || 'Non spécifiées'}</strong></div>
                            {est.woodSpecies && <div>🪵 Essence : <strong style={{ color: '#fff' }}>{est.woodSpecies.split(' ')[0]}</strong></div>}
                            {est.epoxyVolume > 0 && <div>💧 Époxy utilisé : <strong style={{ color: '#fff' }}>{est.epoxyVolume} L</strong></div>}
                            {est.laborHours && <div>⏳ Temps requis : <strong style={{ color: '#fff' }}>{est.laborHours} heures</strong></div>}
                          </div>

                          {est.notes && (
                            <p style={{ 
                              fontSize: '0.8rem', 
                              color: 'var(--text-muted)', 
                              fontStyle: 'italic', 
                              background: 'rgba(0,0,0,0.15)', 
                              padding: '10px 14px', 
                              borderRadius: '10px', 
                              margin: '0 0 20px 0',
                              borderLeft: '3px solid var(--accent-epoxy)'
                            }}>
                              "{est.notes}"
                            </p>
                          )}
                        </div>

                        <div>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '15px', marginTop: '10px' }}>
                            <div>
                              <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tarif de référence</div>
                              <div style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#10b981' }}>{est.finalPrice} $ CAD</div>
                            </div>
                            
                            <button
                              onClick={() => {
                                setProjectData({
                                  type: est.category === 'board' ? 'Planche de présentation' : est.category === 'table' ? 'Table rivière' : est.category === 'jewelry' ? 'Bijou en bois/époxy' : est.category === 'lichtenberg' ? 'Fractale de Lichtenberg' : 'Découpe & Gravure laser',
                                  wood: est.woodSpecies || '',
                                  epoxy: est.epoxyVolume > 0 ? "Bleu océan translucide / Turquoise" : "Pas d'époxy (Bois brut ou gravure seule)",
                                  legs: est.category === 'table' ? 'Pieds en X' : '',
                                  dimensions: est.dimensions || '',
                                  length: est.length || '',
                                  width: est.width || '',
                                  thickness: est.thickness || '',
                                  presetSize: est.length ? 'custom' : '',
                                  notes: `Inspiré par la référence historique : "${est.title}".`,
                                  name: '',
                                  email: '',
                                  phone: '',
                                  fileBase64: '',
                                  fileName: '',
                                  fileSize: '',
                                  cloudLink: ''
                                });
                                setBuilderStep(3);
                                setBuilderSubmitted(false);
                                document.getElementById('devis')?.scrollIntoView({ behavior: 'smooth' });
                              }}
                              className="btn-primary"
                              style={{ padding: '8px 12px', fontSize: '0.75rem', borderRadius: '8px', cursor: 'pointer' }}
                            >
                              Utiliser comme base
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                );
              })()}
            </div>
        </section>

        {/* L'ATELIER & BIO */}
        <section id="atelier">
          <div className="about-grid">
            <div className="about-text-col">
              <h2 className="section-title" style={{ textAlign: 'left' }}>L'Artiste derrière le Bois</h2>
              <h3>Evan Patruno</h3>
              <p>
                Passionné par le travail manuel et les textures contrastées, je crée sous la signature <strong>Evan Patruno Art</strong>. Mon atelier est un laboratoire où les matières brutes, la technologie moderne et les énergies de la nature fusionnent.
              </p>
              <p>
                Chaque morceau de bois est choisi pour ses imperfections naturelles, ses nœuds et ses courbes, que je mets en valeur par des techniques uniques de résine colorée ou de brûlure haute tension.
              </p>

              <div className="about-features">
                <div className="about-feat-item">
                  <div className="about-feat-icon"><Flame size={20} /></div>
                  <div className="about-feat-text">
                    <h4>Fractales de Lichtenberg (10k Volts)</h4>
                    <p>Technique consistant à faire circuler un arc électrique de haute tension dans le bois pour y graver des motifs semblables à des éclairs.</p>
                  </div>
                </div>

                <div className="about-feat-item">
                  <div className="about-feat-icon"><Sparkles size={20} /></div>
                  <div className="about-feat-text">
                    <h4>Coulées de Résine Époxy de Haute Qualité</h4>
                    <p>Utilisation d'époxy à haute résistance, transparente ou teintée de pigments métalliques fins pour des finitions d'une clarté de miroir.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="about-media-col">
              <div className="about-profile-card glass" id="profile-card">
                <div className="about-image-frame" style={{ overflow: 'hidden' }}>
                  <img src="/assets/evan-photo.jpg" alt="Evan Patruno" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
                <div className="about-badge-social">
                  <h4 style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: '4px' }}>Evan Patruno</h4>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Artisan &amp; Créateur</p>
                  
                  <div className="about-social-row">
                    <a href="https://www.instagram.com/evanpatruno.art/" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Instagram">
                      <Instagram size={18} />
                    </a>
                    <a href="https://www.facebook.com/evanpatruno.EP" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Facebook">
                      <Facebook size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* INSTAGRAM FEED SECTION */}
        <section className="instagram-feed-section">
          <div className="section-header" style={{ marginBottom: '40px' }}>
            <h2 className="section-title">Suivez mon travail sur Instagram</h2>
            <p className="section-subtitle">
              Découvrez les coulisses de la création et les dernières pièces sorties de l'atelier sur <a href="https://www.instagram.com/evanpatruno.art/" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-epoxy)', fontWeight: 'bold' }}>@evanpatruno.art</a>
            </p>
          </div>
          
          <div className="instagram-grid" id="instagram-feed-grid">
            {instagramPosts.map((post) => (
              <a 
                key={post.id} 
                href={post.postUrl} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="instagram-item"
                id={`instagram-post-${post.id}`}
              >
                <img src={post.image} alt={post.caption} className="instagram-img" loading="lazy" />
                <div className="instagram-overlay">
                  <p className="instagram-caption">{post.caption}</p>
                  <div className="instagram-stats">
                    <span>❤️ {post.likes}</span>
                    <span>💬 {post.comments}</span>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </section>

        {/* ORDER TRACKING SECTION */}
        <section id="suivi-commande" style={{ borderBottom: '1px solid var(--border-color)' }}>
          <div className="section-header">
            <h2 className="section-title">Suivi de Commande en Direct</h2>
            <p className="section-subtitle">
              Entrez votre numéro de commande unique reçu lors de votre achat pour suivre son avancement en temps réel dans notre atelier.
            </p>
          </div>

          <div className="glass order-tracker-container" style={{ maxWidth: '800px', margin: '0 auto', padding: '30px' }}>
            <form onSubmit={handleTrackOrder} style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginBottom: '20px' }}>
              <input 
                type="text" 
                className="faq-search-input"
                placeholder="Entrez votre numéro de commande (ex: jx8f2Nf...)"
                value={trackingOrderId}
                onChange={(e) => setTrackingOrderId(e.target.value)}
                style={{ maxWidth: '450px', margin: 0 }}
              />
              <button type="submit" className="btn-primary" style={{ padding: '12px 24px', whiteSpace: 'nowrap' }}>
                Rechercher
              </button>
            </form>

            {trackingError && (
              <p style={{ color: 'var(--accent-laser)', fontSize: '0.9rem', marginTop: '10px' }}>{trackingError}</p>
            )}

            {trackedOrder && (
              <div style={{ marginTop: '30px', animation: 'fadeIn 0.5s ease' }}>
                <h3 style={{ color: '#fff', fontSize: '1.2rem', marginBottom: '10px' }}>
                  Commande : <span style={{ color: 'var(--accent-epoxy)' }}>{trackedOrder.id}</span>
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Objet : <strong>{trackedOrder.creationTitle || 'Projet personnalisé'}</strong> — Client : {trackedOrder.customerName}
                </p>

                <div className="order-tracker-stepper">
                  <div 
                    className="order-tracker-progress-line" 
                    style={{ 
                      width: `${
                        trackedOrder.status === 'received' ? 5 :
                        trackedOrder.status === 'production' ? 38 :
                        trackedOrder.status === 'finishing' ? 71 :
                        trackedOrder.status === 'shipped' ? 90 : 5
                      }%` 
                    }}
                  ></div>

                  {[
                    { label: '📦 Commande Reçue', statusKey: 'received' },
                    { label: '⚙️ En fabrication', statusKey: 'production' },
                    { label: '🎨 Finition & Laser', statusKey: 'finishing' },
                    { label: '🚚 Prêt / Expédié', statusKey: 'shipped' }
                  ].map((step, idx) => {
                    const statuses = ['received', 'production', 'finishing', 'shipped'];
                    const currentIdx = statuses.indexOf(trackedOrder.status || 'received');
                    const isCompleted = idx < currentIdx;
                    const isActive = idx === currentIdx;
                    
                    return (
                      <div 
                        key={idx} 
                        className={`order-tracker-step ${isCompleted ? 'completed' : ''} ${isActive ? 'active' : ''}`}
                      >
                        <div className="order-tracker-icon">
                          {idx + 1}
                        </div>
                        <span className="order-tracker-label">{step.label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact">
          <div className="section-header">
            <h2 className="section-title">Discutons de votre projet</h2>
            <p className="section-subtitle">
              Vous avez des questions sur un produit existant, ou souhaitez commander une création personnalisée ? Envoyez-moi un message directement.
            </p>
          </div>

          <div className="contact-grid">
            <div className="contact-info-col">
              <div className="contact-card-info glass" id="contact-info-card">
                <h3 className="contact-info-title">Mes coordonnées</h3>
                
                <div className="contact-list">
                  <div className="contact-item">
                    <div className="contact-icon-box"><Mail size={18} /></div>
                    <div>
                      <span className="contact-label">Email</span>
                      <p className="contact-value"><a href="mailto:info@evanpatruno.ca">info@evanpatruno.ca</a></p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon-box"><Phone size={18} /></div>
                    <div>
                      <span className="contact-label">Téléphone</span>
                      <p className="contact-value">514-567-3249</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon-box"><MapPin size={18} /></div>
                    <div>
                      <span className="contact-label">Localisation</span>
                      <p className="contact-value">Saint-Jean-sur-Richelieu, QC, Canada</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-card-info glass" id="socials-card">
                <h3 className="contact-info-title">Réseaux Sociaux</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Suivez mon quotidien à l'atelier et découvrez les coulisses des prochaines coulées !
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  <div style={{ display: 'flex', gap: '15px' }}>
                    <a href="https://www.instagram.com/evanpatruno.art/" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', padding: '12px' }}>
                      <Instagram size={18} /> Instagram
                    </a>
                    <a href="https://www.facebook.com/evanpatruno.EP" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', padding: '12px' }}>
                      <Facebook size={18} /> Facebook
                    </a>
                  </div>
                  <a href="https://linktr.ee/evanpatruno.art" target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '10px', justifyContent: 'center', padding: '12px', background: 'linear-gradient(135deg, #39E09B, #2BBD84)', border: 'none', color: '#100010' }}>
                    <Sparkles size={16} /> Visiter mon Linktree
                  </a>
                </div>
              </div>
            </div>

            <div className="contact-form-col glass" id="contact-form-card">
              {!contactSubmitted ? (
                <form onSubmit={handleContactSubmit} className="contact-form" id="contact-form">
                  <div className="form-row">
                    <div className="builder-form-group">
                      <label htmlFor="contact-name">Nom complet *</label>
                      <input 
                        type="text" 
                        id="contact-name" 
                        className="builder-input" 
                        required
                        value={contactData.name}
                        onChange={(e) => setContactData(prev => ({ ...prev, name: e.target.value }))}
                      />
                    </div>
                    <div className="builder-form-group">
                      <label htmlFor="contact-email">Email *</label>
                      <input 
                        type="email" 
                        id="contact-email" 
                        className="builder-input" 
                        required
                        value={contactData.email}
                        onChange={(e) => setContactData(prev => ({ ...prev, email: e.target.value }))}
                      />
                    </div>
                  </div>

                  <div className="builder-form-group">
                    <label htmlFor="contact-subject">Sujet</label>
                    <input 
                      type="text" 
                      id="contact-subject" 
                      className="builder-input"
                      value={contactData.subject}
                      onChange={(e) => setContactData(prev => ({ ...prev, subject: e.target.value }))}
                    />
                  </div>

                  <div className="builder-form-group">
                    <label htmlFor="contact-message">Message *</label>
                    <textarea 
                      id="contact-message" 
                      className="builder-textarea" 
                      required
                      placeholder="Votre message ici..."
                      value={contactData.message}
                      onChange={(e) => setContactData(prev => ({ ...prev, message: e.target.value }))}
                    ></textarea>
                  </div>

                  <button type="submit" className="btn-form-submit" id="contact-submit-btn">
                    <Send size={18} /> Envoyer le message
                  </button>
                </form>
              ) : (
                <div className="success-message" id="contact-success">
                  <div className="success-icon"><CheckCircle2 size={36} /></div>
                  <h3 className="success-title">Message Envoyé !</h3>
                  <p className="success-text">
                    Merci {contactData.name}. Votre message a bien été reçu. Je vous répondrai dans les plus brefs délais à l'adresse <strong>{contactData.email}</strong>.
                  </p>
                  <button onClick={() => { setContactSubmitted(false); setContactData({ name: '', email: '', subject: '', message: '' }) }} className="btn-secondary" id="reset-contact-btn">Envoyer un autre message</button>
                </div>
              )}
            </div>
          </div>
        </section>

        {isAdminLoggedIn && (
          <section id="admin-dashboard" className="admin-dashboard">
            <div className="section-header">
              <h2 className="section-title">Tableau de bord Administrateur</h2>
              <p className="section-subtitle">
                Gérez vos créations, estimez les coûts de vos projets sur mesure et consultez l'historique de vos tarifs.
              </p>
            </div>

            {/* ADMIN NAVIGATION TABS */}
            <div className="admin-tabs" style={{ display: 'flex', gap: '15px', marginBottom: '25px', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', flexWrap: 'wrap' }}>
              <button 
                onClick={() => setAdminActiveTab('boutique')} 
                className={`btn-tab ${adminActiveTab === 'boutique' ? 'active' : ''}`}
                style={{
                  background: adminActiveTab === 'boutique' ? 'var(--accent-epoxy)' : 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <Hammer size={18} />
                Boutique &amp; Catalogue
              </button>
              <button 
                onClick={() => setAdminActiveTab('calculator')} 
                className={`btn-tab ${adminActiveTab === 'calculator' ? 'active' : ''}`}
                style={{
                  background: adminActiveTab === 'calculator' ? 'var(--accent-epoxy)' : 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <Calculator size={18} />
                Calculateur de Prix Artisan
              </button>
              <button 
                onClick={() => setAdminActiveTab('feed')} 
                className={`btn-tab ${adminActiveTab === 'feed' ? 'active' : ''}`}
                style={{
                  background: adminActiveTab === 'feed' ? 'var(--accent-epoxy)' : 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <History size={18} />
                Flux d'Activité &amp; Devis ({activityFeed.length})
              </button>
              <button 
                onClick={() => setAdminActiveTab('history_records')} 
                className={`btn-tab ${adminActiveTab === 'history_records' ? 'active' : ''}`}
                style={{
                  background: adminActiveTab === 'history_records' ? 'var(--accent-epoxy)' : 'transparent',
                  color: '#fff',
                  border: '1px solid rgba(255,255,255,0.1)',
                  borderRadius: '12px',
                  padding: '10px 20px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s'
                }}
              >
                <Search size={18} />
                Historique Devis &amp; Commandes
              </button>
            </div>

            {/* TAB 1: BOUTIQUE & CATALOGUE */}
            {adminActiveTab === 'boutique' && (
              <div className="admin-boutique-tab animate-fade-in">
                {/* ADMIN METRICS PANEL */}
                {(() => {
                  const ordersCount = activityFeed.filter(act => act.type === 'order').length;
                  const totalRevenue = activityFeed
                    .filter(act => act.type === 'order')
                    .reduce((sum, act) => {
                      const raw = act.priceCAD || act.convertedPrice || "0";
                      const val = parseFloat(raw.replace(/[^0-9]/g, '')) || 0;
                      return sum + val;
                    }, 0);
                  const leadsCount = activityFeed.filter(act => act.type === 'project' || act.type === 'inquiry' || act.type === 'chatbot').length;
                  const totalActs = activityFeed.length || 1;
                  const conversionRate = ((ordersCount / totalActs) * 100).toFixed(1);

                  return (
                    <div className="admin-metrics-grid" style={{ marginBottom: '30px' }}>
                      <div className="metric-card glass" style={{ borderLeft: '4px solid var(--accent-epoxy)' }}>
                        <span className="metric-title">Chiffre d'Affaires</span>
                        <span className="metric-value">{totalRevenue.toLocaleString('fr-CA')} $ CAD</span>
                        <span style={{ fontSize: '0.75rem', color: '#10b981' }}>📈 Ventes simulées Stripe</span>
                      </div>
                      <div className="metric-card glass" style={{ borderLeft: '4px solid var(--accent-wood)' }}>
                        <span className="metric-title">Commandes Reçues</span>
                        <span className="metric-value">{ordersCount}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>🛒 Panier &amp; Achat Direct</span>
                      </div>
                      <div className="metric-card glass" style={{ borderLeft: '4px solid var(--accent-voltage)' }}>
                        <span className="metric-title">Prospects / Leads</span>
                        <span className="metric-value">{leadsCount}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>✉️ Formulaires &amp; Chatbot</span>
                      </div>
                      <div className="metric-card glass" style={{ borderLeft: '4px solid var(--accent-laser)' }}>
                        <span className="metric-title">Taux d'Engagement</span>
                        <span className="metric-value">{conversionRate} %</span>
                        <span style={{ fontSize: '0.75rem', color: '#3b82f6' }}>⚡ Taux de conversion</span>
                      </div>
                    </div>
                  );
                })()}

                <div className="admin-dashboard-grid">
                  {/* Form Col */}
                  <div className="admin-form-container glass">
                    <h3 className="contact-info-title" style={{ marginBottom: '20px' }}>
                      {editingCreation ? "Modifier l'œuvre" : "Ajouter une œuvre"}
                    </h3>
                    <form onSubmit={handleSaveCreation} className="contact-form">
                      <div className="builder-form-group">
                        <label htmlFor="form-title">Titre de l'œuvre *</label>
                        <input 
                          type="text" 
                          id="form-title" 
                          className="builder-input" 
                          required 
                          value={adminForm.title}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div className="form-row">
                        <div className="builder-form-group">
                          <label htmlFor="form-category">Catégorie *</label>
                          <select 
                            id="form-category" 
                            className="builder-select" 
                            value={adminForm.category}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, category: e.target.value }))}
                          >
                            <option value="table">🪵 Table &amp; Mobilier</option>
                            <option value="jewelry">💎 Bijoux</option>
                            <option value="lichtenberg">⚡ Fractale Lichtenberg</option>
                            <option value="laser">🎨 Art Laser &amp; Acrylique</option>
                          </select>
                        </div>

                        <div className="builder-form-group">
                          <label htmlFor="form-status">Statut *</label>
                          <select 
                            id="form-status" 
                            className="builder-select" 
                            value={adminForm.status}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, status: e.target.value }))}
                          >
                            <option value="available">Disponible</option>
                            <option value="sold">Vendu</option>
                            <option value="custom-only">Sur commande</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="builder-form-group">
                          <label htmlFor="form-price">Prix (ex: 1 850 $ ou Sur demande) *</label>
                          <input 
                            type="text" 
                            id="form-price" 
                            className="builder-input" 
                            required 
                            value={adminForm.price}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, price: e.target.value }))}
                          />
                        </div>

                        <div className="builder-form-group">
                          <label htmlFor="form-image">Nom du fichier image (ex: table.png) *</label>
                          <input 
                            type="text" 
                            id="form-image" 
                            className="builder-input" 
                            placeholder="nom-fichier.png (déposé dans public/assets)"
                            required 
                            value={adminForm.image}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, image: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-row">
                        <div className="builder-form-group">
                          <label htmlFor="form-wood">Essence de bois</label>
                          <input 
                            type="text" 
                            id="form-wood" 
                            className="builder-input" 
                            placeholder="Ex: Frêne, Noyer, N/A"
                            value={adminForm.wood}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, wood: e.target.value }))}
                          />
                        </div>

                        <div className="builder-form-group">
                          <label htmlFor="form-dimensions">Dimensions</label>
                          <input 
                            type="text" 
                            id="form-dimensions" 
                            className="builder-input" 
                            placeholder='Ex: 24" x 30", Diamètre 24"'
                            value={adminForm.dimensions}
                            onChange={(e) => setAdminForm(prev => ({ ...prev, dimensions: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="builder-form-group">
                        <label htmlFor="form-mediums">Médiums / Résine / Matériaux</label>
                        <input 
                          type="text" 
                          id="form-mediums" 
                          className="builder-input" 
                          placeholder="Ex: Résine turquoise, Acrylique pouring"
                          value={adminForm.mediums}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, mediums: e.target.value }))}
                        />
                      </div>

                      <div className="builder-form-group">
                        <label htmlFor="form-desc">Description de l'œuvre *</label>
                        <textarea 
                          id="form-desc" 
                          className="builder-textarea" 
                          required 
                          value={adminForm.desc}
                          onChange={(e) => setAdminForm(prev => ({ ...prev, desc: e.target.value }))}
                        ></textarea>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        {editingCreation && (
                          <button 
                            type="button" 
                            onClick={() => {
                              setEditingCreation(null);
                              setAdminForm({
                                title: '',
                                category: 'table',
                                desc: '',
                                price: '',
                                status: 'available',
                                image: '',
                                wood: '',
                                dimensions: '',
                                mediums: ''
                              });
                            }} 
                            className="btn-secondary" 
                            style={{ flex: 1 }}
                          >
                            Annuler
                          </button>
                        )}
                        <button type="submit" className="btn-form-submit" style={{ flex: 1, marginTop: 0 }}>
                          {editingCreation ? "Enregistrer" : "Créer l'œuvre"}
                        </button>
                      </div>
                    </form>
                  </div>

                  {/* List Col */}
                  <div className="admin-list-container glass">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '15px' }}>
                      <h3 className="contact-info-title" style={{ margin: 0 }}>Catalogue Actuel ({creations.length})</h3>
                      <button onClick={() => setIsAdminLoggedIn(false)} className="btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }}>Déconnexion</button>
                    </div>
                    
                    <div className="admin-list-scroll">
                      {creations.map((item) => (
                        <div key={item.id} className="admin-item-row">
                          <div className="admin-item-meta">
                            <img src={item.image} alt={item.title} className="admin-item-thumb" />
                            <div className="admin-item-info">
                              <h4>{item.title}</h4>
                              <p>{item.price} • {item.statusText}</p>
                            </div>
                          </div>
                          <div className="admin-item-actions">
                            <button onClick={() => handleSelectEdit(item)} className="btn-admin-edit">Modifier</button>
                            <button onClick={() => handleDeleteCreation(item.id)} className="btn-admin-delete">Supprimer</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: ARTISAN PRICING CALCULATOR */}
            {adminActiveTab === 'calculator' && (
              <div className="admin-calculator-tab animate-fade-in">
                <div className="admin-dashboard-grid">
                  {/* Cost Simulator Form */}
                  <div className="admin-form-container glass">
                    <h3 className="contact-info-title" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Calculator size={20} style={{ color: 'var(--accent-epoxy)' }} />
                      Simulateur de Devis Artisan
                    </h3>
                    <form onSubmit={handleSaveEstimate} className="contact-form">
                      <div className="builder-form-group">
                        <label htmlFor="calc-title">Titre / Nom du client de la simulation *</label>
                        <input 
                          type="text" 
                          id="calc-title" 
                          className="builder-input" 
                          placeholder="Ex: Planche apéro Sophie, Table Tremblay"
                          required 
                          value={calcForm.title}
                          onChange={(e) => setCalcForm(prev => ({ ...prev, title: e.target.value }))}
                        />
                      </div>

                      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="builder-form-group">
                          <label htmlFor="calc-category">Catégorie *</label>
                          <select 
                            id="calc-category" 
                            className="builder-select"
                            value={calcForm.category}
                            onChange={(e) => {
                              const cat = e.target.value;
                              let defaultEpoxy = '15';
                              let defaultHours = '4';
                              if (cat === 'table') { defaultEpoxy = '35'; defaultHours = '25'; }
                              else if (cat === 'board') { defaultEpoxy = '15'; defaultHours = '4'; }
                              else if (cat === 'jewelry') { defaultEpoxy = '70'; defaultHours = '2'; }
                              else if (cat === 'lichtenberg') { defaultEpoxy = '20'; defaultHours = '3'; }
                              else if (cat === 'laser') { defaultEpoxy = '0'; defaultHours = '1'; }
                              
                              setCalcForm(prev => ({ 
                                ...prev, 
                                category: cat,
                                epoxyPercent: defaultEpoxy,
                                laborHours: defaultHours
                              }));
                            }}
                          >
                            <option value="board">🍳 Planche de présentation</option>
                            <option value="table">🪵 Table &amp; Mobilier</option>
                            <option value="jewelry">💎 Bijoux</option>
                            <option value="lichtenberg">⚡ Fractale Lichtenberg</option>
                            <option value="laser">🎨 Gravure/Découpe Laser</option>
                          </select>
                        </div>

                        <div className="builder-form-group">
                          <label htmlFor="calc-wood">Essence de bois</label>
                          <select 
                            id="calc-wood" 
                            className="builder-select"
                            value={calcForm.woodSpecies}
                            onChange={(e) => {
                              const wood = e.target.value;
                              const price = woodPriceMapping[wood] || 9;
                              setCalcForm(prev => ({ 
                                ...prev, 
                                woodSpecies: wood,
                                woodCostPerBF: String(price)
                              }));
                            }}
                          >
                            <option value="Noyer noir (Foncé, grain riche)">Noyer noir (Foncé)</option>
                            <option value="Érable (Clair, très robuste)">Érable (Clair)</option>
                            <option value="Cèdre (Chaud, excellent parfum, résistant)">Cèdre (Chaud)</option>
                            <option value="Cerisier (Ambré, grain fin)">Cerisier (Ambré)</option>
                            <option value="Autre / Je ne sais pas encore">Autre / Pin</option>
                          </select>
                        </div>
                      </div>

                      {/* Dimensions Section */}
                      <div style={{ padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)', background: 'rgba(0,0,0,0.15)', marginBottom: '15px' }}>
                        <h4 style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>Dimensions Brutes (pouces)</h4>
                        <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                          <div className="builder-form-group">
                            <label htmlFor="calc-length" style={{ fontSize: '0.75rem' }}>Longueur (L)</label>
                            <input 
                              type="number" 
                              id="calc-length" 
                              className="builder-input" 
                              value={calcForm.length}
                              onChange={(e) => setCalcForm(prev => ({ ...prev, length: e.target.value }))}
                            />
                          </div>
                          <div className="builder-form-group">
                            <label htmlFor="calc-width" style={{ fontSize: '0.75rem' }}>Largeur (W)</label>
                            <input 
                              type="number" 
                              id="calc-width" 
                              className="builder-input" 
                              value={calcForm.width}
                              onChange={(e) => setCalcForm(prev => ({ ...prev, width: e.target.value }))}
                            />
                          </div>
                          <div className="builder-form-group">
                            <label htmlFor="calc-thickness" style={{ fontSize: '0.75rem' }}>Épaisseur (T)</label>
                            <input 
                              type="number" 
                              step="0.25"
                              id="calc-thickness" 
                              className="builder-input" 
                              value={calcForm.thickness}
                              onChange={(e) => setCalcForm(prev => ({ ...prev, thickness: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Advanced Settings Row */}
                      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <div className="builder-form-group">
                          <label htmlFor="calc-epoxy-pct">Remplissage Époxy (%)</label>
                          <input 
                            type="number" 
                            id="calc-epoxy-pct" 
                            className="builder-input" 
                            min="0" max="100"
                            value={calcForm.epoxyPercent}
                            onChange={(e) => setCalcForm(prev => ({ ...prev, epoxyPercent: e.target.value }))}
                          />
                        </div>

                        <div className="builder-form-group">
                          <label htmlFor="calc-hours">Heures de travail</label>
                          <input 
                            type="number" 
                            id="calc-hours" 
                            className="builder-input" 
                            value={calcForm.laborHours}
                            onChange={(e) => setCalcForm(prev => ({ ...prev, laborHours: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-row" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                        <div className="builder-form-group">
                          <label htmlFor="calc-wood-bf" style={{ fontSize: '0.75rem' }}>Bois ($ / BF)</label>
                          <input 
                            type="number" 
                            id="calc-wood-bf" 
                            className="builder-input" 
                            value={calcForm.woodCostPerBF}
                            onChange={(e) => setCalcForm(prev => ({ ...prev, woodCostPerBF: e.target.value }))}
                          />
                        </div>
                        <div className="builder-form-group">
                          <label htmlFor="calc-epoxy-l" style={{ fontSize: '0.75rem' }}>Époxy ($ / L)</label>
                          <input 
                            type="number" 
                            id="calc-epoxy-l" 
                            className="builder-input" 
                            value={calcForm.epoxyCostPerL}
                            onChange={(e) => setCalcForm(prev => ({ ...prev, epoxyCostPerL: e.target.value }))}
                          />
                        </div>
                        <div className="builder-form-group">
                          <label htmlFor="calc-margin" style={{ fontSize: '0.75rem' }}>Coeff. Marge</label>
                          <input 
                            type="number" 
                            step="0.1"
                            id="calc-margin" 
                            className="builder-input" 
                            value={calcForm.marginMultiplier}
                            onChange={(e) => setCalcForm(prev => ({ ...prev, marginMultiplier: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="builder-form-group">
                        <label htmlFor="calc-notes">Notes / Détails de fabrication</label>
                        <textarea 
                          id="calc-notes" 
                          className="builder-textarea" 
                          placeholder="Ex: Forme organique, pieds d'acier noir, huile Rubio..."
                          value={calcForm.notes}
                          onChange={(e) => setCalcForm(prev => ({ ...prev, notes: e.target.value }))}
                        ></textarea>
                      </div>

                      {/* Live calculation preview */}
                      {(() => {
                        const len = parseFloat(calcForm.length) || 0;
                        const wid = parseFloat(calcForm.width) || 0;
                        const thick = parseFloat(calcForm.thickness) || 0;
                        const epoxyPct = parseFloat(calcForm.epoxyPercent) || 0;
                        const hours = parseFloat(calcForm.laborHours) || 0;
                        const rate = parseFloat(calcForm.hourlyRate) || 40;
                        const wCost = parseFloat(calcForm.woodCostPerBF) || 0;
                        const eCost = parseFloat(calcForm.epoxyCostPerL) || 0;
                        const finish = parseFloat(calcForm.finishingCost) || 20;
                        const margin = parseFloat(calcForm.marginMultiplier) || 1.4;

                        const totalVol = len * wid * thick;
                        const epFrac = epoxyPct / 100;
                        const wBF = (totalVol * (1 - epFrac)) / 12;
                        const woodTot = wBF * wCost;
                        const epoxyVolL = totalVol * epFrac * 0.0163871;
                        const epoxyTot = epoxyVolL * eCost;
                        const laborTot = hours * rate;
                        const totalDirect = woodTot + epoxyTot + laborTot + finish;
                        const retailSuggested = Math.round(totalDirect * margin);

                        return (
                          <div style={{ padding: '15px', borderRadius: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Bois ({wBF.toFixed(1)} BF) :</span>
                              <span style={{ fontWeight: '600' }}>{Math.round(woodTot)} $ CAD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Époxy ({epoxyVolL.toFixed(2)} L) :</span>
                              <span style={{ fontWeight: '600' }}>{Math.round(epoxyTot)} $ CAD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '0.85rem' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Main d'œuvre ({hours}h @ {rate}$/h) :</span>
                              <span style={{ fontWeight: '600' }}>{Math.round(laborTot)} $ CAD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', fontSize: '0.85rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '8px' }}>
                              <span style={{ color: 'var(--text-secondary)' }}>Finition &amp; Consommables :</span>
                              <span style={{ fontWeight: '600' }}>{finish} $ CAD</span>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--accent-epoxy)', fontWeight: 'bold', textTransform: 'uppercase' }}>Prix suggéré (x{margin}) :</span>
                              <span style={{ fontSize: '1.4rem', fontWeight: 'bold', color: '#10b981' }}>{retailSuggested} $ CAD</span>
                            </div>
                          </div>
                        );
                      })()}

                      <button type="submit" className="btn-form-submit" style={{ width: '100%', marginTop: '0' }}>
                        <Send size={16} /> Enregistrer comme référence historique
                      </button>
                    </form>
                  </div>

                  {/* References & History List */}
                  <div className="admin-list-container glass" style={{ display: 'flex', flexDirection: 'column' }}>
                    <div style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '15px' }}>
                      <h3 className="contact-info-title" style={{ margin: '0 0 15px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <History size={20} style={{ color: 'var(--accent-wood)' }} />
                        Références &amp; Historique ({savedEstimates.length})
                      </h3>
                      
                      {/* Search and Filters */}
                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <div style={{ flex: 1, minWidth: '150px', position: 'relative' }}>
                          <input 
                            type="text" 
                            placeholder="Rechercher une simulation..." 
                            className="builder-input" 
                            style={{ paddingLeft: '35px', margin: 0, fontSize: '0.85rem', height: '38px' }}
                            value={estimateSearch}
                            onChange={(e) => setEstimateSearch(e.target.value)}
                          />
                          <Search size={14} style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--text-secondary)' }} />
                        </div>
                        
                        <select
                          className="builder-select"
                          style={{ width: 'auto', minWidth: '130px', margin: 0, fontSize: '0.85rem', height: '38px' }}
                          value={estimateCategoryFilter}
                          onChange={(e) => setEstimateCategoryFilter(e.target.value)}
                        >
                          <option value="all">📁 Catégories (Tous)</option>
                          <option value="board">🍳 Planches</option>
                          <option value="table">🪵 Tables</option>
                          <option value="jewelry">💎 Bijoux</option>
                          <option value="lichtenberg">⚡ Lichtenberg</option>
                          <option value="laser">🎨 Laser</option>
                        </select>
                      </div>
                    </div>

                    {/* Estimates List */}
                    <div className="admin-list-scroll" style={{ flex: 1 }}>
                      {(() => {
                        const filtered = savedEstimates.filter(est => {
                          const matchSearch = est.title.toLowerCase().includes(estimateSearch.toLowerCase()) || 
                                              (est.woodSpecies && est.woodSpecies.toLowerCase().includes(estimateSearch.toLowerCase())) ||
                                              (est.notes && est.notes.toLowerCase().includes(estimateSearch.toLowerCase()));
                          const matchCat = estimateCategoryFilter === 'all' || est.category === estimateCategoryFilter;
                          return matchSearch && matchCat;
                        });

                        if (filtered.length === 0) {
                          return (
                            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '30px' }}>
                              Aucune simulation trouvée.
                            </p>
                          );
                        }

                        return filtered.map((est) => (
                          <div key={est.id} className="admin-item-row" style={{ display: 'block', padding: '15px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '10px' }}>
                              <div>
                                <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#fff' }}>{est.title}</h4>
                                <p style={{ margin: '3px 0 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                                  {est.category === 'board' && '🍳 Planche de présentation'}
                                  {est.category === 'table' && '🪵 Table rivière'}
                                  {est.category === 'jewelry' && '💎 Bijou'}
                                  {est.category === 'lichtenberg' && '⚡ Lichtenberg'}
                                  {est.category === 'laser' && '🎨 Laser'}
                                  {` • ${est.woodSpecies ? est.woodSpecies.split(' ')[0] : 'Bois non spécifié'} • ${est.dimensions}`}
                                </p>
                              </div>
                              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
                                <span style={{ fontWeight: 'bold', color: '#10b981', fontSize: '1rem' }}>{est.finalPrice} $ CAD</span>
                                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{est.date ? est.date.toLocaleDateString('fr-CA') : 'Récemment'}</span>
                              </div>
                            </div>
                            
                            {/* Breakdown expander toggle */}
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px', justifyContent: 'flex-end', borderTop: '1px solid rgba(255,255,255,0.03)', paddingTop: '8px' }}>
                              <button 
                                onClick={() => setSelectedEstimateDetail(selectedEstimateDetail === est.id ? null : est.id)} 
                                className="btn-admin-edit" 
                                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                              >
                                {selectedEstimateDetail === est.id ? "Masquer détails" : "Voir détails"}
                              </button>
                              <button 
                                onClick={() => handleDeleteEstimate(est.id)} 
                                className="btn-admin-delete" 
                                style={{ fontSize: '0.75rem', padding: '3px 8px' }}
                              >
                                Supprimer
                              </button>
                            </div>

                            {/* Detailed Breakdown Panel */}
                            {selectedEstimateDetail === est.id && (
                              <div className="estimate-details-expanded" style={{
                                marginTop: '12px',
                                padding: '12px',
                                borderRadius: '8px',
                                background: 'rgba(0,0,0,0.25)',
                                border: '1px solid rgba(255,255,255,0.05)',
                                fontSize: '0.8rem',
                                color: 'var(--text-secondary)'
                              }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px 15px' }}>
                                  <div>Coût Bois : <strong style={{ color: '#fff' }}>{est.woodCost} $</strong></div>
                                  <div>Volume Époxy : <strong style={{ color: '#fff' }}>{est.epoxyVolume} L</strong></div>
                                  <div>Coût Époxy : <strong style={{ color: '#fff' }}>{est.epoxyCost} $</strong></div>
                                  <div>Main d'œuvre : <strong style={{ color: '#fff' }}>{est.laborHours}h ({est.laborCost} $)</strong></div>
                                  <div>Finition &amp; Cons. : <strong style={{ color: '#fff' }}>{est.otherCosts} $</strong></div>
                                  <div>Coeff. Marge : <strong style={{ color: '#fff' }}>x{est.margin}</strong></div>
                                </div>
                                {est.notes && (
                                  <div style={{ marginTop: '8px', paddingTop: '8px', borderTop: '1px solid rgba(255,255,255,0.05)', fontStyle: 'italic' }}>
                                    Note : "{est.notes}"
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 3: LIVE ACTIVITY FEED */}
            {adminActiveTab === 'feed' && (
              <div className="activity-feed-section glass" style={{ padding: '30px', borderRadius: '24px' }}>
                <h3 className="contact-info-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                  Flux d'Activité &amp; Devis clients
                </h3>
                
                {activityFeed.length === 0 ? (
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                    Aucune activité récente détectée.
                  </p>
                ) : (
                  <div className="activity-feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                    {activityFeed.map((act) => (
                      <div key={act.id} className="activity-feed-item glass" style={{ padding: '20px', display: 'flex', gap: '15px' }}>
                        <div className="activity-icon" style={{ fontSize: '1.5rem' }}>
                          {act.type === 'order' && '🛒'}
                          {act.type === 'project' && '🪵'}
                          {act.type === 'inquiry' && '✉️'}
                          {act.type === 'chatbot' && '🤖'}
                        </div>
                        <div className="activity-content" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
                            <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{act.title}</strong>
                            <span className="activity-date">{act.date.toLocaleString('fr-CA')}</span>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', marginTop: '5px', fontSize: '0.9rem', lineHeight: '1.4' }}>{act.details}</p>
                          
                          {act.type === 'order' && (
                            <div style={{ marginTop: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Numéro de suivi : <code>{act.id}</code></span>
                              <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginLeft: '10px' }}>Statut :</span>
                              <select
                                value={act.status || 'received'}
                                onChange={(e) => updateOrderStatus(act.id, e.target.value)}
                                style={{
                                  background: '#1e0a19',
                                  color: '#fff',
                                  border: '1px solid rgba(255,255,255,0.15)',
                                  borderRadius: '6px',
                                  padding: '4px 8px',
                                  fontSize: '0.8rem',
                                  cursor: 'pointer',
                                  outline: 'none'
                                }}
                              >
                                <option value="received">📦 Commande Reçue</option>
                                <option value="production">⚙️ En fabrication</option>
                                <option value="finishing">🎨 Finition &amp; Laser</option>
                                <option value="shipped">🚚 Prêt / Expédié</option>
                              </select>
                            </div>
                          )}

                          {act.type === 'project' && (act.fileBase64 || act.cloudLink) && (
                            <div style={{ marginTop: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '10px' }}>
                              {act.fileBase64 && (
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                  {act.fileBase64.startsWith('data:image/') ? (
                                    <img src={act.fileBase64} alt="Sketch Preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                  ) : (
                                    <div style={{ width: '70px', height: '70px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>📄</div>
                                  )}
                                  <div>
                                    <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '500' }}>{act.fileName} ({act.fileSize})</div>
                                    <a href={act.fileBase64} download={act.fileName} className="btn-secondary" style={{ display: 'inline-block', fontSize: '0.75rem', padding: '4px 10px', marginTop: '6px', borderRadius: '4px', textDecoration: 'none' }}>
                                      Télécharger le fichier
                                    </a>
                                  </div>
                                </div>
                              )}
                              {act.cloudLink && (
                                <div style={{ marginTop: '10px' }}>
                                  <a href={act.cloudLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', textDecoration: 'none' }}>
                                    Voir dans le Cloud
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: HISTORY RECORDS */}
            {adminActiveTab === 'history_records' && (
              <div className="activity-feed-section glass" style={{ padding: '30px', borderRadius: '24px' }}>
                <h3 className="contact-info-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <Search size={20} style={{ color: 'var(--accent-epoxy)' }} />
                  Historique des Devis &amp; Commandes
                </h3>

                {/* Filters & Search */}
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: '25px', alignItems: 'center' }}>
                  <div style={{ flex: 1, minWidth: '280px', position: 'relative' }}>
                    <input 
                      type="text" 
                      placeholder="Rechercher par client, courriel, détails, commande..." 
                      className="builder-input" 
                      style={{ paddingLeft: '38px', margin: 0, fontSize: '0.9rem', height: '42px', width: '100%' }}
                      value={adminHistorySearch}
                      onChange={(e) => setAdminHistorySearch(e.target.value)}
                    />
                    <span style={{ position: 'absolute', left: '12px', top: '13px', color: 'var(--text-secondary)' }}>🔍</span>
                  </div>

                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {[
                      { id: 'all', label: 'Tout' },
                      { id: 'devis', label: '🪵 Devis sur Mesure' },
                      { id: 'orders', label: '🛒 Commandes Boutique' }
                    ].map(tab => (
                      <button
                        key={tab.id}
                        onClick={() => setAdminHistoryTab(tab.id)}
                        className={`btn-tab ${adminHistoryTab === tab.id ? 'active' : ''}`}
                        style={{
                          background: adminHistoryTab === tab.id ? 'var(--accent-epoxy)' : 'rgba(255,255,255,0.02)',
                          color: '#fff',
                          border: '1px solid rgba(255,255,255,0.1)',
                          borderRadius: '8px',
                          padding: '8px 16px',
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          transition: 'all 0.3s'
                        }}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* History Grid/List */}
                {(() => {
                  const filtered = activityFeed.filter(act => {
                    const matchType = adminHistoryTab === 'all'
                      ? (act.type === 'project' || act.type === 'order')
                      : adminHistoryTab === 'devis'
                        ? act.type === 'project'
                        : act.type === 'order';

                    if (!matchType) return false;

                    const searchLower = adminHistorySearch.toLowerCase();
                    return (
                      act.id.toLowerCase().includes(searchLower) ||
                      act.title.toLowerCase().includes(searchLower) ||
                      act.details.toLowerCase().includes(searchLower)
                    );
                  });

                  if (filtered.length === 0) {
                    return (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '30px' }}>
                        Aucun enregistrement historique trouvé.
                      </p>
                    );
                  }

                  return (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                      {filtered.map((act) => {
                        const isOrder = act.type === 'order';
                        const creation = creations.find(c => String(c.id) === String(act.creationId));
                        
                        const certData = {
                          orderId: act.id,
                          creationTitle: act.creationTitle || (creation && creation.title) || 'Projet personnalisé',
                          priceCAD: act.priceCAD || act.convertedPrice || '0 $',
                          customerName: act.customerName || (isOrder ? act.details.split(' (')[0] : 'N/A'),
                          customerEmail: act.customerEmail || (isOrder ? act.details.match(/\(([^)]+)\)/)?.[1] : 'N/A'),
                          customerAddress: act.customerAddress || 'N/A',
                          wood: (creation && creation.wood) || 'N/A',
                          dimensions: (creation && creation.dimensions) || 'N/A',
                          mediums: (creation && creation.mediums) || 'N/A',
                          date: act.date ? act.date.toLocaleDateString('fr-FR') : new Date().toLocaleDateString('fr-FR')
                        };

                        return (
                          <div key={act.id} className="activity-feed-item glass" style={{ padding: '20px', display: 'flex', gap: '15px', borderLeft: `4px solid ${isOrder ? '#10b981' : 'var(--accent-epoxy)'}` }}>
                            <div className="activity-icon" style={{ fontSize: '1.5rem' }}>
                              {isOrder ? '🛒' : '🪵'}
                            </div>
                            <div className="activity-content" style={{ flex: 1 }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <strong style={{ fontSize: '0.95rem', color: '#fff' }}>{act.title}</strong>
                                  <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: '12px', background: 'rgba(255,255,255,0.06)', color: 'var(--text-secondary)' }}>ID: {act.id}</span>
                                </div>
                                <span className="activity-date" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{act.date.toLocaleString('fr-CA')}</span>
                              </div>
                              <p style={{ color: 'var(--text-secondary)', marginTop: '8px', fontSize: '0.9rem', lineHeight: '1.4' }}>{act.details}</p>
                              
                              {isOrder && (
                                <div style={{ marginTop: '15px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Statut :</span>
                                    <select
                                      value={act.status || 'received'}
                                      onChange={(e) => updateOrderStatus(act.id, e.target.value)}
                                      style={{
                                        background: '#1e0a19',
                                        color: '#fff',
                                        border: '1px solid rgba(255,255,255,0.15)',
                                        borderRadius: '6px',
                                        padding: '4px 8px',
                                        fontSize: '0.8rem',
                                        cursor: 'pointer',
                                        outline: 'none'
                                      }}
                                    >
                                      <option value="received">📦 Reçue</option>
                                      <option value="production">⚙️ En fabrication</option>
                                      <option value="finishing">🎨 Finition &amp; Laser</option>
                                      <option value="shipped">🚚 Expédiée</option>
                                    </select>
                                  </div>
                                  <div style={{ display: 'flex', gap: '8px' }}>
                                    <button 
                                      onClick={() => downloadCertificate(certData)} 
                                      className="btn-secondary" 
                                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      📜 Certificat
                                    </button>
                                    <button 
                                      onClick={() => downloadInvoice(certData)} 
                                      className="btn-secondary" 
                                      style={{ padding: '4px 10px', fontSize: '0.75rem', borderRadius: '6px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}
                                    >
                                      🧾 Facture
                                    </button>
                                  </div>
                                </div>
                              )}

                              {!isOrder && (act.fileBase64 || act.cloudLink) && (
                                <div style={{ marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '12px' }}>
                                  {act.fileBase64 && (
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                      {act.fileBase64.startsWith('data:image/') ? (
                                        <img src={act.fileBase64} alt="Sketch Preview" style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }} />
                                      ) : (
                                        <div style={{ width: '70px', height: '70px', borderRadius: '8px', background: 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: '1px solid rgba(255,255,255,0.1)' }}>📄</div>
                                      )}
                                      <div>
                                        <div style={{ fontSize: '0.85rem', color: '#fff', fontWeight: '500' }}>{act.fileName} ({act.fileSize})</div>
                                        <a href={act.fileBase64} download={act.fileName} className="btn-secondary" style={{ display: 'inline-block', fontSize: '0.75rem', padding: '4px 10px', marginTop: '6px', borderRadius: '4px', textDecoration: 'none' }}>
                                          Télécharger le fichier
                                        </a>
                                      </div>
                                    </div>
                                  )}
                                  {act.cloudLink && (
                                    <div style={{ marginTop: '10px' }}>
                                      <a href={act.cloudLink} target="_blank" rel="noopener noreferrer" className="btn-primary" style={{ fontSize: '0.75rem', padding: '4px 10px', borderRadius: '4px', textDecoration: 'none' }}>
                                        Voir dans le Cloud
                                      </a>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  );
                })()}
              </div>
            )}
          </section>
        )}
      </main>

      {/* Footer */}
      <footer className="footer-main">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo">
              <img src="/assets/logo.png" alt="Evan Patruno Art" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            </div>
            
            <div className="footer-socials">
              <a href="https://www.instagram.com/evanpatruno.art/" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/evanpatruno.EP" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://linktr.ee/evanpatruno.art" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Linktree" style={{ color: '#39e09b' }}>
                <Sparkles size={18} />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <div>
              <p>© {new Date().getFullYear()} Evan Patruno Art. Tous droits réservés.</p>
              <span onClick={() => setIsAdminVisible(true)} className="footer-admin-link">Gérer le catalogue (Admin)</span>
            </div>
            <p style={{ display: 'flex', gap: '15px' }}>
              <span>Fait main au Québec</span>
              <span>•</span>
              <span>Design Premium</span>
            </p>
          </div>
        </div>
      </footer>

      {/* ADMIN LOGIN OVERLAY */}
      {isAdminVisible && (
        <div className="admin-login-overlay">
          <div className="admin-login-card glass animate-fade-in">
            <h3 className="contact-info-title" style={{ marginBottom: '20px' }}>Connexion Admin</h3>
            <form onSubmit={handleAdminLogin} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="builder-form-group" style={{ textAlign: 'left' }}>
                <label htmlFor="admin-pass">Mot de passe d'accès</label>
                <input 
                  type="password" 
                  id="admin-pass" 
                  className="builder-input" 
                  required 
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                />
              </div>
              {adminError && <p style={{ color: 'var(--accent-laser)', fontSize: '0.85rem' }}>{adminError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                <button type="button" onClick={() => setIsAdminVisible(false)} className="btn-secondary" style={{ flex: 1 }}>Annuler</button>
                <button type="submit" className="btn-primary" style={{ flex: 1 }}>Se connecter</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* SIMULATED STRIPE CHECKOUT OVERLAY */}
      {checkoutItem && (
        <div className="checkout-overlay">
          <div className="checkout-card glass animate-fade-in">
            <div className="checkout-header">
              <h3 className="checkout-title">Finaliser votre commande</h3>
              <button className="checkout-close" onClick={() => setCheckoutItem(null)}>&times;</button>
            </div>
            
            <form onSubmit={handleCheckoutSubmit} className="contact-form">
              <div className="checkout-summary-row">
                <span>Produit : <strong>{checkoutItem.title}</strong></span>
                <span>Prix : <strong>{formatPrice(checkoutItem.price)}</strong></span>
              </div>
              
              <div className="stripe-form-group">
                <label>Nom complet</label>
                <input 
                  type="text" 
                  className="builder-input" 
                  required 
                  value={checkoutForm.name}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, name: e.target.value }))}
                />
              </div>

              <div className="stripe-form-group">
                <label>Adresse courriel</label>
                <input 
                  type="email" 
                  className="builder-input" 
                  required 
                  value={checkoutForm.email}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div className="stripe-form-group">
                <label>Adresse de livraison</label>
                <input 
                  type="text" 
                  className="builder-input" 
                  required 
                  placeholder="Rue, App / Suite"
                  value={checkoutForm.address}
                  onChange={(e) => setCheckoutForm(prev => ({ ...prev, address: e.target.value }))}
                />
              </div>

              <div className="form-row">
                <div className="stripe-form-group">
                  <label>Ville</label>
                  <input 
                    type="text" 
                    className="builder-input" 
                    required 
                    value={checkoutForm.city}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, city: e.target.value }))}
                  />
                </div>
                <div className="stripe-form-group">
                  <label>Code Postal</label>
                  <input 
                    type="text" 
                    className="builder-input" 
                    required 
                    value={checkoutForm.zip}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, zip: e.target.value }))}
                  />
                </div>
              </div>

              <div className="stripe-form-group" style={{ marginTop: '10px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                <label>Détails du paiement (Sécurisé par Stripe)</label>
                <div className="stripe-card-input-wrapper">
                  <span style={{ fontSize: '1.2rem' }}>💳</span>
                  <input 
                    type="text" 
                    className="stripe-card-input" 
                    required 
                    placeholder="4242 4242 4242 4242"
                    maxLength="19"
                    value={checkoutForm.cardNumber}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, cardNumber: e.target.value }))}
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="stripe-form-group">
                  <label>Date d'expiration</label>
                  <input 
                    type="text" 
                    className="builder-input" 
                    required 
                    placeholder="MM/AA"
                    maxLength="5"
                    value={checkoutForm.expiry}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, expiry: e.target.value }))}
                  />
                </div>
                <div className="stripe-form-group">
                  <label>Code CVC</label>
                  <input 
                    type="text" 
                    className="builder-input" 
                    required 
                    placeholder="123"
                    maxLength="3"
                    value={checkoutForm.cvc}
                    onChange={(e) => setCheckoutForm(prev => ({ ...prev, cvc: e.target.value }))}
                  />
                </div>
              </div>

              <button 
                type="submit" 
                className="btn-checkout-submit"
                disabled={checkoutSubmitting}
              >
                {checkoutSubmitting ? 'Traitement en cours...' : `Payer ${formatPrice(checkoutItem.price)}`}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* DETAILED PRODUCT VIEW OVERLAY */}
      {selectedItemDetails && (
        <div className="checkout-overlay" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 11000 }}>
          <div className="checkout-card glass animate-fade-in" style={{ maxWidth: '900px', width: '95%', padding: '30px', maxHeight: '90vh', overflowY: 'auto' }}>
            <div className="checkout-header" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
              <h3 className="checkout-title" style={{ fontSize: '1.4rem' }}>{selectedItemDetails.title}</h3>
              <button className="checkout-close" onClick={() => setSelectedItemDetails(null)}>&times;</button>
            </div>

            <div className="product-details-grid">
              {/* Left Column: Image Slider / 3D Viewer */}
              <div style={{ position: 'relative' }}>
                {selectedItemDetails.has3DModel && (
                  <button 
                    className="viewer3d-toggle-btn"
                    onClick={() => setView3DActive(!view3DActive)}
                  >
                    {view3DActive ? "👁️ Afficher Photo" : "📦 Afficher Modèle 3D"}
                  </button>
                )}

                {view3DActive ? (
                  <div className="viewer3d-container">
                    <div className="viewer3d-object">
                      <div className="viewer3d-wireframe-cube">
                        <div className="viewer3d-face face-front"></div>
                        <div className="viewer3d-face face-back"></div>
                        <div className="viewer3d-face face-left"></div>
                        <div className="viewer3d-face face-right"></div>
                        <div className="viewer3d-face face-top"></div>
                        <div className="viewer3d-face face-bottom"></div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="slider-container">
                    <img 
                      src={selectedItemDetails.images ? selectedItemDetails.images[activeImageIdx] : selectedItemDetails.image} 
                      alt={selectedItemDetails.title} 
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                    />
                    
                    {selectedItemDetails.images && selectedItemDetails.images.length > 1 && (
                      <>
                        <button 
                          className="slider-btn slider-btn-prev"
                          onClick={() => setActiveImageIdx(prev => (prev === 0 ? selectedItemDetails.images.length - 1 : prev - 1))}
                        >
                          ◀
                        </button>
                        <button 
                          className="slider-btn slider-btn-next"
                          onClick={() => setActiveImageIdx(prev => (prev === selectedItemDetails.images.length - 1 ? 0 : prev + 1))}
                        >
                          ▶
                        </button>
                        <div className="slider-dots">
                          {selectedItemDetails.images.map((_, dotIdx) => (
                            <span 
                              key={dotIdx}
                              className={`slider-dot ${activeImageIdx === dotIdx ? 'active' : ''}`}
                              onClick={() => setActiveImageIdx(dotIdx)}
                            ></span>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Right Column: Info & Star Reviews */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', textAlign: 'left' }}>
                <div>
                  <span className={`art-badge ${selectedItemDetails.category}`} style={{ position: 'static', display: 'inline-block', marginBottom: '10px' }}>
                    {selectedItemDetails.categoryName}
                  </span>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                    {selectedItemDetails.desc}
                  </p>
                </div>

                <div style={{ background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '15px' }}>
                  <h4 style={{ color: 'var(--accent-wood)', fontSize: '0.9rem', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '1px' }}>Spécifications :</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                    {selectedItemDetails.wood && <div>🪵 <strong>Bois :</strong> {selectedItemDetails.wood}</div>}
                    {selectedItemDetails.dimensions && <div>📏 <strong>Dimensions :</strong> {selectedItemDetails.dimensions}</div>}
                    {selectedItemDetails.mediums && <div>✨ <strong>Matériaux :</strong> {selectedItemDetails.mediums}</div>}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}>
                      <span>Statut :</span>
                      <span className="art-status">
                        <span className={`status-dot ${selectedItemDetails.status}`}></span>
                        {selectedItemDetails.statusText}
                      </span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                  <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>Prix unitaire :</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fff' }}>{formatPrice(selectedItemDetails.price)}</span>
                </div>

                <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
                  <button 
                    type="button" 
                    onClick={() => setSelectedItemDetails(null)} 
                    className="btn-secondary" 
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Retour
                  </button>
                  {selectedItemDetails.status === 'available' && !selectedItemDetails.price.toLowerCase().includes('demande') ? (
                    <button 
                      type="button" 
                      onClick={() => {
                        const item = selectedItemDetails;
                        setSelectedItemDetails(null);
                        handleStartCheckout(item);
                      }} 
                      className="btn-primary" 
                      style={{ flex: 1.5, padding: '12px' }}
                    >
                      Acheter maintenant
                    </button>
                  ) : (
                    <button 
                      type="button" 
                      onClick={() => {
                        const cat = selectedItemDetails.category;
                        setSelectedItemDetails(null);
                        setProjectData(prev => ({ ...prev, type: cat === 'table' ? '🪵 Table sur mesure' : cat === 'jewelry' ? '💎 Bijou unique' : '🎨 Autre projet d\'art' }));
                        setBuilderStep(1);
                        window.location.hash = 'devis';
                      }} 
                      className="btn-primary" 
                      style={{ flex: 1.5, padding: '12px' }}
                    >
                      Commander sur mesure
                    </button>
                  )}
                </div>

                {/* Reviews System */}
                <div className="reviews-section">
                  <h4 style={{ color: '#fff', fontSize: '1.05rem', marginBottom: '15px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>Avis Clients</span>
                    <span className="review-stars">
                      ★ {currentReviews.length > 0 ? (currentReviews.reduce((acc, r) => acc + r.rating, 0) / currentReviews.length).toFixed(1) : "0.0"} ({currentReviews.length})
                    </span>
                  </h4>

                  {/* List of comments */}
                  <div style={{ maxHeight: '200px', overflowY: 'auto', marginBottom: '20px', paddingRight: '8px' }}>
                    {currentReviews.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textAlign: 'center', padding: '15px' }}>
                        Aucun avis pour le moment. Soyez le premier à donner votre avis !
                      </p>
                    ) : (
                      currentReviews.map((rev) => (
                        <div key={rev.id} className="review-item">
                          <div className="review-header">
                            <strong style={{ fontSize: '0.85rem', color: '#fff' }}>{rev.name}</strong>
                            <span className="review-stars">{"★".repeat(rev.rating)}{"☆".repeat(5 - rev.rating)}</span>
                          </div>
                          <p style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', lineHeight: '1.4', margin: 0 }}>{rev.comment}</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Write a comment form */}
                  <form onSubmit={handleSubmitReview} style={{ display: 'flex', flexDirection: 'column', gap: '10px', background: 'rgba(255,255,255,0.02)', padding: '15px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.04)' }}>
                    <h5 style={{ color: '#fff', margin: 0, fontSize: '0.85rem' }}>Laisser une évaluation</h5>
                    
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Votre Note :</span>
                      <div className="review-stars-input" style={{ margin: 0 }}>
                        {[1, 2, 3, 4, 5].map((starVal) => (
                          <button
                            type="button"
                            key={starVal}
                            onClick={() => setNewReviewRating(starVal)}
                            className="review-star-btn"
                            style={{ color: starVal <= newReviewRating ? '#fbbf24' : 'rgba(255,255,255,0.15)' }}
                          >
                            ★
                          </button>
                        ))}
                      </div>
                    </div>

                    <input 
                      type="text"
                      className="builder-input"
                      placeholder="Votre nom..."
                      required
                      value={newReviewName}
                      onChange={(e) => setNewReviewName(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '0.8rem' }}
                    />

                    <textarea
                      className="builder-textarea"
                      placeholder="Partagez votre avis sur cette pièce..."
                      required
                      value={newReviewComment}
                      onChange={(e) => setNewReviewComment(e.target.value)}
                      style={{ padding: '8px 12px', fontSize: '0.8rem', minHeight: '60px', height: '60px' }}
                    ></textarea>

                    <button type="submit" className="btn-primary" style={{ padding: '8px', fontSize: '0.8rem', borderRadius: '8px' }}>
                      Publier l'évaluation
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* POST-PURCHASE CERTIFICATE OVERLAY */}
      {purchaseCertificate && (
        <div className="certificate-overlay">
          <div className="certificate-card glass animate-fade-in">
            <div className="certificate-seal"></div>
            <h3 style={{ color: '#d4af37', fontFamily: 'var(--font-heading)', fontSize: '1.8rem', fontWeight: '800', marginBottom: '10px' }}>
              Certificat d'Authenticité Numérique
            </h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
              Félicitations pour l'acquisition d'une œuvre originale signée <strong>Evan Patruno</strong>.
            </p>

            <div style={{ background: 'rgba(212, 175, 55, 0.05)', border: '1px solid #d4af37', borderRadius: '12px', padding: '20px', margin: '20px 0', textAlign: 'left', fontSize: '0.9rem' }}>
              <div style={{ marginBottom: '8px' }}>📜 <strong>Œuvre :</strong> {purchaseCertificate.creationTitle}</div>
              <div style={{ marginBottom: '8px' }}>🪵 <strong>Bois :</strong> {purchaseCertificate.wood}</div>
              <div style={{ marginBottom: '8px' }}>📏 <strong>Dimensions :</strong> {purchaseCertificate.dimensions}</div>
              <div style={{ marginBottom: '8px' }}>✨ <strong>Médiums :</strong> {purchaseCertificate.mediums}</div>
              <div style={{ borderTop: '1px dashed rgba(212, 175, 55, 0.2)', paddingTop: '10px', marginTop: '10px' }}>
                🆔 <strong>No. Commande (Suivi) :</strong> <code style={{ color: '#d4af37', fontWeight: '700' }}>{purchaseCertificate.orderId}</code>
              </div>
            </div>

            <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Utilisez cet identifiant dans notre module de suivi de commande en direct pour suivre la préparation !
            </p>

            <div className="qr-code-box">
              <img 
                src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=https://evanpatruno.art/track?id=${purchaseCertificate.orderId}`} 
                alt="Code QR Certificat"
                style={{ width: '100px', height: '100px' }}
              />
            </div>

            <div style={{ display: 'flex', gap: '15px', marginTop: '20px' }}>
              <button 
                onClick={() => downloadInvoice(purchaseCertificate)}
                className="btn-secondary" 
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem' }}
              >
                📄 Facture PDF (.txt)
              </button>
              <button 
                onClick={() => downloadCertificate(purchaseCertificate)}
                className="btn-primary" 
                style={{ flex: 1, padding: '12px', fontSize: '0.9rem', background: 'linear-gradient(135deg, #d4af37, #aa7c11)', border: 'none', color: '#1e0a19' }}
              >
                📜 Certificat (.txt)
              </button>
            </div>

            <button 
              onClick={() => setPurchaseCertificate(null)}
              className="btn-secondary" 
              style={{ width: '100%', marginTop: '15px', padding: '12px', borderColor: 'transparent', background: 'rgba(255,255,255,0.02)' }}
            >
              Fermer
            </button>
          </div>
        </div>
      )}

      {/* FLOATING MULTI-CHANNEL CHAT WIDGET */}
      <div className={`chat-widget-container no-print ${chatbotWidgetActive ? 'active' : ''}`}>
        <div className="chat-menu">
          {/* CHATBOT BUTTON */}
          <button 
            className="chat-item ci-chatbot" 
            onClick={handleOpenChatbot} 
            data-label="Assistant Virtuel"
            style={{ border: 'none', cursor: 'pointer' }}
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 1C5.925 1 1 5.925 1 12s4.925 11 11 11c1.79 0 3.47-.43 4.96-1.18L21 23l-1-4.17A10.96 10.96 0 0023 12C23 5.925 18.075 1 12 1zm-4 13H7v-2h1v2zm5 0h-3v-2h3v2zm3 0h-1v-2h1v2z"/></svg>
          </button>
          
          <a 
            href="https://m.me/evanpatruno.EP" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-item ci-messenger" 
            data-label="Messenger"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.908 1.462 5.503 3.746 7.231v3.827c0 .195.228.305.385.19l4.314-3.15c.504.07 1.021.108 1.555.108 5.523 0 10-4.145 10-9.258C22 6.145 17.523 2 12 2zm1.026 12.33l-2.454-2.618-4.787 2.618 5.267-5.59 2.516 2.618 4.725-2.618-5.267 5.59z"/></svg>
          </a>
          
          <a 
            href="https://ig.me/m/evanpatruno.art" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-item ci-instagram" 
            data-label="Instagram"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
          </a>
          
          <a 
            href="https://wa.me/15145673249" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-item ci-whatsapp" 
            data-label="WhatsApp"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413" /></svg>
          </a>
          
          <a 
            href="tel:5145673249" 
            className="chat-item ci-phone" 
            data-label="Appel direct"
          >
            <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 10.8a19.79 19.79 0 01-3.07-8.68A2 2 0 012 0h3a2 2 0 012 1.72c.127 1.01.36 2 .7 2.95a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 006.16 6.16l1.13-1.34a2 2 0 012.11-.45c.95.34 1.94.573 2.95.7A2 2 0 0122 16.92z"/></svg>
          </a>
        </div>
        
        <button 
          className="chat-trigger" 
          onClick={() => setChatbotWidgetActive(!chatbotWidgetActive)}
          aria-label="Ouvrir le menu de contact"
        >
          {chatbotWidgetActive ? (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
          ) : (
            <svg viewBox="0 0 24 24" width="24" height="24" fill="currentColor"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          )}
        </button>
      </div>

      {/* CHATBOT POPUP WINDOW */}
      {chatbotOpen && (
        <div className="chatbot-window open">
          <div className="chatbot-header">
            <div 
              className="chatbot-header-avatar" 
              style={{ 
                width: '42px', 
                height: '42px', 
                borderRadius: '50%', 
                background: 'url(\'https://www.evanpatruno.ca/Photo%20de%20profil%20courtier%20Pro%20N%20Plex.jpg\') center/cover', 
                border: '2px solid rgba(255,255,255,0.3)', 
                flexShrink: 0 
              }}
            ></div>
            <div className="chatbot-header-info">
              <h4>Assistant Evan Patruno Art</h4>
              <p>Ébénisterie d'art &amp; créations sur mesure</p>
            </div>
            <button className="chatbot-close-btn" onClick={() => setChatbotOpen(false)}>&times;</button>
          </div>
          
          <div className="chatbot-body">
            {chatMessages.map((msg, idx) => (
              <div key={idx} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <div className={`chatbot-msg ${msg.sender === 'user' ? 'user' : 'bot'}`} style={{ flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row' }}>
                  {msg.sender === 'bot' && <div className="chatbot-msg-avatar">🎨</div>}
                  <div className={msg.sender === 'user' ? 'chatbot-user-bubble' : 'chatbot-bubble'}>
                    {msg.text}
                  </div>
                </div>
                
                {msg.choices && (
                  <div className="chatbot-choices">
                    {msg.choices.map((choice, cIdx) => (
                      <button 
                        key={cIdx} 
                        className="chatbot-choice-btn"
                        onClick={() => handleBotChoice(choice)}
                      >
                        {choice}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {chatbotInputVisible && (
            <div className="chatbot-input-row">
              <input 
                type="text" 
                className="chatbot-input" 
                placeholder="Écrivez votre réponse..."
                value={chatbotInputValue}
                onChange={(e) => setChatbotInputValue(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleBotSubmitInput();
                }}
              />
              <button className="chatbot-send-btn" onClick={handleBotSubmitInput}>
                ▶
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
