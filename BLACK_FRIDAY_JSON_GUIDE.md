# Black Friday 2025 - JSON Configuration Guide

## Overview
The Black Friday 2025 section is completely driven by JSON configuration files, making it easy to update content, deals, merchants, and ad scans without modifying code.

## JSON Configuration Files

### 1. `/src/assets/data/black-friday-config.json`
**Purpose**: Controls global Black Friday page settings, hero slides, and visual assets.

#### Structure:
```json
{
  "countdownDate": "2025-11-28T00:00:00",  // Black Friday date for countdown timer
  "pageTitle": "BLACK FRIDAY 2025",
  "pageSubtitle": "The Biggest Shopping Event of the Year",
  "sections": {
    "adScans": {
      "title": "Black Friday 2025 Ad Scans",
      "subtitle": "Browse official Black Friday ads from your favorite retailers",
      "icon": "bxs-book-content"  // Boxicons class name
    },
    "featured": {
      "title": "Featured Black Friday Deals",
      "icon": "bxs-star"
    },
    "allDeals": {
      "title": "All Black Friday Deals",
      "icon": "bx-grid-alt"
    }
  },
  "heroSlides": [
    {
      "type": "countdown",  // Special countdown slide
      "title": "BLACK FRIDAY 2025",
      "subtitle": "The Biggest Shopping Event of the Year"
    },
    {
      "type": "ad",  // Additional promotional slides
      "title": "Electronics Blowout",
      "subtitle": "Save Up to 70% on TVs, Laptops & More",
      "description": "Unbeatable deals on the latest tech from top brands",
      "image": "https://images.unsplash.com/...",  // Background image URL
      "buttonText": "Shop Electronics",
      "gradient": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
    }
  ],
  "backgroundImages": [
    "https://images.unsplash.com/...",  // Background images for ad scan cards
    // Add more as needed - will cycle through merchants
  ]
}
```

#### Key Features:
- **Countdown Timer**: Set `countdownDate` to control when Black Friday starts
- **Hero Carousel**: Add/remove slides dynamically
- **Section Titles**: Update all section headers in one place
- **Background Images**: Automatically assigned to ad scan cards in rotation

---

### 2. `/src/assets/data/black-friday-merchants.json`
**Purpose**: Contains all merchant data, deals, and ad scan pages.

#### Structure:
```json
[
  {
    "id": 1,  // Unique merchant ID (used in routing)
    "name": "Amazon",
    "logo": "https://logo.clearbit.com/amazon.com",  // Merchant logo URL
    "discount": "Up to 70% OFF",  // Display discount text
    "category": "Electronics",  // Used for filtering
    "deal": "Massive discounts on electronics, home goods, and more",
    "verified": true,  // Shows verification badge
    "featured": true,  // Appears in featured section
    "url": "https://amazon.com",  // External store link
    "adScans": [  // Array of ad scan page images
      "https://placehold.co/800x1000/FF9900/000000?text=Amazon+Page+1",
      "https://placehold.co/800x1000/FF9900/000000?text=Amazon+Page+2",
      // Add as many pages as needed
    ]
  }
]
```

#### Key Features:
- **Ad Scans**: Each merchant can have multiple ad scan pages (image URLs)
- **Categories**: Automatic category filtering on the main page
- **Featured Deals**: Set `featured: true` to highlight top merchants
- **Verification**: `verified: true` shows a verification badge

---

## How It Works

### Page Load Process:
1. **Component loads** `black-friday-config.json` and `black-friday-merchants.json`
2. **Assigns background images** from config to merchants in rotation
3. **Builds hero carousel** from `heroSlides` array
4. **Filters merchants** by category automatically
5. **Displays ad scans** for merchants with `adScans` array

### Ad Scans Section:
- Only shows merchants that have `adScans` array with at least 1 page
- Background image assigned automatically from `backgroundImages` pool
- Clicking a card navigates to `/black-friday/{merchantId}/ad-scans`
- Detail page shows carousel of all ad pages

