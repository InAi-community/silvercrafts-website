import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X, ShoppingCart, Sparkles, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, products, Product } from '../data/products';
import BackButton from '../components/BackButton';

interface QuotationPageProps {
  onNavigate: (page: 'home' | 'quote') => void;
}

interface QuoteItem {
  product: Product;
  quantity: number;
}

const retailerLogos = [
  { name: 'Khazana', logo: '/logos/Khazana.png' },
  { name: 'GRT', logo: '/logos/grt.webp' },
  { name: 'Kumaran', logo: '/logos/kumaran.png' },
  { name: 'Lalitha', logo: '/logos/lalitha.webp' },
  { name: 'Malabar', logo: '/logos/Malabar.png' },
  { name: 'Pothys', logo: '/logos/pothys.webp' },
  { name: 'Saravana Selvarathinam', logo: '/logos/saravana selvarathinam.png' },
  { name: 'Thangamayil', logo: '/logos/Thangamayil.png' }
];


export default function QuotationPage({ onNavigate }: QuotationPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const categoryCarouselRef = useRef<HTMLDivElement>(null);
  const [quoteItems, setQuoteItems] = useState<QuoteItem[]>([]);
  const [showSidebar, setShowSidebar] = useState(false);
  const [showQuoteForm, setShowQuoteForm] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    gstin: ''
  });

  const filteredProducts = useMemo(() => {
    console.log('🔍 Filtering for category:', selectedCategory);
    console.log('📦 Total products available:', products.length);
    
    if (selectedCategory === 'all') {
      console.log('✅ Showing all products:', products.length);
      return products;
    }
    
    const filtered = products.filter((p) => {
      const matches = p.category === selectedCategory;
      if (!matches) {
        console.log(`❌ Product "${p.name}" category "${p.category}" doesn't match "${selectedCategory}"`);
      }
      return matches;
    });
    
    console.log(`✅ Filtered ${filtered.length} products for category "${selectedCategory}"`);
    if (filtered.length > 0) {
      console.log('First few products:', filtered.slice(0, 3).map(p => p.name));
    }
    
    return filtered;
  }, [selectedCategory]);

  const addToQuote = useCallback((product: Product) => {
    setQuoteItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  }, []);

  const totalWeight = useMemo(() => {
    return quoteItems.reduce((total, item) => {
      const weightRange = item.product.weightRange;
      const match = weightRange.match(/(\d+)-(\d+)/);
      if (match) {
        const min = parseInt(match[1]);
        const max = parseInt(match[2]);
        const avg = (min + max) / 2;
        return total + avg;
      }
      return total;
    }, 0);
  }, [quoteItems]);

  const uniqueProductCount = quoteItems.length;

  const removeItem = useCallback((productId: string) => {
    setQuoteItems((prevItems) => prevItems.filter((item) => item.product.id !== productId));
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowQuoteForm(false);
    setShowConfirmation(true);
    setTimeout(() => {
      const confetti = document.createElement('div');
      confetti.className = 'confetti-explosion';
      document.body.appendChild(confetti);
      setTimeout(() => confetti.remove(), 3000);
    }, 100);
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in-up');
            // Also animate child elements with staggered delays
            const children = entry.target.querySelectorAll('.animate-on-scroll');
            children.forEach((child, index) => {
              setTimeout(() => {
                child.classList.add('animate-fade-in-up');
              }, index * 100);
            });
            // Don't unobserve - keep watching for re-entry
          } else {
            // Remove animation class when not visible so it can re-animate
            entry.target.classList.remove('animate-fade-in-up');
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
    );

    const elements = document.querySelectorAll('.animate-on-scroll');
    elements.forEach((el) => observer.observe(el));
    
    // Also observe sections for section-level animations
    const sections = document.querySelectorAll('section');
    sections.forEach((section) => {
      if (!section.querySelector('.animate-on-scroll')) {
        section.classList.add('animate-on-scroll');
        observer.observe(section);
      }
    });

    return () => {
      elements.forEach((el) => observer.unobserve(el));
      sections.forEach((section) => observer.unobserve(section));
      observer.disconnect();
    };
  }, [selectedCategory]);

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      <BackButton onNavigate={onNavigate} />
      <section className="pt-32 pb-16 px-6 bg-[#FDFBF7] border-b border-[#EDEAE2]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6 animate-on-scroll">
            <h1 className="text-5xl md:text-7xl font-bold text-[#1C1C1C] leading-tight">
              Silver Crafts
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold text-[#1C1C1C] leading-snug">
              Build a tailored silverware proposal with ease
            </h2>
            
            {/* Milestone Steps */}
            <div className="flex flex-col gap-3 py-4 animate-on-scroll">
              {[
                { step: '1', title: 'Select Products', desc: 'Browse and choose from our range of silver articles' },
                { step: '2', title: 'Submit Quote Request', desc: 'Fill in your details and send us your requirements' },
                { step: '3', title: 'Receive Proposal', desc: 'Get a tailored quote within 24 hours' }
              ].map((milestone, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-full bg-[#C06014] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {milestone.step}
                    </div>
                    {index < 2 && (
                      <div className="w-0.5 h-6 bg-[#E8E4DA] mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-sm font-semibold text-[#1C1C1C] mb-0.5">
                      {milestone.title}
                    </h3>
                    <p className="text-xs text-[#5A5A5A] leading-relaxed">
                      {milestone.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="h-[420px] rounded-2xl overflow-hidden border border-[#E8E4DA] bg-white animate-on-scroll">
            <img
              src="/albums/Second page.jpg"
              alt="Silver manufacturing"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      <section id="categories-section" className="py-14 px-6 bg-[#FAF9F7] border-b border-[#EDEAE2]">
        <div className="max-w-7xl mx-auto animate-on-scroll">
          <h3 className="text-3xl md:text-4xl font-semibold text-center text-[#1C1C1C] mb-10 animate-on-scroll">
            Select Category
          </h3>

          <div className="relative overflow-hidden animate-on-scroll">
            <button
              onClick={() => {
                if (categoryCarouselRef.current) {
                  categoryCarouselRef.current.scrollBy({ left: -200, behavior: 'smooth' });
                }
              }}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-[#E8E4DA] rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Scroll categories left"
            >
              <ChevronLeft className="w-6 h-6 text-[#C06014]" />
            </button>
            <button
              onClick={() => {
                if (categoryCarouselRef.current) {
                  categoryCarouselRef.current.scrollBy({ left: 200, behavior: 'smooth' });
                }
              }}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-white/90 hover:bg-white border border-[#E8E4DA] rounded-full p-2 shadow-lg transition-all duration-300 hover:scale-110"
              aria-label="Scroll categories right"
            >
              <ChevronRight className="w-6 h-6 text-[#C06014]" />
            </button>
            <div 
              ref={categoryCarouselRef}
              className={`flex gap-4 w-max overflow-x-auto scrollbar-hide ${isCarouselPaused ? '' : 'animate-scroll-left'}`}
              style={{ scrollBehavior: 'smooth' }}
            >
              {[
                { id: 'all', name: 'All Categories', image: null },
                ...categories,
                { id: 'all', name: 'All Categories', image: null },
                ...categories
              ].map((category, index) => {
                const isSelected = selectedCategory === category.id;
                return (
                <button
                  key={`${category.id}-${index}`}
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('🖱️ Category button clicked:', category.id, '-', category.name);
                    setSelectedCategory(category.id);
                    setIsCarouselPaused(true);
                    // Scroll to products section
                    requestAnimationFrame(() => {
                      const productsSection = document.getElementById('products-section');
                      if (productsSection) {
                        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                      }
                    });
                  }}
                  className={`group relative flex-shrink-0 w-32 h-32 rounded-xl overflow-hidden border ${
                    isSelected ? 'border-[#C06014] bg-[#FCF6F0]' : 'border-[#E8E4DA] bg-white'
                  } transition-colors duration-300 cursor-pointer`}
                  aria-label={`Select ${category.name} category`}
                >
                  {category.image ? (
                    <>
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          console.error('Failed to load category image:', category.image);
                          // Show placeholder with category name
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.style.backgroundColor = '#F5F5F5';
                          }
                        }}
                      />
                      <div className="absolute inset-x-3 bottom-3 rounded-full bg-white/85 px-3 py-1 text-[11px] font-medium text-[#1C1C1C] tracking-wide">
                        {category.name}
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="absolute inset-0 bg-white"></div>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-[11px] font-semibold text-[#1C1C1C] px-3 py-1 rounded-full border border-[#E8E4DA]">
                          All
                        </span>
                      </div>
                    </>
                  )}
                </button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section id="products-section" className="py-20 px-6" key={`section-${selectedCategory}`}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#1C1C1C]">
            {selectedCategory === 'all' ? `All Products (${filteredProducts.length})` : `${categories.find(c => c.id === selectedCategory)?.name || 'Products'} (${filteredProducts.length})`}
          </h2>
          {filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8" key={`grid-${selectedCategory}`}>
              {filteredProducts.map((product, index) => (
                <div
                  key={`${selectedCategory}-${product.id}`}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DA]"
                  style={{ 
                    opacity: 1,
                    transform: 'translateY(0)'
                  }}
                >
                  <div className="relative h-60 overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
                    <img
                      key={`img-${product.id}-${selectedCategory}`}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        console.error('❌ Failed to load:', product.image);
                        target.src = '/logos/Main logo.png';
                        target.className = 'w-full h-full object-contain p-8 opacity-50';
                      }}
                      onLoad={() => {
                        console.log('✅ Loaded:', product.name);
                      }}
                      loading="eager"
                    />
                  </div>

                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-[#1C1C1C]">{product.name}</h3>
                    <button
                      onClick={() => addToQuote(product)}
                      className="w-full px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311] flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add to Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#5A5A5A]">No products found in this category.</p>
              <p className="text-sm text-[#999] mt-2">Selected category: {selectedCategory}</p>
              <p className="text-sm text-[#999]">Total products in system: {products.length}</p>
            </div>
          )}
        </div>
      </section>

      {quoteItems.length > 0 && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed right-6 top-1/2 -translate-y-1/2 z-40 bg-[#C06014] text-white px-6 py-4 rounded-l-2xl shadow-lg hover:bg-[#a95311] transition-colors duration-300 flex flex-col items-center gap-2 min-w-[100px]"
        >
          <ShoppingCart className="w-6 h-6" />
          <div className="text-center">
            <p className="text-xs font-medium">{uniqueProductCount}</p>
            <p className="text-xs opacity-90">Products</p>
          </div>
        </button>
      )}

      {showSidebar && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/50 z-40"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[450px] bg-white border-l border-[#E8E4DA] z-50 transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-6 border-b border-[#E8E4DA] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingCart className="w-6 h-6 text-[#C06014]" />
              <h3 className="text-xl font-semibold text-[#1C1C1C]">Quote Summary</h3>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-[#6F6F6F] hover:text-[#1A1A1A] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-[#FDFBF7]">
            {quoteItems.length === 0 ? (
              <div className="text-center py-12 text-[#86837D]">
                <ShoppingCart className="w-16 h-16 mx-auto mb-4 opacity-40" />
                <p>Your quote is empty</p>
              </div>
            ) : (
              quoteItems.map((item) => (
                <div
                  key={item.product.id}
                  className="relative flex gap-4 p-4 bg-white border border-[#E8E4DA] rounded-xl"
                >
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="absolute top-2 right-2 text-[#A7A29A] hover:text-[#C06014] transition-colors z-10"
                  >
                    <X className="w-5 h-5" />
                  </button>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-[#1A1A1A] mb-1">{item.product.name}</h4>
                  </div>
                </div>
              ))
            )}
          </div>

          {quoteItems.length > 0 && (
            <div className="p-6 border-t border-[#E8E4DA] bg-white">
              <div className="mb-4 space-y-2">
                <div className="text-center">
                  <p className="text-sm text-[#86837D] mb-1">Total Products</p>
                  <p className="text-xl font-semibold text-[#1C1C1C]">
                    {uniqueProductCount}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuoteForm(true)}
                className="w-full px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311]"
              >
                Get Quote
              </button>
            </div>
          )}
        </div>
      </div>

      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto animate-on-scroll">
          <h3 className="text-3xl md:text-4xl font-semibold text-center text-[#1C1C1C] mb-8 animate-on-scroll">
            Trusted by the best
          </h3>

          <div className="relative overflow-hidden animate-on-scroll">
            <div className="flex gap-10 animate-scroll-left w-max">
              {[...retailerLogos, ...retailerLogos].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-32 md:w-40 h-16 md:h-20"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {showQuoteForm && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full relative animate-scale-in border border-[#E8E4DA] shadow-lg">
            <button
              onClick={() => setShowQuoteForm(false)}
              className="absolute top-4 right-4 text-[#A7A29A] hover:text-[#1C1C1C]"
            >
              <X className="w-6 h-6" />
            </button>

            <h3 className="text-2xl font-semibold text-[#1C1C1C] mb-6">Add business details</h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#1A1A1A] mb-2">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-4 py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors"
                  placeholder="GST Number"
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311] mt-6"
              >
                Submit Quote Request
              </button>
            </form>
          </div>
        </div>
      )}

      {showConfirmation && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-6">
          <div className="bg-white rounded-2xl p-12 max-w-lg w-full text-center relative animate-scale-in border border-[#E8E4DA] shadow-lg">
            <div className="w-20 h-20 bg-[#C06014]/12 rounded-full flex items-center justify-center mx-auto mb-6">
              <Sparkles className="w-10 h-10 text-[#C06014]" />
            </div>

            <h3 className="text-2xl font-semibold text-[#1C1C1C] mb-4">
              Your quotation has been received successfully!
            </h3>

            <p className="text-base text-[#5A5A5A] mb-3">
              Our team will review and contact you within 48 hours.
            </p>

            <p className="text-sm text-[#86837D] mb-8">
              Once approved, you'll receive your login credentials to manage future orders.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setQuoteItems([]);
                  setShowSidebar(false);
                  onNavigate('home');
                }}
                className="flex-1 px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311]"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setQuoteItems([]);
                  setShowSidebar(false);
                }}
                className="flex-1 px-6 py-3 border border-[#C06014] text-[#C06014] rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#C06014]/5"
              >
                Explore More Products
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
