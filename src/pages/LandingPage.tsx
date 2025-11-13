import { useEffect, useState, useMemo } from 'react';
import { TrendingUp, Star, Truck, Receipt, IndianRupee, ArrowRight } from 'lucide-react';
import { 
  FACTORY_IMAGES, 
  HOME_CAROUSEL_IMAGES, 
  RETAILER_LOGOS, 
  CERTIFICATIONS, 
  FEATURES, 
  TIMINGS 
} from '../config/constants';
import { useScrollAnimation } from '../hooks/useScrollAnimation';
import { smoothScrollToElement } from '../utils/animations';

interface LandingPageProps {
  onNavigate: (page: 'home' | 'quote') => void;
}

// Convert carousel images array to objects with src and caption
const albumImages = HOME_CAROUSEL_IMAGES.map((src, index) => ({
  src,
  caption: `Silver Craft ${index + 1}`
}));

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [leftImageIndex, setLeftImageIndex] = useState(0);
  const [rightImageIndex, setRightImageIndex] = useState(Math.floor(FACTORY_IMAGES.length / 2));

  // Setup scroll animations
  useScrollAnimation();

  // Cycle through all factory images
  useEffect(() => {
    const interval = setInterval(() => {
      setLeftImageIndex((prev) => (prev + 1) % FACTORY_IMAGES.length);
      setRightImageIndex((prev) => (prev + 1) % FACTORY_IMAGES.length);
    }, TIMINGS.imageTransition);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-[#FAF9F7]">
      <section className="min-h-screen flex items-center relative overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="/albums/main hero photo.jpg"
            alt="Silver Crafts Hero"
            className="w-full h-full object-cover"
            style={{ objectPosition: '60% bottom' }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/60 via-[#1A1A1A]/30 to-transparent"></div>
        </div>

        <div className="w-full px-6 md:px-12 lg:px-16 py-32 relative z-10">
          <div className="max-w-2xl space-y-8 animate-on-scroll">
            <p className="text-lg md:text-xl text-white/95 leading-relaxed max-w-xl">
            Power your retail growth with our organised silver articles manufacturing
            </p>
            <div className="flex gap-4 pt-4">
              <button
                onClick={() => smoothScrollToElement('categories')}
                className="px-8 py-3 bg-[#C06014] text-white rounded-full text-sm font-medium transition-colors duration-300 hover:bg-[#a95311]"
              >
                Explore Products
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[90vh] md:h-[95vh] bg-black overflow-hidden border-t-2 border-b-2 border-[#C06014]/30">
        <div className="absolute inset-0 flex flex-row">
          {/* Left Side - Cycles through all images */}
          <div className="w-1/2 h-full relative overflow-hidden">
            {FACTORY_IMAGES.map((image, index) => (
              <div 
                key={`left-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  leftImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Silver Crafts Manufacturing ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
          </div>

          {/* Center Divider */}
          <div className="w-0.5 bg-gradient-to-b from-transparent via-[#C06014]/60 to-transparent"></div>

          {/* Right Side - Cycles through all images (offset) */}
          <div className="w-1/2 h-full relative overflow-hidden">
            {FACTORY_IMAGES.map((image, index) => (
              <div 
                key={`right-${index}`}
                className={`absolute inset-0 transition-opacity duration-1000 ${
                  rightImageIndex === index ? 'opacity-100' : 'opacity-0'
                }`}
              >
                <img
                  src={image}
                  alt={`Silver Crafts Craftsmanship ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {/* Overlay Gradient */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/20 to-black/30"></div>
          </div>
          
          {/* Golden border dividers */}
          <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C06014]/60 to-transparent"></div>
          <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-[#C06014]/60 to-transparent"></div>
        </div>
      </section>

      <section className="py-20 px-6 bg-white border-t border-[#EDEAE2]">
        <div className="max-w-5xl mx-auto text-center space-y-4 animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold text-[#1C1C1C] animate-on-scroll">
            Certified silver manufacturing excellence
          </h2>
          <p className="text-sm md:text-base text-[#666666]">
            
          </p>
        </div>
        <div className="max-w-5xl mx-auto mt-12 animate-on-scroll">
          <div className="flex flex-nowrap justify-center items-center gap-8 md:gap-12 overflow-x-hidden">
            {CERTIFICATIONS.map((cert, index) => (
              <div
                key={index}
                className="flex-shrink-0 flex items-center justify-center animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <img
                  src={cert.src}
                  alt={cert.alt}
                  className="h-16 md:h-20 w-auto object-contain"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="categories" className="py-20 px-6 overflow-hidden">
        <div className="max-w-7xl mx-auto animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#1C1C1C] mb-12 animate-on-scroll">
            
          </h2>

          <div className="relative animate-on-scroll">
            <div className="flex gap-6 animate-scroll-left w-max">
              {[...albumImages, ...albumImages].map((album, index) => (
                <div
                  key={`${album.src}-${index}`}
                  className="flex-shrink-0 w-48 cursor-pointer"
                  onClick={() => onNavigate('quote')}
                >
                  <div className="relative h-60 rounded-xl overflow-hidden border border-[#E8E4DA] bg-white">
                    <img
                      src={album.src}
                      alt={album.caption}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 md:py-28 px-6 bg-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F7] via-white to-[#FAF9F7] opacity-50"></div>
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="animate-on-scroll">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-semibold text-[#1C1C1C] mb-4">Our story</h2>
              <div className="inline-block mb-4">
                <div className="w-16 h-1 bg-[#C06014] mx-auto rounded-full"></div>
              </div>
            </div>

            <div className="bg-white rounded-2xl border border-[#E8E4DA] shadow-sm p-8 md:p-12 space-y-6">
              <div className="space-y-5 text-left">
                <p className="text-lg md:text-xl text-[#1C1C1C] leading-relaxed font-medium">
                Silver Crafts began with one goal — to manufacture silver articles that jewellery retailers can rely on.
              </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-[#E8E4DA] to-transparent my-6"></div>
                
                <p className="text-base md:text-lg text-[#5A5A5A] leading-relaxed">
                Over the years, we listened to what silver retailers really need: consistent quality, factory pricing, and on-time delivery without constant follow-up. That's how we built a system-focused manufacturing that now serves well-known corporate jewellery brands & independent silver retailers across India.
              </p>
                
                <div className="h-px bg-gradient-to-r from-transparent via-[#E8E4DA] to-transparent my-6"></div>
                
                <p className="text-lg md:text-xl text-[#1C1C1C] leading-relaxed font-medium italic">
                  We are here to be your long-term silver partner — to grow your business, and to grow with you.
              </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto animate-on-scroll">
          <h2 className="text-3xl md:text-4xl font-semibold text-center text-[#1C1C1C] mb-12 animate-on-scroll">
            Why choose Silver Crafts
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {FEATURES.map((item, index) => {
              // Map icons to features
              const icons = [TrendingUp, IndianRupee, Star, Truck, Receipt];
              const Icon = icons[index];
              
              return (
              <div
                key={index}
                className="text-left space-y-4 p-8 rounded-xl bg-white border border-[#E8E4DA] animate-on-scroll"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <div className="w-14 h-14 bg-[#F5EFE6] rounded-full flex items-center justify-center">
                  <Icon className="w-7 h-7 text-[#C06014]" />
                </div>
                <h3 className="text-lg font-semibold text-[#1C1C1C]">{item.title}</h3>
                <p className="text-sm text-[#5A5A5A] leading-relaxed">{item.desc}</p>
              </div>
              );
            })}
          </div>
        </div>
      </section>

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

      <section className="py-20 md:py-28 px-6 bg-gradient-to-b from-[#FDFBF7] to-white border-t border-[#EDEAE2]">
        <div className="max-w-4xl mx-auto text-center animate-on-scroll">
          <h2 className="text-3xl md:text-5xl font-semibold text-[#1C1C1C] leading-tight mb-8">
            Plan your next silver collection with us
          </h2>
          <button
            onClick={() => onNavigate('quote')}
            className="px-8 py-4 bg-[#C06014] text-white rounded-full text-base font-semibold transition-colors duration-300 hover:bg-[#a95311] flex items-center justify-center gap-2 mx-auto"
          >
            Request a Quote
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>
    </div>
  );
}
