
export enum BlockType {
  // Marketing & Layout
  BANNER = 'BANNER',
  BANNER_SLIDER = 'BANNER_SLIDER',
  PROMO_MARQUEE = 'PROMO_MARQUEE',
  SPACER = 'SPACER',
  TEXT = 'TEXT',
  IMAGE = 'IMAGE',
  BUTTON = 'BUTTON',
  // Commerce & Discovery
  PRODUCT_GRID = 'PRODUCT_GRID',
  CATEGORY_MENU = 'CATEGORY_MENU',
  TIMER_BANNER = 'TIMER_BANNER',
  COLLECTION_LIST = 'COLLECTION_LIST',
  // Product Detail (PDP)
  PRODUCT_IMAGES = 'PRODUCT_IMAGES',
  PRODUCT_TITLE = 'PRODUCT_TITLE',
  PRODUCT_PRICE = 'PRODUCT_PRICE',
  VARIANT_SELECTOR = 'VARIANT_SELECTOR',
  PRODUCT_DESCRIPTION = 'PRODUCT_DESCRIPTION',
  ADD_TO_CART = 'ADD_TO_CART',
  // Cart & Checkout
  CART_ITEMS = 'CART_ITEMS',
  FREE_SHIPPING_BAR = 'FREE_SHIPPING_BAR',
  PRICE_SUMMARY = 'PRICE_SUMMARY',
  CHECKOUT_BUTTON = 'CHECKOUT_BUTTON',
  // Account & Auth
  PROFILE_HEADER = 'PROFILE_HEADER',
  MENU_LIST = 'MENU_LIST',
  ADDRESS_CARD = 'ADDRESS_CARD',
  LOGIN_FORM = 'LOGIN_FORM'
}

export type ScreenType = 'HOME' | 'COLLECTION' | 'PDP' | 'CART' | 'PROFILE' | 'LOGIN' | 'CMS';

export interface BlockConfig {
  id: string;
  type: BlockType;
  title: string;
  settings: Record<string, any>;
  visibility: 'ALL' | 'GUEST' | 'LOGGED_IN';
}

export interface ThemeSettings {
  primaryColor: string;
  secondaryColor: string;
  fontFamily: string;
  logoUrl: string;
  borderRadius: number;
  accentColor: string;
}

export interface AppConfig {
  theme: ThemeSettings;
  screens: Record<ScreenType, BlockConfig[]>;
  globalSettings: {
    marqueeEnabled: boolean;
    marqueeText: string;
    guestCheckout: boolean;
  };
}
