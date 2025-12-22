"use client";

import { User, ShoppingBag, FileText, Calendar} from "lucide-react";

const Templates = [
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
      { keyName: "image", type: "image_url" },
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
  }
];

interface GalleryProps {
    onSelect: (schema: any[]) => void;
}

export default function TemplateGallery({onSelect}: GalleryProps ) {
    return (
        <div className="mt-16 mb-12">
            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-6 text-center">Choose a template and start editing</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                hello
            </div>
        </div>
    )
}