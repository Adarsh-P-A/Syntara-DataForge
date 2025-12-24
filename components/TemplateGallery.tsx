"use client";

import { 
  User, ShoppingBag, FileText, CreditCard, Building2, MapPin, 
  Truck, MessageCircle, Music, Video, Server, Smartphone, 
  Database, Code, Calendar, Gamepad2, HeartPulse, Shield 
} from "lucide-react";

const Templates = [
    // --- SOCIAL & MEDIA ---
  {
    id: "comment",
    title: "Social Comment",
    description: "User engagement data for feeds.",
    icon: <MessageCircle className="w-6 h-6 text-indigo-500" />,
    schema: [
      { keyName: "comment_id", type: "uuid" },
      { keyName: "user_handle", type: "user_name" },
      { keyName: "text", type: "sentence" },
      { keyName: "likes", type: "integer", min: 0, max: 1000 },
      { keyName: "posted_at", type: "recent_date" }
    ]
  },
  {
    id: "music-track",
    title: "Music Track",
    description: "Metadata for streaming apps.",
    icon: <Music className="w-6 h-6 text-pink-500" />,
    schema: [
      { keyName: "track_title", type: "product_name" }, 
      { keyName: "artist", type: "name" },
      { keyName: "duration_sec", type: "integer", min: 120, max: 400 },
      { keyName: "genre", type: "word" },
      { keyName: "album_art", type: "image_url" }
    ]
  },
  {
    id: "video",
    title: "Video Metadata",
    description: "Youtube-like video details.",
    icon: <Video className="w-6 h-6 text-red-600" />,
    schema: [
      { keyName: "title", type: "sentence" },
      { keyName: "views", type: "integer", min: 100, max: 5000000 },
      { keyName: "thumbnail", type: "image_url" },
      { keyName: "upload_date", type: "past_date" },
      { keyName: "is_hd", type: "boolean" }
    ]
  },

  {
    id: "user-profile",
    title: "User Profile",
    description: "Standard user data for auth systems.",
    icon: <User className="w-6 h-6 text-blue-500" />,
    schema: [
      { keyName: "id", type: "uuid" },
      { keyName: "username", type: "user_name" },
      { keyName: "email", type: "email" },
      { keyName: "avatar", type: "avatar" },
      { keyName: "is_active", type: "boolean" }
    ]
  },
  {
    id: "ecommerce",
    title: "E-commerce Product",
    description: "Product details, pricing, and inventory.",
    icon: <ShoppingBag className="w-6 h-6 text-purple-500" />,
    schema: [
      { keyName: "product_id", type: "uuid" },
      { keyName: "name", type: "product_name" },
      { keyName: "price", type: "price", min: 10, max: 500 },
      { keyName: "category", type: "word" },
      { keyName: "in_stock", type: "boolean" }
    ]
  },
  {
    id: "blog-post",
    title: "Blog Post",
    description: "Content structure for CMS testing.",
    icon: <FileText className="w-6 h-6 text-green-500" />,
    schema: [
      { keyName: "title", type: "sentence" },
      { keyName: "slug", type: "slug" },
      { keyName: "content", type: "paragraph" },
      { keyName: "published_at", type: "recent_date" },
      { keyName: "author", type: "name" }
    ]
  },

  // --- BUSINESS & FINANCE ---
  {
    id: "invoice",
    title: "Invoice Data",
    description: "Billing details for fintech apps.",
    icon: <CreditCard className="w-6 h-6 text-emerald-600" />,
    schema: [
      { keyName: "invoice_no", type: "string", regex: "INV-[0-9]{6}" },
      { keyName: "amount", type: "price", min: 100, max: 5000 },
      { keyName: "currency", type: "word" },
      { keyName: "due_date", type: "future_date" },
      { keyName: "is_paid", type: "boolean" }
    ]
  },
  {
    id: "company",
    title: "Company Info",
    description: "B2B client or vendor profiles.",
    icon: <Building2 className="w-6 h-6 text-slate-500" />,
    schema: [
      { keyName: "company_name", type: "company_name" },
      { keyName: "catch_phrase", type: "sentence" },
      { keyName: "tax_id", type: "string", regex: "[0-9]{2}-[0-9]{7}" },
      { keyName: "website", type: "domain" },
      { keyName: "founded_date", type: "past_date" }
    ]
  },

  // --- LOCATION & LOGISTICS ---
  {
    id: "address",
    title: "Address Book",
    description: "Shipping or billing locations.",
    icon: <MapPin className="w-6 h-6 text-red-500" />,
    schema: [
      { keyName: "street", type: "street_address" },
      { keyName: "city", type: "city" },
      { keyName: "zip_code", type: "zip_code" },
      { keyName: "country", type: "country" },
      { keyName: "geo_lat", type: "float", min: -90, max: 90 }
    ]
  },
  {
    id: "delivery",
    title: "Delivery Tracking",
    description: "Logistics tracking updates.",
    icon: <Truck className="w-6 h-6 text-orange-500" />,
    schema: [
      { keyName: "tracking_id", type: "string", regex: "TRK-[A-Z0-9]{9}" },
      { keyName: "driver_name", type: "name" },
      { keyName: "current_location", type: "city" },
      { keyName: "estimated_arrival", type: "future_date" },
      { keyName: "status", type: "word" } // e.g., "In-Transit"
    ]
  },  

  // --- TECH & DEV ---
  {
    id: "api-log",
    title: "Server Log",
    description: "System access and error logs.",
    icon: <Server className="w-6 h-6 text-gray-700" />,
    schema: [
      { keyName: "request_id", type: "uuid" },
      { keyName: "ip_address", type: "ip" },
      { keyName: "method", type: "word" }, // GET, POST
      { keyName: "status_code", type: "integer", min: 200, max: 500 },
      { keyName: "timestamp", type: "recent_date" }
    ]
  },
  {
    id: "device",
    title: "IoT Device",
    description: "Smart home sensor readings.",
    icon: <Smartphone className="w-6 h-6 text-cyan-500" />,
    schema: [
      { keyName: "device_id", type: "mac_address" },
      { keyName: "temperature", type: "float", min: 15, max: 40 },
      { keyName: "humidity", type: "integer", min: 0, max: 100 },
      { keyName: "battery_level", type: "integer", min: 0, max: 100 },
      { keyName: "firmware", type: "string", regex: "v[1-9].[0-9]" }
    ]
  },
  {
    id: "software",
    title: "SaaS Subscription",
    description: "User plan and license info.",
    icon: <Database className="w-6 h-6 text-blue-400" />,
    schema: [
      { keyName: "license_key", type: "uuid" },
      { keyName: "plan_tier", type: "word" }, // "Pro", "Free"
      { keyName: "active_users", type: "integer", min: 1, max: 50 },
      { keyName: "expires_at", type: "future_date" },
      { keyName: "auto_renew", type: "boolean" }
    ]
  },
  {
    id: "developer",
    title: "Developer Profile",
    description: "Github-style user stats.",
    icon: <Code className="w-6 h-6 text-yellow-500" />,
    schema: [
      { keyName: "username", type: "user_name" },
      { keyName: "repo_count", type: "integer", min: 0, max: 200 },
      { keyName: "main_language", type: "word" },
      { keyName: "contributions", type: "integer", min: 0, max: 5000 },
      { keyName: "is_hirable", type: "boolean" }
    ]
  },

  // --- MISC ---
  {
    id: "events",
    title: "Calendar Event",
    description: "Schedules and meetings.",
    icon: <Calendar className="w-6 h-6 text-rose-500" />,
    schema: [
      { keyName: "event_title", type: "word" },
      { keyName: "start_time", type: "future_date" },
      { keyName: "duration_min", type: "integer", min: 30, max: 180 },
      { keyName: "location", type: "street_address" },
      { keyName: "is_virtual", type: "boolean" }
    ]
  },
  {
    id: "gaming",
    title: "RPG Character",
    description: "Game stats and inventory.",
    icon: <Gamepad2 className="w-6 h-6 text-purple-600" />,
    schema: [
      { keyName: "char_name", type: "first_name" },
      { keyName: "class", type: "word" },
      { keyName: "level", type: "integer", min: 1, max: 100 },
      { keyName: "gold", type: "integer", min: 0, max: 99999 },
      { keyName: "guild", type: "company_name" }
    ]
  },
  {
    id: "health",
    title: "Patient Record",
    description: "Medical data placeholders.",
    icon: <HeartPulse className="w-6 h-6 text-red-500" />,
    schema: [
      { keyName: "patient_id", type: "string", regex: "PAT-[0-9]{5}" },
      { keyName: "blood_type", type: "word" },
      { keyName: "weight_kg", type: "integer", min: 40, max: 120 },
      { keyName: "last_visit", type: "past_date" },
      { keyName: "insurance_provider", type: "company_name" }
    ]
  },
  {
    id: "security",
    title: "Auth Token",
    description: "Session and security tokens.",
    icon: <Shield className="w-6 h-6 text-emerald-500" />,
    schema: [
      { keyName: "access_token", type: "string", regex: "[a-zA-Z0-9]{64}" },
      { keyName: "refresh_token", type: "uuid" },
      { keyName: "scope", type: "word" },
      { keyName: "expires_in", type: "integer", min: 3600, max: 86400 },
      { keyName: "issued_at", type: "recent_date" }
    ]
  }
];

interface GalleryProps {
    onSelect: (schema: any[]) => void;
}

export default function TemplateGallery({onSelect}: GalleryProps ) {
    return (
        <div className="mt-16 mb-12">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Choose a template and start editing</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {Templates.map((template) =>(
                    <button
                        key={template.id}
                        onClick={() => onSelect(template.schema)}
                        className="group flex flex-col items-start p-6 hover:scale-105 cursor-pointer bg-white dark:bg-gray-800 border border-2 border-gray-400 dark:border-gray-700 rounded-xl hover:shadow-lg hover:blue-500 dark:hover:blue-500 transition-all text-left"
                    >
                        <div className="mb-4 p-3 bg-gray-50 dark-bg-gray-700 group-hover:scale-90 rounded-lg transition-transform">
                            {template.icon}
                        </div>
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">
                            {template.title}
                        </h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            {template.description}
                        </p>
                    </button>
                ))}
            </div>
        </div>
    )
}