### Hero Carousel:
- First slide is always countdown timer (type: "countdown")
- Additional slides can be promotional banners (type: "ad")
- Fully customizable images, gradients, and text

---

## Adding New Content

### Add a New Merchant:
1. Open `black-friday-merchants.json`
2. Add new object with incremented `id`
3. Include all required fields
4. Optionally add `adScans` array with page image URLs
5. Save file - changes appear immediately

### Add More Ad Scan Pages:
```json
{
  "id": 1,
  "name": "Amazon",
  ...
  "adScans": [
    "https://example.com/amazon-page-1.jpg",
    "https://example.com/amazon-page-2.jpg",
    "https://example.com/amazon-page-3.jpg",  // Add new page
    "https://example.com/amazon-page-4.jpg"   // Add another page
  ]
}
```

### Add Hero Slide:
```json
{
  "heroSlides": [
    { "type": "countdown", ... },  // Keep countdown
    {
      "type": "ad",
      "title": "New Promo",
      "subtitle": "Amazing Deals",
      "description": "Don't miss out",
      "image": "https://your-image-url.com/image.jpg",
      "buttonText": "Shop Now",
      "gradient": "linear-gradient(135deg, #your-colors)"
    }
  ]
}
```

### Update Section Titles:
```json
{
  "sections": {
    "adScans": {
      "title": "Your New Title",
      "subtitle": "Your new subtitle",
      "icon": "bx-your-icon-name"
    }
  }
}
```

---

## Image Guidelines

### Ad Scan Pages:
- **Recommended Size**: 800x1000px (portrait)
- **Format**: JPG or PNG
- **Hosting**: Use CDN or external image hosting
- **Example**: Unsplash, Cloudinary, or your own server

### Background Images (for cards):
- **Recommended Size**: 800x600px (landscape)
- **Format**: JPG or PNG optimized
- **Purpose**: Background for ad scan cards on main page

### Hero Slide Images:
- **Recommended Size**: 1200x600px (2:1 ratio)
- **Format**: JPG optimized for web
- **Purpose**: Full-width hero carousel backgrounds

---

## Tips & Best Practices

1. **Performance**: Use optimized images (< 200KB for backgrounds)
2. **Consistency**: Keep similar aspect ratios for ad scan pages
3. **Validation**: Ensure all URLs are accessible before adding
4. **Categories**: Use consistent category names for proper filtering
5. **IDs**: Always use unique sequential IDs for merchants
6. **Testing**: Test ad scan carousels with 1, 3, and 5+ pages

---

## Troubleshooting

### Ad Scans Not Showing:
- Check if `adScans` array exists and has at least 1 item
- Verify image URLs are accessible
- Ensure merchant `id` is unique

### Background Images Not Loading:
- Check `backgroundImages` array in config.json
- Verify URLs are valid and accessible
- Clear browser cache

### Countdown Timer Not Working:
- Verify `countdownDate` is in future
- Check date format: `YYYY-MM-DDTHH:mm:ss`
- Ensure browser is allowed to run scripts

---

## Example: Complete Merchant Entry

```json
{
  "id": 31,
  "name": "New Store",
  "logo": "https://logo.clearbit.com/newstore.com",
  "discount": "Up to 50% OFF",
  "category": "Electronics",
  "deal": "Black Friday deals on all tech products",
  "verified": true,
  "featured": false,
  "url": "https://newstore.com",
  "adScans": [
    "https://example.com/newstore-page-1.jpg",
    "https://example.com/newstore-page-2.jpg",
    "https://example.com/newstore-page-3.jpg"
  ]
}
```

---

## Support

For questions or issues with the JSON configuration:
1. Check JSON syntax with a validator (jsonlint.com)
2. Verify all required fields are present
3. Test changes in development environment first
4. Refer to existing entries as templates
