export interface StoreTheme {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  background_color: string;
  text_color: string;
  font_heading: string;
  font_body: string;
  layout_style: 'modern' | 'classic' | 'minimal';
  product_card_style: 'grid' | 'list' | 'masonry';
  border_radius: string;
  show_logo: boolean;
  show_search: boolean;
  show_categories: boolean;
  hero_title?: string;
  hero_subtitle?: string;
  hero_image_url?: string;
  hero_button_text: string;
  custom_css?: string;
}

export const defaultTheme: StoreTheme = {
  primary_color: '#2563eb',
  secondary_color: '#10b981',
  accent_color: '#f59e0b',
  background_color: '#ffffff',
  text_color: '#1f2937',
  font_heading: 'Inter',
  font_body: 'Inter',
  layout_style: 'modern',
  product_card_style: 'grid',
  border_radius: 'rounded-xl',
  show_logo: true,
  show_search: true,
  show_categories: true,
  hero_button_text: 'Belanja Sekarang',
};