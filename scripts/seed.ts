import { Product } from "../src/models/Product";
import { Category } from "../src/models/Category";
import { connectDB } from "../src/lib/db";

async function seedDatabase() {
  try {
    await connectDB();
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await Product.deleteMany({});
    await Category.deleteMany({});

    // Create categories
    console.log("Creating categories...");
    const categories = await Category.insertMany([
      {
        name: "Foundation & Concealer",
        slug: "foundation-concealer",
        description: "Premium foundations and concealers",
      },
      {
        name: "Lipsticks & Lip Gloss",
        slug: "lipsticks-lip-gloss",
        description: "Beautiful lipsticks and glosses",
      },
      {
        name: "Eye Makeup",
        slug: "eye-makeup",
        description: "Eyeshadows, eyeliners, and mascara",
      },
      {
        name: "Face Powders",
        slug: "face-powders",
        description: "Setting powders and bronzers",
      },
      {
        name: "Skincare",
        slug: "skincare",
        description: "Skincare products and serums",
      },
    ]);

    console.log(
      "Created categories:",
      categories.map((c) => c.name),
    );

    // Create products
    console.log("Creating products...");
    const products = await Product.insertMany([
      {
        name: "Radiant Beauty Foundation",
        description:
          "Smooth, long-lasting foundation with natural finish. Provides full coverage and blends seamlessly for a flawless complexion.",
        price: 1500,
        discountPrice: 1200,
        category: categories[0]._id,
        stock: 50,
        images: [
          "https://via.placeholder.com/300x300?text=Foundation",
          "https://via.placeholder.com/300x300?text=Foundation+2",
        ],
        rating: 4.8,
        reviews: 128,
        tags: ["foundation", "makeup", "bestseller"],
      },
      {
        name: "Velvet Matte Lipstick",
        description:
          "Rich, velvety texture with intense color payoff. Long-wearing formula that stays put for 12+ hours.",
        price: 800,
        discountPrice: 600,
        category: categories[1]._id,
        stock: 120,
        images: [
          "https://via.placeholder.com/300x300?text=Lipstick",
          "https://via.placeholder.com/300x300?text=Lipstick+2",
        ],
        rating: 4.9,
        reviews: 256,
        tags: ["lipstick", "matte", "bestseller"],
      },
      {
        name: "Shimmer Eye Shadow Palette",
        description:
          "Professional 12-color eyeshadow palette with smooth, blendable shimmers and mattes. Perfect for any occasion.",
        price: 2000,
        discountPrice: 1500,
        category: categories[2]._id,
        stock: 75,
        images: ["https://via.placeholder.com/300x300?text=Eyeshadow+Palette"],
        rating: 4.7,
        reviews: 189,
        tags: ["eyeshadow", "palette", "professional"],
      },
      {
        name: "Luminous Powder Bronzer",
        description:
          "Creates a beautiful sun-kissed glow. Non-comedogenic formula that works on all skin tones.",
        price: 1200,
        discountPrice: 900,
        category: categories[3]._id,
        stock: 60,
        images: ["https://via.placeholder.com/300x300?text=Bronzer"],
        rating: 4.6,
        reviews: 95,
        tags: ["bronzer", "powder", "glow"],
      },
      {
        name: "Hydrating Clay Mask",
        description:
          "Detoxifying clay mask that purifies pores while maintaining skin hydration. Suitable for all skin types.",
        price: 950,
        category: categories[4]._id,
        stock: 100,
        images: ["https://via.placeholder.com/300x300?text=Clay+Mask"],
        rating: 4.5,
        reviews: 142,
        tags: ["skincare", "mask", "hydrating"],
      },
      {
        name: "Perfect Concealer Stick",
        description:
          "Full-coverage concealer in a convenient stick form. Blends smoothly and provides 16-hour wear.",
        price: 700,
        discountPrice: 550,
        category: categories[0]._id,
        stock: 90,
        images: ["https://via.placeholder.com/300x300?text=Concealer"],
        rating: 4.7,
        reviews: 167,
        tags: ["concealer", "coverage", "long-wear"],
      },
      {
        name: "Glossy Lip Plumper",
        description:
          "Adds volume and shine with a refreshing minty sensation. Contains nourishing oils for healthy lips.",
        price: 600,
        category: categories[1]._id,
        stock: 150,
        images: ["https://via.placeholder.com/300x300?text=Lip+Gloss"],
        rating: 4.4,
        reviews: 113,
        tags: ["lip-gloss", "plumper", "glossy"],
      },
      {
        name: "Ultra Black Mascara",
        description:
          "Volumizing mascara with a precision brush. Defines and separates lashes for dramatic eye effect.",
        price: 850,
        discountPrice: 680,
        category: categories[2]._id,
        stock: 110,
        images: ["https://via.placeholder.com/300x300?text=Mascara"],
        rating: 4.8,
        reviews: 201,
        tags: ["mascara", "volumizing", "black"],
      },
      {
        name: "Poreless Setting Powder",
        description:
          "Lightweight, translucent powder that sets makeup and minimizes pore appearance. Fade-resistant.",
        price: 700,
        category: categories[3]._id,
        stock: 140,
        images: ["https://via.placeholder.com/300x300?text=Setting+Powder"],
        rating: 4.6,
        reviews: 124,
        tags: ["powder", "setting", "poreless"],
      },
      {
        name: "Vitamin C Brightening Serum",
        description:
          "Antioxidant-rich serum that brightens and evens skin tone. Absorbs quickly without leaving residue.",
        price: 1800,
        discountPrice: 1400,
        category: categories[4]._id,
        stock: 75,
        images: ["https://via.placeholder.com/300x300?text=Serum"],
        rating: 4.9,
        reviews: 234,
        tags: ["serum", "vitamin-c", "brightening"],
      },
    ]);

    console.log("Created", products.length, "products");
    console.log("\n✅ Database seeded successfully!");
    console.log(`Created ${categories.length} categories`);
    console.log(`Created ${products.length} products`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1);
  }
}

seedDatabase();
