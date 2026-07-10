// src/App.jsx
import React, { useState, useEffect } from 'react';
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
  Scissors
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

export default function App() {
  const [scrolled, setScrolled] = useState(false);
  const [galleryFilter, setGalleryFilter] = useState('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  // Custom Project Builder State
  const [builderStep, setBuilderStep] = useState(1);
  const [projectData, setProjectData] = useState({
    type: '',
    wood: '',
    epoxy: '',
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

  // Portfolio items data
  const portfolioItems = [
    {
      id: 1,
      title: "Table Rivière Noyer Massif",
      category: "table",
      categoryName: "Table & Mobilier",
      desc: "Table de salle à manger majestueuse en noyer d'ici, avec une coulée centrale d'époxy turquoise nacrée aux reflets océaniques.",
      image: "/assets/table.png",
      status: "available",
      statusText: "Disponible",
      price: "1 850 $"
    },
    {
      id: 2,
      title: "Pendentif Loupe d'Érable",
      category: "jewelry",
      categoryName: "Bijoux",
      desc: "Bijou unique fabriqué à partir de loupe d'érable stabilisée et de résine époxy bleue translucide polie à la main.",
      image: "/assets/jewelry.png",
      status: "sold",
      statusText: "Vendu (Sur commande)",
      price: "95 $"
    },
    {
      id: 3,
      title: "Planche de Cèdre Lichtenberg",
      category: "lichtenberg",
      categoryName: "Fractale Lichtenberg",
      desc: "Planche décorative en cèdre brûlée par courant électrique à haute tension (10,000V) puis comblée d'une résine dorée brillante.",
      image: "/assets/lichtenberg.png",
      status: "custom-only",
      statusText: "Sur commande uniquement",
      price: "190 $"
    },
    {
      id: 4,
      title: "Mandala Géométrique Lumineux",
      category: "laser",
      categoryName: "Art Laser & Acrylique",
      desc: "Œuvre murale en 3D constituée de 7 couches de bois de bouleau découpées au laser, peintes à l'acrylique bleue et assemblées avec soin.",
      image: "/assets/laser.png",
      status: "available",
      statusText: "Disponible",
      price: "340 $"
    }
  ];

  const filteredPortfolio = galleryFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === galleryFilter);

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

  const handleBuilderSubmit = (e) => {
    e.preventDefault();
    setBuilderSubmitted(true);
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    setContactSubmitted(true);
  };

  // Reset helper
  const resetBuilder = () => {
    setBuilderStep(1);
    setProjectData({
      type: '',
      wood: '',
      epoxy: '',
      dimensions: '',
      notes: '',
      name: '',
      email: '',
      phone: ''
    });
    setBuilderSubmitted(false);
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
        </ul>

        <a href="#devis" className="btn-cta-nav" id="nav-cta-btn">Créer un Devis</a>

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
              La fusion du <span className="wood">Bois</span>, de la <span className="epoxy">Résine</span> &amp; du Feu
            </h1>
            
            <p className="hero-description">
              Tables rivière sur mesure, bijoux artisanaux d'exception et art géométrique. Je façonne la matière brute pour donner vie à vos projets artistiques personnalisés.
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
                  
                  <div className="art-footer">
                    <span className="art-status">
                      <span className={`status-dot ${item.status}`}></span>
                      {item.statusText}
                    </span>
                    <span className="art-price">{item.price}</span>
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
                        <span className="choice-desc">Mobilier haut de gamme en bois massif</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Bijou en bois/époxy' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Bijou en bois/époxy')}
                        id="choice-jewelry"
                      >
                        <div className="choice-icon"><Gem size={24} /></div>
                        <span className="choice-title">Bijoux artisanaux</span>
                        <span className="choice-desc">Colliers, pendentifs, bagues</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Fractale de Lichtenberg' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Fractale de Lichtenberg')}
                        id="choice-lichtenberg"
                      >
                        <div className="choice-icon"><Zap size={24} /></div>
                        <span className="choice-title">Art Lichtenberg</span>
                        <span className="choice-desc">Brûlures électriques sur bois</span>
                      </div>

                      <div 
                        className={`choice-card ${projectData.type === 'Découpe & Gravure laser' ? 'selected' : ''}`}
                        onClick={() => selectProjectType('Découpe & Gravure laser')}
                        id="choice-laser"
                      >
                        <div className="choice-icon"><Scissors size={24} /></div>
                        <span className="choice-title">Découpe Laser</span>
                        <span className="choice-desc">Mandalas multicouches ou logos</span>
                      </div>
                    </div>
                  )}

                  {/* Step 2: Wood & Epoxy options */}
                  {builderStep === 2 && (
                    <div className="choices-grid" id="builder-step-2">
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
                        <label htmlFor="epoxy-select">Style ou Couleur de la résine Époxy</label>
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
                          <option value="Pas d'époxy (Bois brut ou gravure seule)">Sans époxy / Naturel</option>
                        </select>
                      </div>
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
                    <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Instagram">
                      <Instagram size={18} />
                    </a>
                    <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Facebook">
                      <Facebook size={18} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
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
                      <p className="contact-value"><a href="mailto:info@evanpatrunoart.com">contact@evanpatruno.ca</a></p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon-box"><Phone size={18} /></div>
                    <div>
                      <span className="contact-label">Téléphone</span>
                      <p className="contact-value">+1 (514) 555-0199</p>
                    </div>
                  </div>

                  <div className="contact-item">
                    <div className="contact-icon-box"><MapPin size={18} /></div>
                    <div>
                      <span className="contact-label">Localisation</span>
                      <p className="contact-value">Montréal, Québec, Canada</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="contact-card-info glass" id="socials-card">
                <h3 className="contact-info-title">Réseaux Sociaux</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '20px' }}>
                  Suivez mon quotidien à l'atelier et découvrez les coulisses des prochaines coulées !
                </p>
                <div style={{ display: 'flex', gap: '15px' }}>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', padding: '12px' }}>
                    <Instagram size={18} /> Instagram
                  </a>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="btn-secondary" style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, justifyContent: 'center', padding: '12px' }}>
                    <Facebook size={18} /> Facebook
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
      </main>

      {/* Footer */}
      <footer className="footer-main">
        <div className="footer-container">
          <div className="footer-top">
            <div className="footer-logo">
              <img src="/assets/logo.png" alt="Evan Patruno Art" style={{ height: '36px', width: 'auto', objectFit: 'contain' }} />
            </div>
            
            <div className="footer-socials">
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="social-circle-link" aria-label="Facebook">
                <Facebook size={18} />
              </a>
            </div>
          </div>

          <div className="footer-bottom">
            <p>© {new Date().getFullYear()} Evan Patruno Art. Tous droits réservés.</p>
            <p style={{ display: 'flex', gap: '15px' }}>
              <span>Fait main au Québec</span>
              <span>•</span>
              <span>Design Premium</span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
