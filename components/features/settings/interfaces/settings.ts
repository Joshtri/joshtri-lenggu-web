// Base Settings Interface
export interface BaseSetting {
  id?: string;
  key: string;
  value: string;
  description?: string;
  category: string;
  isActive: boolean;
  createdAt?: string;
  updatedAt?: string;
}

// 1. Site Settings (General)
export interface SiteSettingsValue {
  siteName: string;
  siteDescription: string;
  siteUrl: string;
  logo?: string;
  favicon?: string;
  timezone: string;
  language: 'id' | 'en';
  dateFormat: 'DD/MM/YYYY' | 'MM/DD/YYYY';
}

// 2. Maintenance Mode Settings
export interface MaintenanceSettingsValue {
  maintenanceMode: boolean;
  maintenanceMessage: string;
  allowedIPs: string[];
}

// 3. Comment Settings
export interface CommentSettingsValue {
  commentsEnabled: boolean;
  allowGuestComments: boolean;
  requireEmailVerification: boolean;
  maxCommentLength: number;
  spamProtection: boolean;
}

// 4. Email Settings
export interface EmailSettingsValue {
  emailNotifications: boolean;
  notifyOnNewComment: boolean;
  notifyOnNewPost: boolean;
  contactEmail: string;
  smtpConfig?: {
    host: string;
    port: number;
    secure: boolean;
    username: string;
    password: string;
  };
}

// 5. Content Settings
export interface ContentSettingsValue {
  postsPerPage: number;
  showFeaturedImage: boolean;
  showAuthorInfo: boolean;
  showPublishDate: boolean;
  showReadingTime: boolean;
}

// 6. Social Media Settings
export interface SocialMediaSettingsValue {
  facebook?: string;
  twitter?: string;
  instagram?: string;
  github?: string;
  linkedin?: string;
  socialSharing: boolean;
}

// Setting Keys Constants
export const SETTING_KEYS = {
  SITE: 'site_settings',
  MAINTENANCE: 'maintenance_settings',
  COMMENTS: 'comment_settings',
  EMAIL: 'email_settings',
  CONTENT: 'content_settings',
  SOCIAL_MEDIA: 'social_media_settings',
} as const;

// Setting Categories
export const SETTING_CATEGORIES = {
  GENERAL: 'general',
  SYSTEM: 'system',
  FEATURES: 'features',
  COMMUNICATION: 'communication',
  CONTENT: 'content',
  SOCIAL: 'social',
} as const;

// Default Values
export const DEFAULT_SITE_SETTINGS: SiteSettingsValue = {
  siteName: 'My Blog',
  siteDescription: 'A blog about technology and life',
  siteUrl: 'https://myblog.com',
  logo: '',
  favicon: '',
  timezone: 'Asia/Jakarta',
  language: 'id',
  dateFormat: 'DD/MM/YYYY',
};

export const DEFAULT_MAINTENANCE_SETTINGS: MaintenanceSettingsValue = {
  maintenanceMode: false,
  maintenanceMessage: "We're upgrading our systems. Please check back soon!",
  allowedIPs: [],
};

export const DEFAULT_COMMENT_SETTINGS: CommentSettingsValue = {
  commentsEnabled: true,
  allowGuestComments: false,
  requireEmailVerification: true,
  maxCommentLength: 500,
  spamProtection: true,
};

export const DEFAULT_EMAIL_SETTINGS: EmailSettingsValue = {
  emailNotifications: true,
  notifyOnNewComment: true,
  notifyOnNewPost: false,
  contactEmail: 'admin@blog.com',
};

export const DEFAULT_CONTENT_SETTINGS: ContentSettingsValue = {
  postsPerPage: 10,
  showFeaturedImage: true,
  showAuthorInfo: true,
  showPublishDate: true,
  showReadingTime: true,
};

export const DEFAULT_SOCIAL_MEDIA_SETTINGS: SocialMediaSettingsValue = {
  facebook: '',
  twitter: '',
  instagram: '',
  github: '',
  linkedin: '',
  socialSharing: true,
};
