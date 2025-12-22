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