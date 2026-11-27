import path from 'path';

// Absolute paths resolved at module load time — traced by outputFileTracingIncludes in next.config.ts
export const FONT_REGULAR: string = path.join(process.cwd(), 'src', 'lib', 'pdf', 'fonts', 'LiberationSans-Regular.ttf');
export const FONT_BOLD: string = path.join(process.cwd(), 'src', 'lib', 'pdf', 'fonts', 'LiberationSans-Bold.ttf');
