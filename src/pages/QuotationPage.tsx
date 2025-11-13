import { useState, useEffect, useCallback, useRef } from 'react';
import { X, ShoppingCart, Sparkles, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { categories, products, Product } from '../data/products';
import BackButton from '../components/BackButton';
import { RETAILER_LOGOS, QUOTE_STEPS, CAROUSEL_CONFIG } from '../config/constants';

interface QuotationPageProps {
  onNavigate: (page: 'home' | 'quote') => void;
}

interface QuoteItem {
  product: Product;
  quantity: number;
}

export default function QuotationPage({ onNavigate }: QuotationPageProps) {
  // State Management
  const [allProducts] = useState<Product[]>(products); // All products from data
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products); // Currently displayed products
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
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

  // Initialize: Show all products on mount
  useEffect(() => {
    setFilteredProducts(allProducts);
  }, [allProducts]);

  // Handle category selection
  const handleCategoryClick = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);

    if (categoryId === 'all') {
      // Show all products
      setFilteredProducts(allProducts);
    } else {
      // Filter by category
      const filtered = allProducts.filter((p) => p.category === categoryId);
      setFilteredProducts(filtered);
    }

    // Scroll to products section
    setTimeout(() => {
      const productsSection = document.getElementById('products-section');
      if (productsSection) {
        productsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  }, [allProducts]);

  const addToQuote = useCallback((product: Product) => {
    setQuoteItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.product.id === product.id);
      if (existingItem) {
        return prevItems;
      }
      return [...prevItems, { product, quantity: 1 }];
    });
  }, []);

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

  const categoriesWithAll = [{ id: 'all', name: 'All Categories', image: null }, ...categories];

  return (
    <div className="bg-[#FAF9F7] min-h-screen">
      <BackButton onNavigate={onNavigate} />
      
      {/* Hero Section */}
      <section id="quote-hero" className="pt-24 sm:pt-28 md:pt-32 pb-12 sm:pb-14 md:pb-16 px-4 sm:px-6 bg-[#FDFBF7] border-b border-[#EDEAE2]">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-8 sm:gap-10 md:gap-12 items-center">
          <div className="space-y-4 sm:space-y-5 md:space-y-6">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-bold text-[#1C1C1C] leading-tight">
              Silver Crafts
            </h1>
            <h2 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-semibold text-[#1C1C1C] leading-snug">
              Build a tailored silverware proposal with ease
            </h2>
            
            {/* Milestone Steps */}
            <div className="flex flex-col gap-2.5 sm:gap-3 py-3 sm:py-4">
              {QUOTE_STEPS.map((milestone, index) => (
                <div key={index} className="flex items-start gap-2 sm:gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#C06014] text-white flex items-center justify-center font-semibold text-xs flex-shrink-0">
                      {milestone.step}
                    </div>
                    {index < 2 && (
                      <div className="w-0.5 h-5 sm:h-6 bg-[#E8E4DA] mt-1"></div>
                    )}
                  </div>
                  <div className="flex-1 pt-0.5">
                    <h3 className="text-xs sm:text-sm font-semibold text-[#1C1C1C] mb-0.5">
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

          <div className="h-64 sm:h-80 md:h-96 lg:h-[420px] rounded-xl sm:rounded-2xl overflow-hidden border border-[#E8E4DA] bg-white">
            <img
              src="/albums/Second page.jpg"
              alt="Silver manufacturing"
              className="w-full h-full object-cover"
              loading="eager"
            />
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories-section" className="py-10 sm:py-12 md:py-14 px-4 sm:px-6 bg-[#FAF9F7] border-b border-[#EDEAE2]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-[#1C1C1C] mb-8 sm:mb-9 md:mb-10 px-4">
            Select Category
          </h3>

          <div className="relative" style={{ position: 'relative', minHeight: '140px' }}>
            {/* Navigation Buttons */}
            <button
              onClick={(e) => {
                e.preventDefault();
                const carousel = categoryCarouselRef.current;
                if (carousel) {
                  carousel.scrollBy({ 
                    left: -CAROUSEL_CONFIG.scrollAmount, 
                    behavior: 'smooth' 
                  });
                }
              }}
              className="absolute left-1 sm:left-2 top-1/2 -translate-y-1/2 z-[100] bg-white hover:bg-gray-100 border-2 border-[#C06014] rounded-full p-2 sm:p-2.5 md:p-3 shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label="Scroll categories left"
              type="button"
            >
              <ChevronLeft className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#C06014]" />
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                const carousel = categoryCarouselRef.current;
                if (carousel) {
                  carousel.scrollBy({ 
                    left: CAROUSEL_CONFIG.scrollAmount, 
                    behavior: 'smooth' 
                  });
                }
              }}
              className="absolute right-1 sm:right-2 top-1/2 -translate-y-1/2 z-[100] bg-white hover:bg-gray-100 border-2 border-[#C06014] rounded-full p-2 sm:p-2.5 md:p-3 shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer"
              aria-label="Scroll categories right"
              type="button"
            >
              <ChevronRight className="w-5 h-5 sm:w-5 sm:h-5 md:w-6 md:h-6 text-[#C06014]" />
            </button>
            
            {/* Carousel Container */}
            <div className="overflow-hidden">
              <div 
                ref={categoryCarouselRef}
                className="flex gap-3 sm:gap-4 overflow-x-auto scrollbar-hide px-10 sm:px-11 md:px-12"
                style={{ 
                  scrollBehavior: 'smooth', 
                  position: 'relative', 
                  zIndex: 1,
                  WebkitOverflowScrolling: 'touch'
                }}
              >
                {categoriesWithAll.map((category, index) => {
                  const isSelected = selectedCategory === category.id;
                  return (
                  <button
                    key={`${category.id}-${index}`}
                    type="button"
                    onClick={() => handleCategoryClick(category.id)}
                    className={`group relative flex-shrink-0 w-28 h-28 sm:w-30 sm:h-30 md:w-32 md:h-32 rounded-lg sm:rounded-xl overflow-hidden border-2 ${
                      isSelected ? 'border-[#C06014] bg-[#FCF6F0] shadow-lg' : 'border-[#E8E4DA] bg-white'
                    } transition-all duration-300 cursor-pointer hover:shadow-lg min-h-[44px]`}
                    aria-label={`Select ${category.name} category`}
                  >
                    {category.image ? (
                      <>
                        <img
                          src={category.image}
                          alt={category.name}
                          className="absolute inset-0 w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.style.backgroundColor = '#F5F5F5';
                            }
                          }}
                        />
                        <div className="absolute inset-x-2 sm:inset-x-3 bottom-2 sm:bottom-3 rounded-full bg-white/90 px-2 sm:px-3 py-0.5 sm:py-1 text-[9px] sm:text-[10px] font-semibold text-[#1C1C1C] tracking-wide shadow-sm">
                          {category.name}
                        </div>
                      </>
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-[#C06014]/10 to-[#C06014]/5">
                        <span className="text-xs sm:text-sm font-bold text-[#C06014] px-3 sm:px-4 py-1.5 sm:py-2 rounded-full border-2 border-[#C06014] bg-white">
                          All
                        </span>
                      </div>
                    )}
                  </button>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Products Section - Always Visible, No Animations */}
      <section id="products-section" className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 sm:mb-10 md:mb-12">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#1C1C1C] mb-2 px-4">
              {selectedCategory === 'all' ? 'All Products' : categories.find(c => c.id === selectedCategory)?.name || 'Products'}
            </h2>
            <p className="text-sm sm:text-base text-[#5A5A5A]">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'} available
            </p>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5 md:gap-6">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="bg-white rounded-lg sm:rounded-xl overflow-hidden border-2 border-[#E8E4DA] hover:border-[#C06014] hover:shadow-xl transition-all duration-300 group"
                >
                  <div className="relative h-48 sm:h-52 md:h-56 overflow-hidden bg-gradient-to-br from-[#FDFBF7] to-[#F5F5F5] flex items-center justify-center p-3 sm:p-4">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110 max-w-full"
                      loading="lazy"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/logos/Main logo.png';
                        target.className = 'w-full h-full object-contain opacity-30';
                      }}
                    />
                  </div>
                  <div className="p-4 sm:p-5">
                    <h3 className="text-sm sm:text-base font-semibold text-[#1C1C1C] mb-3 min-h-[40px] sm:min-h-[48px]">
                      {product.name}
                    </h3>
                    <button
                      onClick={() => addToQuote(product)}
                      className="w-full px-3 sm:px-4 py-2 sm:py-2.5 bg-[#C06014] text-white rounded-full text-xs sm:text-sm font-medium transition-all duration-300 hover:bg-[#a95311] hover:shadow-lg flex items-center justify-center gap-2 min-h-[44px]"
                    >
                      <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                      Add to Quote
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 sm:py-16 md:py-20 px-4">
              <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <ShoppingCart className="w-10 h-10 sm:w-12 sm:h-12 text-[#C06014] opacity-40" />
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-[#1C1C1C] mb-2">No Products Available</h3>
              <p className="text-sm sm:text-base text-[#5A5A5A] mb-4 sm:mb-6">No products found in this category.</p>
              <button
                onClick={() => handleCategoryClick('all')}
                className="px-5 sm:px-6 py-2.5 sm:py-3 bg-[#C06014] text-white rounded-full text-sm font-medium hover:bg-[#a95311] transition-colors min-h-[44px]"
              >
                View All Products
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Quote Basket Button */}
      {quoteItems.length > 0 && (
        <button
          onClick={() => setShowSidebar(!showSidebar)}
          className="fixed right-3 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 bg-[#C06014] text-white px-4 sm:px-5 md:px-6 py-3 sm:py-3.5 md:py-4 rounded-l-xl sm:rounded-l-2xl shadow-lg hover:bg-[#a95311] transition-colors duration-300 flex flex-col items-center gap-1.5 sm:gap-2 min-w-[80px] sm:min-w-[90px] md:min-w-[100px]"
        >
          <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
          <div className="text-center">
            <p className="text-xs font-medium">{uniqueProductCount}</p>
            <p className="text-[10px] sm:text-xs opacity-90">Products</p>
          </div>
        </button>
      )}

      {/* Sidebar Overlay */}
      {showSidebar && (
        <div
          className="fixed inset-0 bg-[#1A1A1A]/50 z-40"
          onClick={() => setShowSidebar(false)}
        ></div>
      )}

      {/* Quote Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[90vw] md:w-[450px] bg-white border-l border-[#E8E4DA] z-50 transform transition-transform duration-300 ${
          showSidebar ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="h-full flex flex-col">
          <div className="p-4 sm:p-5 md:p-6 border-b border-[#E8E4DA] flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-[#C06014]" />
              <h3 className="text-lg sm:text-xl font-semibold text-[#1C1C1C]">Quote Summary</h3>
            </div>
            <button
              onClick={() => setShowSidebar(false)}
              className="text-[#6F6F6F] hover:text-[#1A1A1A] transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 sm:p-5 md:p-6 space-y-3 sm:space-y-4 bg-[#FDFBF7]">
            {quoteItems.length === 0 ? (
              <div className="text-center py-12 text-[#86837D]">
                <ShoppingCart className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-4 opacity-40" />
                <p className="text-sm sm:text-base">Your quote is empty</p>
              </div>
            ) : (
              quoteItems.map((item) => (
                <div
                  key={item.product.id}
                  className="relative flex gap-3 sm:gap-4 p-3 sm:p-4 bg-white border border-[#E8E4DA] rounded-lg sm:rounded-xl"
                >
                  <button
                    onClick={() => removeItem(item.product.id)}
                    className="absolute top-2 right-2 text-[#A7A29A] hover:text-[#C06014] transition-colors z-10 min-h-[44px] min-w-[44px] flex items-center justify-center"
                  >
                    <X className="w-4 h-4 sm:w-5 sm:h-5" />
                  </button>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg flex-shrink-0"
                    loading="lazy"
                  />
                  <div className="flex-1 pr-8">
                    <h4 className="font-medium text-[#1A1A1A] text-sm sm:text-base mb-1">{item.product.name}</h4>
                  </div>
                </div>
              ))
            )}
          </div>

          {quoteItems.length > 0 && (
            <div className="p-4 sm:p-5 md:p-6 border-t border-[#E8E4DA] bg-white">
              <div className="mb-4 space-y-2">
                <div className="text-center">
                  <p className="text-xs sm:text-sm text-[#86837D] mb-1">Total Products</p>
                  <p className="text-lg sm:text-xl font-semibold text-[#1C1C1C]">
                    {uniqueProductCount}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowQuoteForm(true)}
                className="w-full px-5 sm:px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311] min-h-[44px]"
              >
                Get Quote
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Trusted By Section */}
      <section className="py-12 sm:py-14 md:py-16 px-4 sm:px-6 bg-[#FAF9F7]">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-semibold text-center text-[#1C1C1C] mb-6 sm:mb-7 md:mb-8 px-4">
            Trusted by the best
          </h3>

          <div className="relative overflow-hidden">
            <div className="flex gap-6 sm:gap-8 md:gap-10 animate-scroll-left w-max">
              {[...RETAILER_LOGOS, ...RETAILER_LOGOS].map((brand, index) => (
                <div
                  key={`${brand.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center w-24 sm:w-28 md:w-32 lg:w-40 h-12 sm:h-14 md:h-16 lg:h-20"
                >
                  <img
                    src={brand.logo}
                    alt={brand.name}
                    className="max-w-full max-h-full object-contain"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Quote Form Modal */}
      {showQuoteForm && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-5 sm:p-6 md:p-8 max-w-md w-full relative animate-scale-in border border-[#E8E4DA] shadow-lg max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowQuoteForm(false)}
              className="absolute top-3 right-3 sm:top-4 sm:right-4 text-[#A7A29A] hover:text-[#1C1C1C] min-h-[44px] min-w-[44px] flex items-center justify-center"
            >
              <X className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <h3 className="text-xl sm:text-2xl font-semibold text-[#1C1C1C] mb-5 sm:mb-6 pr-8">Add business details</h3>

            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1.5 sm:mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors text-sm sm:text-base"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1.5 sm:mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  required
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors text-sm sm:text-base"
                  placeholder="+91 98765 43210"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1.5 sm:mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors text-sm sm:text-base"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-[#1A1A1A] mb-1.5 sm:mb-2">
                  GSTIN (Optional)
                </label>
                <input
                  type="text"
                  value={formData.gstin}
                  onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                  className="w-full px-3 sm:px-4 py-2.5 sm:py-3 border border-[#E8E4DA] rounded-lg focus:outline-none focus:border-[#C06014] transition-colors text-sm sm:text-base"
                  placeholder="GST Number"
                />
              </div>

              <button
                type="submit"
                className="w-full px-5 sm:px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311] mt-4 sm:mt-6 min-h-[44px]"
              >
                Submit Quote Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 bg-[#1A1A1A]/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 sm:p-6">
          <div className="bg-white rounded-xl sm:rounded-2xl p-6 sm:p-8 md:p-12 max-w-lg w-full text-center relative animate-scale-in border border-[#E8E4DA] shadow-lg max-h-[90vh] overflow-y-auto">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#C06014]/12 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
              <Sparkles className="w-8 h-8 sm:w-10 sm:h-10 text-[#C06014]" />
            </div>

            <h3 className="text-xl sm:text-2xl font-semibold text-[#1C1C1C] mb-3 sm:mb-4 px-2">
              Your quotation has been received successfully!
            </h3>

            <p className="text-sm sm:text-base text-[#5A5A5A] mb-2 sm:mb-3 px-2">
              Our team will review and contact you within 48 hours.
            </p>

            <p className="text-xs sm:text-sm text-[#86837D] mb-6 sm:mb-8 px-2">
              Once approved, you'll receive your login credentials to manage future orders.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setQuoteItems([]);
                  setShowSidebar(false);
                  onNavigate('home');
                }}
                className="flex-1 px-5 sm:px-6 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311] min-h-[44px]"
              >
                Back to Home
              </button>
              <button
                onClick={() => {
                  setShowConfirmation(false);
                  setQuoteItems([]);
                  setShowSidebar(false);
                }}
                className="flex-1 px-5 sm:px-6 py-3 border border-[#C06014] text-[#C06014] rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#C06014]/5 min-h-[44px]"
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
