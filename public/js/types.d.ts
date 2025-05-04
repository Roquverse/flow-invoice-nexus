// Extend jQuery interface with plugin methods
interface JQuery {
  slick(options?: any): JQuery;
  venoBox(options?: any): JQuery;
  masonry(options?: any): JQuery;
  isotope(options?: any): JQuery;
  asPieProgress(options?: any): JQuery;
  stickySidebar(options?: any): JQuery;
  parallax(options?: any): JQuery;
}

// Define Swiper type
interface SwiperOptions {
  direction?: "horizontal" | "vertical";
  loop?: boolean;
  pagination?: {
    el: string;
  };
  navigation?: {
    nextEl: string;
    prevEl: string;
  };
}

interface SwiperConstructor {
  new (selector: string, options?: SwiperOptions): any;
}

// Define ScrollTrigger type
interface ScrollTriggerStatic {
  init(): void;
}

// Define Splitting type
interface SplittingStatic {
  (): void;
}

// Define Lightbox type
interface LightboxStatic {
  option(options: {
    resizeDuration?: number;
    wrapAround?: boolean;
    [key: string]: any;
  }): void;
}

// Declare module types for imports
declare module "*.js" {
  const content: any;
  export default content;
}

// Extend Window interface for global objects
interface Window {
  jQuery: typeof $;
  $: typeof $;
  Swiper: SwiperConstructor;
  ScrollTrigger: ScrollTriggerStatic;
  Splitting: SplittingStatic;
  lightbox: LightboxStatic;
}
