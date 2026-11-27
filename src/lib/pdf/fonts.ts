import path from 'path';

// NotoSans from Google Fonts CDN — versioned URLs are permanent (v42 never removed).
// Vercel serverless functions have full outbound internet access to fonts.gstatic.com.
// Local fallback uses the LiberationSans TTF files committed in src/lib/pdf/fonts/.
const GOOGLE_FONT_REG = 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyD9A99d.ttf';
const GOOGLE_FONT_BOLD = 'https://fonts.gstatic.com/s/notosans/v42/o-0mIpQlx3QUlC5A4PNB6Ryti20_6n1iPHjcz6L1SoM-jCpoiyAaBN9d.ttf';
const LOCAL_FONT_REG = path.join(process.cwd(), 'src', 'lib', 'pdf', 'fonts', 'LiberationSans-Regular.ttf');
const LOCAL_FONT_BOLD = path.join(process.cwd(), 'src', 'lib', 'pdf', 'fonts', 'LiberationSans-Bold.ttf');

export const FONT_REGULAR: string = process.env.VERCEL ? GOOGLE_FONT_REG : LOCAL_FONT_REG;
export const FONT_BOLD: string = process.env.VERCEL ? GOOGLE_FONT_BOLD : LOCAL_FONT_BOLD;
