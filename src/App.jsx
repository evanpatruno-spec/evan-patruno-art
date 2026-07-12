// src/App.jsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  setDoc, 
  deleteDoc, 
  doc, 
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
  Camera
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
    status: "custom-only",
    statusText: "Sur commande uniquement",
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
    status: "custom-only",
    statusText: "Sur commande uniquement",
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
    desc: "Peinture acrylique fluide (pouring) aux textures d'écorce vivante évoquant le cosmos et le ballet de lunes exoplanétaires.",
    image: "/assets/pouring-exoplanete.jpg",
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
    status: "available",
    statusText: "Disponible",
    price: "420 $",
    wood: "Support toile sur châssis de bois",
    dimensions: "24\" x 24\"",
    mediums: "Acrylique pouring, illustration numérique, technique mixte"
  }
];

const craftCapabilities = [
  // Époxy
  { type: 'epoxy', name: 'Bleu Cosmique Nacré', color: 'radial-gradient(circle, #1e3a8a 0%, #0d1b2a 100%)', desc: 'Mouvements fluides tridimensionnels nacrés rappelant la nébuleuse et le cosmos.' },
  { type: 'epoxy', name: 'Turquoise Lagon Translucide', color: 'rgba(64, 224, 208, 0.65)', desc: 'Teinte translucide cristalline imitant les nuances et reflets de l\'eau tropicale.' },
  { type: 'epoxy', name: 'Or Liquide Métallisé', color: 'linear-gradient(135deg, #d4af37 0%, #aa7c11 100%)', desc: 'Pigments métallisés dorés pour un contraste prestigieux avec les bois foncés.' },
  
  // Laser
  { type: 'laser', name: 'Gravure Grand Format (4\'x4\')', icon: '📐', desc: 'Capacité de découper et graver des surfaces allant jusqu\'à 4 pieds par 4 pieds avec une précision micrométrique sur bois, acrylique et cuir.' },
  { type: 'laser', name: 'Mandalas & Logos', icon: '🎨', desc: 'Découpe de précision multicouche complexe de mandalas décoratifs en relief ou gravures de logos d\'entreprises personnalisés.' },
  
  // 3D Print
  { type: '3dprint', name: 'Impression Multicolore P1S', icon: '⚙️', desc: 'Impression 3D FDM avancée à l\'aide de notre imprimante Bambu Lab P1S avec chargeur automatique de filaments (AMS) pour des pièces multicolores en PLA/PETG.' },
  { type: '3dprint', name: 'Prototypage & Figurines', icon: '🤖', desc: 'Modélisation et fabrication de pièces de rechange, boîtiers personnalisés, ou figurines détaillées.' },
  
  // Kumihimo
  { type: 'kumihimo', name: 'Tressage Traditionnel Japonais', icon: '🧶', desc: 'Bracelets et cordons tissés à la main à l\'aide de fils de soie et de coton robustes sur un disque de tressage.' },
  { type: 'kumihimo', name: 'Motifs Complexes', icon: '✨', desc: 'Tressage de précision à 8 ou 16 brins permettant d\'intégrer des motifs géométriques uniques.' },
  
  // Drone
  { type: 'drone', name: 'Photos Aériennes 4K', icon: '📸', desc: 'Imagerie aérienne haute résolution à l\'aide du drone DJI Mini 3 Pro. Idéal pour l\'immobilier ou les paysages.' },
  { type: 'drone', name: 'Vidéos Cinématiques', icon: '🎥', desc: 'Captures vidéo fluides en 4K avec nacelle stabilisée pour documenter des projets d\'art en plein air.' }
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

  // Custom Project Builder State
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
    phone: ''
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

    return () => unsubscribe();
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
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      updateFeed('orders', o);
    }, (err) => console.error("Err feed orders:", err));

    const unsubProjects = onSnapshot(collection(db, 'projects'), (snap) => {
      const p = snap.docs.map(doc => ({
        id: doc.id,
        type: 'project',
        title: 'Nouveau projet sur mesure (devis)',
        details: `${doc.data().name} (${doc.data().email}) veut un projet de type "${doc.data().type}" en ${doc.data().wood || 'bois non spécifié'}, résine: ${doc.data().epoxy || 'non spécifié'}, piétement: ${doc.data().legs || 'non spécifié'}. Notes: ${doc.data().notes || 'aucune'}`,
        date: doc.data().createdAt?.toDate() || new Date()
      }));
      updateFeed('projects', p);
    }, (err) => console.error("Err feed projects:", err));

    const unsubInquiries = onSnapshot(collection(db, 'inquiries'), (snap) => {
      const i = snap.docs.map(doc => ({
        id: doc.id,
        type: 'inquiry',
        title: 'Nouveau message de contact',
        details: `${doc.data().name} (${doc.data().email}) : Sujet: "${doc.data().subject}". Message: "${doc.data().message}"`,
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

  const handleBuilderSubmit = async (e) => {
    e.preventDefault();
    if (db) {
      try {
        await addDoc(collection(db, 'projects'), {
          ...projectData,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Erreur lors de la soumission du projet :", err);
      }
    }
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
    
    if (db) {
      try {
        await addDoc(collection(db, 'orders'), {
          creationId: checkoutItem.id,
          creationTitle: checkoutItem.title,
          priceCAD: checkoutItem.price,
          currency: currency,
          convertedPrice: formatPrice(checkoutItem.price),
          customerName: checkoutForm.name,
          customerEmail: checkoutForm.email,
          customerAddress: `${checkoutForm.address}, ${checkoutForm.city}, ${checkoutForm.zip}`,
          createdAt: serverTimestamp()
        });
      } catch (err) {
        console.error("Erreur lors de la sauvegarde de la commande :", err);
      }
    }
    
    setCheckoutSubmitting(false);
    alert(`🎉 Commande réussie ! Un courriel de confirmation a été envoyé à ${checkoutForm.email}. Merci de votre achat !`);
    setCheckoutItem(null);
  };

  // Reset helper
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
      phone: ''
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

  return (
    <div id="root">
      {/* Background Decorative Glow Blurs */}
      <div className="glow-blur" style={{ top: '15%', left: '10%', width: '450px', height: '450px', background: 'var(--accent-wood-glow)' }}></div>
      <div className="glow-blur" style={{ top: '45%', right: '5%', width: '500px', height: '500px', background: 'var(--accent-epoxy-glow)' }}></div>
      <div className="glow-blur" style={{ top: '75%', left: '5%', width: '400px', height: '400px', background: 'var(--accent-voltage-glow)' }}></div>

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
          </div>

          {/* Gallery Grid */}
          <div className="gallery-grid" id="portfolio-grid">
            {filteredPortfolio.map((item) => (
              <div key={item.id} className="art-card glass" id={`portfolio-item-${item.id}`}>
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
                    {item.status === 'available' && !item.price.toLowerCase().includes('demande') && (
                      <button 
                        onClick={() => handleStartCheckout(item)}
                        className="btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '0.85rem', width: '100%', marginTop: '5px' }}
                      >
                        Commander
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* MATERIALS & TECH SECTION */}
        <section id="materials" style={{ background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>
          <div className="section-header">
            <h2 className="section-title">La Palette Créative &amp; Technologies</h2>
            <p className="section-subtitle">
              De l'ébénisterie d'art à l'impression 3D en passant par la gravure laser 4'x4' et l'imagerie par drone, découvrez nos outils et matériaux.
            </p>
          </div>

          <div className="pigments-tabs" style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center' }}>
            {[
              { id: 'all', label: 'Tout voir' },
              { id: 'epoxy', label: '🌊 Époxy & Pigments' },
              { id: 'laser', label: '📐 Gravure Laser 4\'x4\'' },
              { id: '3dprint', label: '⚙️ Impression 3D P1S' },
              { id: 'kumihimo', label: '🧶 Bracelets Kumihimo' },
              { id: 'drone', label: '🚁 Drone DJI Mini 3' }
            ].map((tab) => (
              <button
                key={tab.id}
                className={`pigment-tab-btn ${pigmentTab === tab.id ? 'active' : ''}`}
                onClick={() => setPigmentTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="pigments-grid">
            {craftCapabilities
              .filter(item => pigmentTab === 'all' || item.type === pigmentTab)
              .map((item, idx) => (
                <div key={idx} className="pigment-card glass">
                  {item.color ? (
                    <div className="pigment-swatch" style={{ background: item.color }}></div>
                  ) : (
                    <div className="pigment-swatch" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                      {item.icon}
                    </div>
                  )}
                  <h3 className="pigment-name">{item.name}</h3>
                  <p className="pigment-desc">{item.desc}</p>
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

        {/* CUSTOM INQUIRY BUILDER */}
        <section id="devis">
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
                      {/* For Wood & Resin projects (Tables, Jewelry, Lichtenberg, Laser) */}
                      {['Table rivière', 'Bijou en bois/époxy', 'Fractale de Lichtenberg', 'Découpe & Gravure laser'].includes(projectData.type) && (
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
                              <option value="Bleu océan translucide / Turquoise">Bleu océan translucide / Turquoise</option>
                              <option value="Vert émeraude nacré">Vert émeraude nacré</option>
                              <option value="Noir fumé ou Opaque">Noir fumé ou Opaque</option>
                              <option value="Doré métallique scintillant">Doré métallique scintillant</option>
                              <option value="Pas d'époxy (Bois brut ou gravure seule)">Sans résine / Fini naturel</option>
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

        {/* ADMIN DASHBOARD SECTION */}
        {isAdminLoggedIn && (
          <section id="admin-dashboard" className="admin-dashboard">
            <div className="section-header">
              <h2 className="section-title">Tableau de bord Administrateur</h2>
              <p className="section-subtitle">
                Gérez en direct les créations de votre catalogue public. Ajoutez de nouvelles pièces ou modifiez les prix et disponibilités.
              </p>
            </div>

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
                            image: ''
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

          {/* Activity Feed Section */}
            <div className="activity-feed-section glass" style={{ marginTop: '30px', padding: '30px', borderRadius: '24px' }}>
              <h3 className="contact-info-title" style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '15px', marginBottom: '20px' }}>
                Flux d'Activité en Direct
              </h3>
              
              {activityFeed.length === 0 ? (
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '20px' }}>
                  Aucune activité récente détectée.
                </p>
              ) : (
                <div className="activity-feed-list" style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                  {activityFeed.map((act) => (
                    <div key={act.id} className="activity-feed-item glass">
                      <div className="activity-icon">
                        {act.type === 'order' && '🛒'}
                        {act.type === 'project' && '🪵'}
                        {act.type === 'inquiry' && '✉️'}
                        {act.type === 'chatbot' && '🤖'}
                      </div>
                      <div className="activity-content" style={{ flex: 1 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '20px', flexWrap: 'wrap' }}>
                          <strong style={{ fontSize: '0.95rem' }}>{act.title}</strong>
                          <span className="activity-date">{act.date.toLocaleString('fr-CA')}</span>
                        </div>
                        <p style={{ color: 'var(--text-secondary)', marginTop: '5px' }}>{act.details}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
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

      {/* FLOATING MULTI-CHANNEL CHAT WIDGET */}
      <div className="chat-widget-container no-print">
        <div className={`chat-menu ${chatbotWidgetActive ? 'active' : ''}`}>
          <button 
            className="chat-item ci-chatbot" 
            onClick={handleOpenChatbot} 
            data-label="Assistant Virtuel"
          >
            💬
          </button>
          <a 
            href="https://m.me/evanpatruno.art" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-item ci-messenger" 
            data-label="Messenger"
          >
            📘
          </a>
          <a 
            href="https://www.instagram.com/evanpatruno.art" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-item ci-instagram" 
            data-label="Instagram"
          >
            📸
          </a>
          <a 
            href="https://wa.me/15145673249" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="chat-item ci-whatsapp" 
            data-label="WhatsApp"
          >
            🟢
          </a>
          <a 
            href="tel:5145673249" 
            className="chat-item ci-phone" 
            data-label="Appel direct"
          >
            📞
          </a>
        </div>
        
        <button 
          className="chat-trigger" 
          onClick={() => setChatbotWidgetActive(!chatbotWidgetActive)}
          aria-label="Ouvrir le menu de contact"
        >
          {chatbotWidgetActive ? (
            <span style={{ fontSize: '1.5rem', color: 'white' }}>&times;</span>
          ) : (
            <span style={{ fontSize: '1.5rem', color: 'white' }}>✉</span>
          )}
        </button>
      </div>

      {/* CHATBOT POPUP WINDOW */}
      {chatbotOpen && (
        <div className="chatbot-window open">
          <div className="chatbot-header">
            <div className="chatbot-header-avatar">🪵</div>
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
