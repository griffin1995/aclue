/**
 * Product Image Gallery - Client Component
 *
 * Interactive image gallery with zoom, lightbox, and thumbnail navigation.
 * Provides enhanced product viewing experience with keyboard support.
 */
// @ts-nocheck


'use client';

function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Maximize2, X } from 'lucide-react';
interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}
export function ProductImageGallery({
  images,
  productName
}: ProductImageGalleryProps) {
  if (stryMutAct_9fa48("6066")) {
    {}
  } else {
    stryCov_9fa48("6066");
    const [selectedImage, setSelectedImage] = useState(0);
    const [isLightboxOpen, setIsLightboxOpen] = useState(stryMutAct_9fa48("6067") ? true : (stryCov_9fa48("6067"), false));
    const handlePreviousImage = () => {
      if (stryMutAct_9fa48("6068")) {
        {}
      } else {
        stryCov_9fa48("6068");
        setSelectedImage(stryMutAct_9fa48("6069") ? () => undefined : (stryCov_9fa48("6069"), prev => (stryMutAct_9fa48("6072") ? prev !== 0 : stryMutAct_9fa48("6071") ? false : stryMutAct_9fa48("6070") ? true : (stryCov_9fa48("6070", "6071", "6072"), prev === 0)) ? stryMutAct_9fa48("6073") ? images.length + 1 : (stryCov_9fa48("6073"), images.length - 1) : stryMutAct_9fa48("6074") ? prev + 1 : (stryCov_9fa48("6074"), prev - 1)));
      }
    };
    const handleNextImage = () => {
      if (stryMutAct_9fa48("6075")) {
        {}
      } else {
        stryCov_9fa48("6075");
        setSelectedImage(stryMutAct_9fa48("6076") ? () => undefined : (stryCov_9fa48("6076"), prev => (stryMutAct_9fa48("6079") ? prev !== images.length - 1 : stryMutAct_9fa48("6078") ? false : stryMutAct_9fa48("6077") ? true : (stryCov_9fa48("6077", "6078", "6079"), prev === (stryMutAct_9fa48("6080") ? images.length + 1 : (stryCov_9fa48("6080"), images.length - 1)))) ? 0 : stryMutAct_9fa48("6081") ? prev - 1 : (stryCov_9fa48("6081"), prev + 1)));
      }
    };
    const handleKeyDown = (event: React.KeyboardEvent) => {
      if (stryMutAct_9fa48("6082")) {
        {}
      } else {
        stryCov_9fa48("6082");
        if (stryMutAct_9fa48("6085") ? event.key !== 'ArrowLeft' : stryMutAct_9fa48("6084") ? false : stryMutAct_9fa48("6083") ? true : (stryCov_9fa48("6083", "6084", "6085"), event.key === (stryMutAct_9fa48("6086") ? "" : (stryCov_9fa48("6086"), 'ArrowLeft')))) {
          if (stryMutAct_9fa48("6087")) {
            {}
          } else {
            stryCov_9fa48("6087");
            handlePreviousImage();
          }
        } else if (stryMutAct_9fa48("6090") ? event.key !== 'ArrowRight' : stryMutAct_9fa48("6089") ? false : stryMutAct_9fa48("6088") ? true : (stryCov_9fa48("6088", "6089", "6090"), event.key === (stryMutAct_9fa48("6091") ? "" : (stryCov_9fa48("6091"), 'ArrowRight')))) {
          if (stryMutAct_9fa48("6092")) {
            {}
          } else {
            stryCov_9fa48("6092");
            handleNextImage();
          }
        } else if (stryMutAct_9fa48("6095") ? event.key !== 'Escape' : stryMutAct_9fa48("6094") ? false : stryMutAct_9fa48("6093") ? true : (stryCov_9fa48("6093", "6094", "6095"), event.key === (stryMutAct_9fa48("6096") ? "" : (stryCov_9fa48("6096"), 'Escape')))) {
          if (stryMutAct_9fa48("6097")) {
            {}
          } else {
            stryCov_9fa48("6097");
            setIsLightboxOpen(stryMutAct_9fa48("6098") ? true : (stryCov_9fa48("6098"), false));
          }
        }
      }
    };
    return <div className="space-y-4">
      {/* Main Image */}
      <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden group">
        <Image src={images[selectedImage]} alt={stryMutAct_9fa48("6099") ? `` : (stryCov_9fa48("6099"), `${productName} - Image ${stryMutAct_9fa48("6100") ? selectedImage - 1 : (stryCov_9fa48("6100"), selectedImage + 1)}`)} fill className="object-cover transition-transform duration-300 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 50vw" priority />

        {/* Zoom Button */}
        <button onClick={stryMutAct_9fa48("6101") ? () => undefined : (stryCov_9fa48("6101"), () => setIsLightboxOpen(stryMutAct_9fa48("6102") ? false : (stryCov_9fa48("6102"), true)))} className="absolute top-4 right-4 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Open image in lightbox">
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Navigation Arrows (if multiple images) */}
        {stryMutAct_9fa48("6105") ? images.length > 1 || <>
            <button onClick={handlePreviousImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Previous image">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Next image">
              <ChevronRight className="w-5 h-5" />
            </button>
          </> : stryMutAct_9fa48("6104") ? false : stryMutAct_9fa48("6103") ? true : (stryCov_9fa48("6103", "6104", "6105"), (stryMutAct_9fa48("6108") ? images.length <= 1 : stryMutAct_9fa48("6107") ? images.length >= 1 : stryMutAct_9fa48("6106") ? true : (stryCov_9fa48("6106", "6107", "6108"), images.length > 1)) && <>
            <button onClick={handlePreviousImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Previous image">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/80 backdrop-blur-sm text-gray-800 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white" aria-label="Next image">
              <ChevronRight className="w-5 h-5" />
            </button>
          </>)}

        {/* Image Counter */}
        {stryMutAct_9fa48("6111") ? images.length > 1 || <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {selectedImage + 1} / {images.length}
          </div> : stryMutAct_9fa48("6110") ? false : stryMutAct_9fa48("6109") ? true : (stryCov_9fa48("6109", "6110", "6111"), (stryMutAct_9fa48("6114") ? images.length <= 1 : stryMutAct_9fa48("6113") ? images.length >= 1 : stryMutAct_9fa48("6112") ? true : (stryCov_9fa48("6112", "6113", "6114"), images.length > 1)) && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black/60 text-white px-3 py-1 rounded-full text-sm">
            {stryMutAct_9fa48("6115") ? selectedImage - 1 : (stryCov_9fa48("6115"), selectedImage + 1)} / {images.length}
          </div>)}
      </div>

      {/* Thumbnail Grid */}
      {stryMutAct_9fa48("6118") ? images.length > 1 || <div className="grid grid-cols-4 gap-2">
          {images.map((image, index) => <button key={index} onClick={() => setSelectedImage(index)} className={`relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all ${index === selectedImage ? 'ring-2 ring-primary-500 ring-offset-2' : 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1'}`}>
              <Image src={image} alt={`${productName} - Thumbnail ${index + 1}`} fill className="object-cover" sizes="(max-width: 768px) 25vw, 12.5vw" />
            </button>)}
        </div> : stryMutAct_9fa48("6117") ? false : stryMutAct_9fa48("6116") ? true : (stryCov_9fa48("6116", "6117", "6118"), (stryMutAct_9fa48("6121") ? images.length <= 1 : stryMutAct_9fa48("6120") ? images.length >= 1 : stryMutAct_9fa48("6119") ? true : (stryCov_9fa48("6119", "6120", "6121"), images.length > 1)) && <div className="grid grid-cols-4 gap-2">
          {images.map(stryMutAct_9fa48("6122") ? () => undefined : (stryCov_9fa48("6122"), (image, index) => <button key={index} onClick={stryMutAct_9fa48("6123") ? () => undefined : (stryCov_9fa48("6123"), () => setSelectedImage(index))} className={stryMutAct_9fa48("6124") ? `` : (stryCov_9fa48("6124"), `relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all ${(stryMutAct_9fa48("6127") ? index !== selectedImage : stryMutAct_9fa48("6126") ? false : stryMutAct_9fa48("6125") ? true : (stryCov_9fa48("6125", "6126", "6127"), index === selectedImage)) ? stryMutAct_9fa48("6128") ? "" : (stryCov_9fa48("6128"), 'ring-2 ring-primary-500 ring-offset-2') : stryMutAct_9fa48("6129") ? "" : (stryCov_9fa48("6129"), 'hover:ring-2 hover:ring-gray-300 hover:ring-offset-1')}`)}>
              <Image src={image} alt={stryMutAct_9fa48("6130") ? `` : (stryCov_9fa48("6130"), `${productName} - Thumbnail ${stryMutAct_9fa48("6131") ? index - 1 : (stryCov_9fa48("6131"), index + 1)}`)} fill className="object-cover" sizes="(max-width: 768px) 25vw, 12.5vw" />
            </button>))}
        </div>)}

      {/* Lightbox Modal */}
      <AnimatePresence>
        {stryMutAct_9fa48("6134") ? isLightboxOpen || <motion.div initial={{
          opacity: 0
        }} animate={{
          opacity: 1
        }} exit={{
          opacity: 0
        }} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setIsLightboxOpen(false)} onKeyDown={handleKeyDown} tabIndex={0}>
            <motion.div initial={{
            scale: 0.9
          }} animate={{
            scale: 1
          }} exit={{
            scale: 0.9
          }} className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center" onClick={e => e.stopPropagation()}>
              {/* Close Button */}
              <button onClick={() => setIsLightboxOpen(false)} className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10" aria-label="Close lightbox">
                <X className="w-6 h-6" />
              </button>

              {/* Main Lightbox Image */}
              <div className="relative w-full h-full max-w-3xl max-h-3xl">
                <Image src={images[selectedImage]} alt={`${productName} - Lightbox view`} fill className="object-contain" sizes="100vw" quality={100} />
              </div>

              {/* Navigation in Lightbox */}
              {images.length > 1 && <>
                  <button onClick={handlePreviousImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors" aria-label="Previous image">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors" aria-label="Next image">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>}

              {/* Image Counter in Lightbox */}
              {images.length > 1 && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  {selectedImage + 1} of {images.length}
                </div>}
            </motion.div>
          </motion.div> : stryMutAct_9fa48("6133") ? false : stryMutAct_9fa48("6132") ? true : (stryCov_9fa48("6132", "6133", "6134"), isLightboxOpen && <motion.div initial={stryMutAct_9fa48("6135") ? {} : (stryCov_9fa48("6135"), {
          opacity: 0
        })} animate={stryMutAct_9fa48("6136") ? {} : (stryCov_9fa48("6136"), {
          opacity: 1
        })} exit={stryMutAct_9fa48("6137") ? {} : (stryCov_9fa48("6137"), {
          opacity: 0
        })} className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={stryMutAct_9fa48("6138") ? () => undefined : (stryCov_9fa48("6138"), () => setIsLightboxOpen(stryMutAct_9fa48("6139") ? true : (stryCov_9fa48("6139"), false)))} onKeyDown={handleKeyDown} tabIndex={0}>
            <motion.div initial={stryMutAct_9fa48("6140") ? {} : (stryCov_9fa48("6140"), {
            scale: 0.9
          })} animate={stryMutAct_9fa48("6141") ? {} : (stryCov_9fa48("6141"), {
            scale: 1
          })} exit={stryMutAct_9fa48("6142") ? {} : (stryCov_9fa48("6142"), {
            scale: 0.9
          })} className="relative max-w-4xl max-h-full w-full h-full flex items-center justify-center" onClick={stryMutAct_9fa48("6143") ? () => undefined : (stryCov_9fa48("6143"), e => e.stopPropagation())}>
              {/* Close Button */}
              <button onClick={stryMutAct_9fa48("6144") ? () => undefined : (stryCov_9fa48("6144"), () => setIsLightboxOpen(stryMutAct_9fa48("6145") ? true : (stryCov_9fa48("6145"), false)))} className="absolute top-4 right-4 bg-white/20 backdrop-blur-sm text-white p-2 rounded-full hover:bg-white/30 transition-colors z-10" aria-label="Close lightbox">
                <X className="w-6 h-6" />
              </button>

              {/* Main Lightbox Image */}
              <div className="relative w-full h-full max-w-3xl max-h-3xl">
                <Image src={images[selectedImage]} alt={stryMutAct_9fa48("6146") ? `` : (stryCov_9fa48("6146"), `${productName} - Lightbox view`)} fill className="object-contain" sizes="100vw" quality={100} />
              </div>

              {/* Navigation in Lightbox */}
              {stryMutAct_9fa48("6149") ? images.length > 1 || <>
                  <button onClick={handlePreviousImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors" aria-label="Previous image">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors" aria-label="Next image">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </> : stryMutAct_9fa48("6148") ? false : stryMutAct_9fa48("6147") ? true : (stryCov_9fa48("6147", "6148", "6149"), (stryMutAct_9fa48("6152") ? images.length <= 1 : stryMutAct_9fa48("6151") ? images.length >= 1 : stryMutAct_9fa48("6150") ? true : (stryCov_9fa48("6150", "6151", "6152"), images.length > 1)) && <>
                  <button onClick={handlePreviousImage} className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors" aria-label="Previous image">
                    <ChevronLeft className="w-6 h-6" />
                  </button>
                  <button onClick={handleNextImage} className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/20 backdrop-blur-sm text-white p-3 rounded-full hover:bg-white/30 transition-colors" aria-label="Next image">
                    <ChevronRight className="w-6 h-6" />
                  </button>
                </>)}

              {/* Image Counter in Lightbox */}
              {stryMutAct_9fa48("6155") ? images.length > 1 || <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  {selectedImage + 1} of {images.length}
                </div> : stryMutAct_9fa48("6154") ? false : stryMutAct_9fa48("6153") ? true : (stryCov_9fa48("6153", "6154", "6155"), (stryMutAct_9fa48("6158") ? images.length <= 1 : stryMutAct_9fa48("6157") ? images.length >= 1 : stryMutAct_9fa48("6156") ? true : (stryCov_9fa48("6156", "6157", "6158"), images.length > 1)) && <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white/20 backdrop-blur-sm text-white px-4 py-2 rounded-full">
                  {stryMutAct_9fa48("6159") ? selectedImage - 1 : (stryCov_9fa48("6159"), selectedImage + 1)} of {images.length}
                </div>)}
            </motion.div>
          </motion.div>)}
      </AnimatePresence>
    </div>;
  }
}