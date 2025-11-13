import { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import { X, ShoppingCart, Sparkles, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, products, Product } from '../data/products';
import BackButton from '../components/BackButton';
import { RETAILER_LOGOS, QUOTE_STEPS, TIMINGS, CAROUSEL_CONFIG, COLORS } from '../config/constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { smoothScrollToElement } from '../utils/animations';

interface QuotationPageProps {
  onNavigate: (page: 'home' | 'quote') => void;
}

interface QuoteItem {
  product: Product;
  quantity: number;
}


export default function QuotationPage({ onNavigate }: QuotationPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isCarouselPaused, setIsCarouselPaused] = useState(false);
  const categoryCarouselRef = useRef<HTMLDivElement>(null);
  const carouselResumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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

  // Filter products based on selected category
  const filteredProducts = useMemo(() => {
    if (!products || products.length === 0) {
      return [];
    }
    
    if (selectedCategory === 'all') {
      return [...products]; // Return all products
    }
    
    return products.filter((p) => p.category === selectedCategory);
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

  // Setup scroll animations
  useScrollAnimation([selectedCategory]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (carouselResumeTimeoutRef.current) {
        clearTimeout(carouselResumeTimeoutRef.current);
      }
    };
  }, []);

  // Scroll to products section on initial load
  useEffect(() => {
    if (selectedCategory === 'all' && filteredProducts.length > 0) {
      const timer = setTimeout(() => {
        const productsSection = document.getElementById('products-section');
        if (productsSection) {
          const rect = productsSection.getBoundingClientRect();
          if (rect.top > window.innerHeight || rect.bottom < 0 || window.scrollY === 0) {
            smoothScrollToElement('products-section');
          }
        }
      }, TIMINGS.scrollDelay);
      return () => clearTimeout(timer);
    }
  }, [selectedCategory, filteredProducts.length]);

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
              {QUOTE_STEPS.map((milestone, index) => (
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

          <div className="relative overflow-hidden animate-on-scroll" style={{ position: 'relative' }}>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (categoryCarouselRef.current) {
                  setIsCarouselPaused(true);
                  const currentScroll = categoryCarouselRef.current.scrollLeft;
                  categoryCarouselRef.current.scrollTo({ 
                    left: currentScroll - CAROUSEL_CONFIG.scrollAmount, 
                    behavior: 'smooth' 
                  });
                  if (carouselResumeTimeoutRef.current) {
                    clearTimeout(carouselResumeTimeoutRef.current);
                  }
                  carouselResumeTimeoutRef.current = setTimeout(() => {
                    setIsCarouselPaused(false);
                  }, TIMINGS.carouselResume);
                }
              }}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 border-2 border-[#C06014] rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Scroll categories left"
              type="button"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <ChevronLeft className="w-6 h-6 text-[#C06014]" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (categoryCarouselRef.current) {
                  setIsCarouselPaused(true);
                  const currentScroll = categoryCarouselRef.current.scrollLeft;
                  categoryCarouselRef.current.scrollTo({ 
                    left: currentScroll + CAROUSEL_CONFIG.scrollAmount, 
                    behavior: 'smooth' 
                  });
                  if (carouselResumeTimeoutRef.current) {
                    clearTimeout(carouselResumeTimeoutRef.current);
                  }
                  carouselResumeTimeoutRef.current = setTimeout(() => {
                    setIsCarouselPaused(false);
                  }, TIMINGS.carouselResume);
                }
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-50 bg-white hover:bg-gray-100 border-2 border-[#C06014] rounded-full p-3 shadow-xl transition-all duration-300 hover:scale-110"
              aria-label="Scroll categories right"
              type="button"
              style={{ pointerEvents: 'auto', cursor: 'pointer' }}
            >
              <ChevronRight className="w-6 h-6 text-[#C06014]" />
            </button>
            <div 
              ref={categoryCarouselRef}
              className={`flex gap-4 w-max overflow-x-auto scrollbar-hide ${isCarouselPaused ? '' : 'animate-scroll-left'}`}
              style={{ scrollBehavior: 'smooth', position: 'relative', zIndex: 1 }}
              onMouseEnter={() => setIsCarouselPaused(true)}
              onMouseLeave={() => {
                if (carouselResumeTimeoutRef.current) {
                  clearTimeout(carouselResumeTimeoutRef.current);
                }
                carouselResumeTimeoutRef.current = setTimeout(() => {
                  setIsCarouselPaused(false);
                }, TIMINGS.carouselMouseLeave);
              }}
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
                    setSelectedCategory(category.id);
                    setIsCarouselPaused(true);
                    
                    if (carouselResumeTimeoutRef.current) {
                      clearTimeout(carouselResumeTimeoutRef.current);
                    }
                    carouselResumeTimeoutRef.current = setTimeout(() => {
                      setIsCarouselPaused(false);
                    }, TIMINGS.carouselResume);
                    
                    smoothScrollToElement('products-section');
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

      <section id="products-section" className="py-20 px-6 bg-[#FAF9F7]" key={selectedCategory}>
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8 text-[#1C1C1C]">
            {selectedCategory === 'all' 
              ? `All Products (${filteredProducts?.length || 0})` 
              : `${categories.find(c => c.id === selectedCategory)?.name || 'Products'} (${filteredProducts?.length || 0})`
            }
          </h2>
          {Array.isArray(filteredProducts) && filteredProducts.length > 0 ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredProducts.map((product, idx) => (
                <div
                  key={`${selectedCategory}-${product.id}-${idx}`}
                  className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DA]"
                  style={{ 
                    opacity: 1,
                    transform: 'translateY(0)'
                  }}
                >
                  <div className="relative h-60 overflow-hidden bg-[#F5F5F5] flex items-center justify-center">
                    <img
                      key={`img-${product.id}-${selectedCategory}-${idx}`}
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain p-4"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logos/Main logo.png';
                        target.className = 'w-full h-full object-contain p-8 opacity-50';
                      }}
                      loading="eager"
                    />
                  </div>
                  <div className="p-6 space-y-3">
                    <h3 className="text-lg font-semibold text-[#1C1C1C]">{product.name}</h3>
                    <p className="text-sm text-[#5A5A5A]">Weight: {product.weightRange}</p>
                    <button
                      onClick={() => addToQuote(product)}
                      className="w-full px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311] flex items-center justify-center gap-2"
                    >
                      <Plus className="w-4 h-4" />
                      Add to Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-lg text-[#5A5A5A]">No products found in this category.</p>
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
              {[...RETAILER_LOGOS, ...RETAILER_LOGOS].map((brand, index) => (
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
