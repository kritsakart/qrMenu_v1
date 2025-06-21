# QR Menu Builder - FoodList.pro

A modern QR code menu system for restaurants and cafes, built with React, TypeScript, and Supabase.

## 🌐 Live Demo

**Production**: [https://foodlist.pro](https://foodlist.pro)

## 🚀 Features

- **Digital Menu Management**: Create and manage restaurant menus with categories and items
- **QR Code Integration**: Generate QR codes for tables that link directly to menus
- **Real-time Updates**: Menu changes sync instantly across all devices
- **Product Variants**: Support for different sizes, options, and pricing
- **Drag & Drop Ordering**: Intuitive menu item reordering
- **Multi-language Support**: Currently supports English interface
- **Responsive Design**: Works perfectly on mobile, tablet, and desktop
- **Admin Dashboard**: Complete management interface for restaurant owners
- **Food List Cart**: Modern shopping cart experience (no checkout/payment)
- **Optimized URLs**: Short, user-friendly menu URLs for better QR code scanning

## 🛠️ Tech Stack

- **Frontend**: React 18 + TypeScript + Vite
- **Styling**: Tailwind CSS + shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Deployment**: Vercel
- **Domain**: foodlist.pro

## 📱 Usage

### For Restaurant Owners:
1. Visit [https://foodlist.pro/login](https://foodlist.pro/login)
2. Create an account or sign in
3. Add your restaurant locations and tables
4. Create menu categories and items
5. Generate QR codes for your tables

### For Customers:
1. Scan the QR code at your table
2. Browse the digital menu
3. Add items to your food list
4. View your selections and total

## 🏗️ Local Development

1. Clone the repository:
```bash
git clone https://github.com/kritsakart/qrMenu_v1.git
cd qrMenu_v1
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# Create .env.local file
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_APP_URL=http://localhost:3000
```

4. Start development server:
```bash
npm run dev
```

## 🗄️ Database Schema

The application uses Supabase with the following main tables:
- `cafe_owners` - Restaurant owner accounts
- `locations` - Restaurant locations with short_id for URL optimization
- `tables` - Individual tables per location with short_id for URL optimization
- `menu_categories` - Menu categories
- `menu_items` - Menu items with variants support

### URL Optimization
The system uses short IDs to create user-friendly URLs:
- **Before**: `/menu/eccc29e2-c1e8-421a-bbc8-76bca73cb16f/ec076832-3327-4bc6-8fa2-8716537f8c60` (80+ characters)
- **After**: `/menu/a1b2c3d4/x9y8z7` (~20 characters)

To apply URL optimization to existing data, run the `update_short_ids.sql` script in your database.

## 🚀 Deployment

The application is automatically deployed to Vercel when changes are pushed to the main branch.

**Production URL**: https://foodlist.pro

## 📋 Environment Variables

Required environment variables for production:
- `VITE_SUPABASE_URL` - Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `VITE_APP_URL` - Your production domain (https://foodlist.pro)

## 🔧 Configuration

### Supabase Setup:
1. Create a new Supabase project
2. Run the database migrations from `/supabase/migrations/`
3. Configure authentication URLs in Supabase Dashboard
4. Enable real-time subscriptions for `menu_items` table

### Domain Configuration:
- Primary domain: `foodlist.pro`
- WWW redirect: `www.foodlist.pro` → `foodlist.pro`
- SSL/TLS: Automatic via Vercel

## 📄 License

This project is licensed under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📞 Support

For support or questions, please contact [your-email@domain.com]

---

Built with ❤️ for the restaurant industry
