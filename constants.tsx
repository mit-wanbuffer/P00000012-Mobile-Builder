
import { BlockType } from './types';

export const COMPONENT_METADATA: Record<BlockType, { label: string, icon: string, description: string, category: string, allowedScreens?: string[] }> = {
  [BlockType.PROMO_MARQUEE]: { label: 'Promo Marquee', icon: '📢', description: 'Scrolling top announcement', category: 'Marketing' },
  [BlockType.BANNER]: { label: 'Static Banner', icon: '🖼️', description: 'Fashion-first imagery', category: 'Marketing' },
  [BlockType.BANNER_SLIDER]: { label: 'Banner Slider', icon: '🎠', description: 'Multi-image carousel', category: 'Marketing' },
  [BlockType.TIMER_BANNER]: { label: 'Countdown', icon: '⏱️', description: 'Flash sale driver', category: 'Marketing' },
  
  [BlockType.PRODUCT_GRID]: { label: 'Product Grid', icon: '🛍️', description: 'FashionNova style grid', category: 'Commerce' },
  [BlockType.CATEGORY_MENU]: { label: 'Category Icons', icon: '📁', description: 'Circular discovery links', category: 'Commerce' },
  [BlockType.COLLECTION_LIST]: { label: 'Collection Rows', icon: '☰', description: 'List of categories', category: 'Commerce' },
  
  [BlockType.PRODUCT_IMAGES]: { label: 'Image Gallery', icon: '🖼️', description: 'PDP Image Slider', category: 'PDP', allowedScreens: ['PDP'] },
  [BlockType.PRODUCT_TITLE]: { label: 'Title & Vendor', icon: '🏷️', description: 'Product header', category: 'PDP', allowedScreens: ['PDP'] },
  [BlockType.PRODUCT_PRICE]: { label: 'Price Block', icon: '💰', description: 'Current & Compare prices', category: 'PDP', allowedScreens: ['PDP'] },
  [BlockType.VARIANT_SELECTOR]: { label: 'Size/Color Picker', icon: '🎨', description: 'Options selection', category: 'PDP', allowedScreens: ['PDP'] },
  [BlockType.PRODUCT_DESCRIPTION]: { label: 'Description', icon: '📖', description: 'Tabs or Text details', category: 'PDP', allowedScreens: ['PDP'] },
  [BlockType.ADD_TO_CART]: { label: 'Checkout CTA', icon: '🛒', description: 'Add to Bag button', category: 'PDP', allowedScreens: ['PDP'] },

  [BlockType.CART_ITEMS]: { label: 'Bag Items', icon: '🛍️', description: 'List of items in cart', category: 'Cart', allowedScreens: ['CART'] },
  [BlockType.FREE_SHIPPING_BAR]: { label: 'Shipping Goal', icon: '🚚', description: 'Progress to free delivery', category: 'Cart', allowedScreens: ['CART'] },
  [BlockType.PRICE_SUMMARY]: { label: 'Price Totals', icon: '🧾', description: 'Subtotal & Taxes', category: 'Cart', allowedScreens: ['CART'] },
  [BlockType.CHECKOUT_BUTTON]: { label: 'Pay Now', icon: '💳', description: 'Final checkout button', category: 'Cart', allowedScreens: ['CART'] },

  [BlockType.PROFILE_HEADER]: { label: 'User Header', icon: '👤', description: 'Name & Greeting', category: 'Account', allowedScreens: ['PROFILE'] },
  [BlockType.MENU_LIST]: { label: 'Action Menu', icon: '📋', description: 'Orders/Info links', category: 'Account', allowedScreens: ['PROFILE'] },
  [BlockType.ADDRESS_CARD]: { label: 'Address List', icon: '📍', description: 'Saved locations', category: 'Account', allowedScreens: ['PROFILE'] },
  [BlockType.LOGIN_FORM]: { label: 'Auth UI', icon: '🔑', description: 'Login/Join blocks', category: 'Auth' },
  
  [BlockType.TEXT]: { label: 'Rich Text', icon: '📝', description: 'Heading or Paragraph', category: 'Content' },
  [BlockType.IMAGE]: { label: 'Single Image', icon: '📷', description: 'Simple visual', category: 'Content' },
  [BlockType.BUTTON]: { label: 'Custom Button', icon: '🔘', description: 'Linked action', category: 'Content' },
  [BlockType.SPACER]: { label: 'Spacer', icon: '↕️', description: 'Vertical gap', category: 'Utility' },
};
