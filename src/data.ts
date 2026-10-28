import type { IconName } from "@/components/icons";

const img = (id: string, w = 800) => `https://images.unsplash.com/photo-${id}?w=${w}&q=75&auto=format&fit=crop`;

export type CategoryId = "snacks" | "meal" | "vegan" | "dessert" | "drinks";

export const categories: { id: CategoryId; label: string; icon: IconName }[] = [
  { id: "snacks", label: "Snacks", icon: "snacks" },
  { id: "meal", label: "Meal", icon: "meal" },
  { id: "vegan", label: "Vegan", icon: "vegan" },
  { id: "dessert", label: "Dessert", icon: "dessert" },
  { id: "drinks", label: "Drinks", icon: "drinks" },
];

export type AddOn = { id: string; name: string; price: number };

export type Dish = {
  id: string;
  name: string;
  category: CategoryId;
  price: number;
  rating: number;
  blurb: string;
  description: string;
  image: string;
  tags: string[];
  addOnsTitle: string;
  addOns: AddOn[];
};

const d = (
  id: string,
  name: string,
  category: CategoryId,
  price: number,
  rating: number,
  blurb: string,
  description: string,
  photo: string,
  tags: string[],
  addOns: [string, number][],
  addOnsTitle = "Add on ingredients",
): Dish => ({
  id,
  name,
  category,
  price,
  rating,
  blurb,
  description,
  image: img(photo),
  tags,
  addOnsTitle,
  addOns: addOns.map(([n, p], i) => ({ id: `${id}-${i}`, name: n, price: p })),
});

export const dishes: Dish[] = [
  d("nachos", "Mexican Appetizer", "snacks", 15, 5.0, "Tortilla chips with toppings", "Crisp corn tortilla chips under melted cheddar, pico de gallo, pickled jalapeños and a drizzle of lime crema.", "1513456852971-30c0b8199d4d", ["Mexican", "Appetizer"], [["Guacamole", 2.99], ["Jalapeños", 1.99], ["Ground beef", 3.99], ["Pico de gallo", 2.99]], "Toppings"),
  d("skewers", "Pork Skewers", "snacks", 12.99, 4.0, "Marinated, grilled, zesty dip", "Pork shoulder marinated in garlic, paprika and herbs, grilled over open flame and served with a zesty dipping sauce.", "1555939594-58d7cb561ad1", ["Skewers", "Baked"], [["Extra skewer", 4.5], ["Chimichurri", 1.5], ["Grilled peppers", 2.0]]),
  d("wraps", "Chicken Wraps", "snacks", 10.5, 4.6, "Slaw, herbs and lime", "Charred chicken thigh, red cabbage slaw and fresh coriander rolled in a warm flour tortilla.", "1626700051175-6818013e1d4f", ["Wings", "Spring Rolls"], [["Extra chicken", 3.0], ["Avocado", 2.0], ["Hot sauce", 0.5]]),
  d("dumplings", "Steamed Dumplings", "snacks", 9.99, 4.8, "Eight pieces, chili oil", "Hand-folded pork and chive dumplings, steamed to order with black vinegar and house chili oil.", "1534422298391-e4f8c172dddb", ["Bruschetta", "Crepes"], [["Four more pieces", 4.0], ["Extra chili oil", 0.75]]),
  d("meatballs", "Herb Meatballs", "snacks", 11.0, 4.3, "Rocket and red pepper sauce", "Beef and lamb meatballs with parsley and cumin, on peppery rocket with roasted red pepper sauce.", "1529042410759-befb1204b468", ["Appetizer", "Baked"], [["Feta", 1.5], ["Flatbread", 2.0]]),

  d("curry", "Chicken Curry", "meal", 50, 5.0, "Slow-cooked, served with naan", "Chicken thighs braised in a tomato, cashew and garam masala gravy. Served with basmati rice and garlic naan for two.", "1565557623262-b51c2513a641", ["Curry", "Chicken"], [["Extra naan", 3.0], ["Raita", 2.0], ["Mango chutney", 1.5]]),
  d("sushi", "Sushi Wave", "meal", 103, 4.9, "Chef's 24-piece platter", "Salmon, tuna and yellowtail nigiri with dragon and spicy salmon rolls. Feeds three to four.", "1579871494447-9811cf80d66c", ["Sushi"], [["Miso soup", 3.5], ["Seaweed salad", 4.0], ["Extra wasabi", 0.5]]),
  d("burger", "Chicken Burger", "meal", 12.99, 4.4, "Grilled chicken, toasted bun", "Tender grilled chicken breast, crisp lettuce, ripe tomato and creamy mayo, nestled in a soft toasted brioche bun.", "1568901346375-23c9450c58cd", ["Burger", "Chicken"], [["Vegan mayo", 2.0], ["Sliced tomatoes", 1.99], ["Whole wheat bun", 2.0], ["Bell peppers", 1.25]]),
  d("ceviche", "Fresh Prawn Ceviche", "meal", 15, 4.7, "Lime-cured prawns, red onion", "Shrimp marinated in zesty lime juice, mixed with crisp onions, tomatoes and coriander.", "1565680018434-b513d5e5fd47", ["Fresh Prawn", "Ceviche"], [["Shrimp", 2.99], ["Crisp onion", 3.99], ["Sweet corn", 2.99], ["Pico de gallo", 2.99]]),
  d("pasta", "Shrimp Spaghetti", "meal", 18.5, 4.6, "Garlic, chili, cherry tomato", "Spaghetti tossed with tiger prawns, garlic, chili flakes and blistered cherry tomatoes.", "1563379926898-05f4575a45d8", ["Pad Thai", "Fresh Prawn"], [["Extra prawns", 5.0], ["Parmesan", 1.5]]),
  d("ribs", "Smoked BBQ Ribs", "meal", 24, 4.5, "Twelve-hour smoke", "Pork ribs dry-rubbed and smoked low for twelve hours, glazed with bourbon barbecue sauce.", "1544025162-d76694265947", ["Chicken", "Cheese"], [["Fries", 3.5], ["Coleslaw", 2.5], ["Extra sauce", 1.0]]),
  d("pizza", "Pepperoni Pizza", "meal", 16, 4.7, "Wood-fired, 12 inch", "San Marzano tomato, fior di latte and spicy pepperoni on a blistered wood-fired crust.", "1513104890138-7c749659a591", ["Pizza"], [["Extra cheese", 2.0], ["Hot honey", 1.5], ["Basil", 0.5]]),

  d("buddha", "Rainbow Buddha Bowl", "vegan", 13.5, 4.8, "Avocado, chickpeas, greens", "Roasted sweet potato, chickpeas, avocado, radish and leafy greens with a tahini-lemon dressing.", "1512621776951-a57141f2eefd", ["Salad", "Quinoa"], [["Quinoa", 2.0], ["Extra avocado", 2.5], ["Hummus", 1.5]]),
  d("risotto", "Mushroom Risotto", "vegan", 15, 5.0, "Arborio, wild mushrooms", "Creamy mushroom risotto cooked to order with arborio rice, wild mushrooms and white wine.", "1476124369491-e7addf5db371", ["Mushroom", "Risotto"], [["Truffle oil", 3.0], ["Roast garlic", 1.0]]),
  d("lasagna", "Broccoli Lasagna", "vegan", 12.99, 4.0, "Layered, baked, bubbling", "Tender broccoli florets and cashew ricotta layered with savory marinara and baked until golden.", "1574894709920-11b28e7367e3", ["Lasagna", "Broccoli"], [["Side salad", 3.0], ["Garlic bread", 2.5]]),
  d("tofu", "Crispy Tofu Bowl", "vegan", 11.5, 4.5, "Sesame tofu, pickled veg", "Crispy sesame tofu with brown rice, edamame, pickled carrot and a sweet soy glaze.", "1546069901-ba9599a7e63c", ["Bean Burger", "Hummus"], [["Extra tofu", 2.5], ["Kimchi", 1.5]]),
  d("veggiepizza", "Garden Pizza", "vegan", 14, 4.4, "Peppers, onion, olive", "Roasted peppers, red onion, olives and oregano on our wood-fired crust with vegan mozzarella.", "1565299624946-b28f40a0ae38", ["Pizza"], [["Jalapeños", 1.0], ["Vegan cheese", 2.0]]),

  d("brownie", "Chocolate Brownie", "dessert", 15, 5.0, "Fudgy, crackly top", "Premium cocoa and melted dark chocolate with a hint of vanilla, baked for a fudgy center and crisp, crackly top.", "1606313564200-e75d5e30476c", ["Brownie", "Chocolate"], [["Vanilla ice cream", 3.0], ["Salted caramel", 1.5]]),
  d("macarons", "Macarons", "dessert", 12.99, 4.0, "Box of eight", "Delicate vanilla, raspberry and pistachio macarons with a crisp outer shell and a soft, chewy center.", "1569864358642-9d1684040f43", ["Macarons"], [["Four more", 6.0]]),
  d("cheesecake", "Blueberry Cheesecake", "dessert", 22, 4.8, "New York style", "Dense, creamy baked cheesecake on a buttery biscuit base, topped with a glossy blueberry compote.", "1533134242443-d4fd215305ad", ["Cheesecake"], [["Sliced strawberries", 3.99], ["Whipped cream", 1.0], ["Lemon zest", 1.25]]),
  d("cupcake", "Vanilla Cupcake", "dessert", 8.2, 4.6, "Buttercream swirl", "Light vanilla sponge with a tall swirl of salted caramel buttercream.", "1576618148400-f54bed99fcfd", ["Cupcakes", "Cakes"], [["Sprinkles", 0.5], ["Extra frosting", 1.0]]),
  d("pannacotta", "Strawberry Panna Cotta", "dessert", 9.5, 4.7, "Vanilla bean, fresh berries", "Silky vanilla-bean panna cotta set in a jar, topped with macerated strawberries.", "1488477181946-6428a0291777", ["Flan", "Ice Cream"], [["Extra berries", 1.5]]),

  d("mojito", "Mojito", "drinks", 15, 5.0, "Mint, lime, soda", "White rum, fresh mint leaves, lime juice, simple syrup and a splash of soda water.", "1551538827-9c037cb4f32a", ["Mojito", "Cocktail"], [["Virgin", 0], ["Extra lime", 0.5]], "Choose your style"),
  d("icedcoffee", "Iced Coffee", "drinks", 12.99, 4.0, "Espresso over ice", "Espresso and chilled milk with a touch of sweetness, served over ice.", "1517701604599-bb29b565090c", ["Coffee"], [["Oat milk", 0.75], ["Extra shot", 1.0], ["Vanilla syrup", 0.5]]),
  d("icedtea", "Fruit and Berry Tea", "drinks", 15, 4.6, "Brewed and chilled", "Black tea brewed with berries and citrus, chilled and served with fresh lime.", "1556679343-c7306c1976bc", ["Ice Tea", "Juice"], [["Green tea", 0], ["White tea", 0], ["Herbal infusion", 0.5]], "Choose your base tea"),
  d("shake", "Cookies & Cream Shake", "drinks", 20, 4.7, "Thick, with whipped cream", "Vanilla ice cream blended with crushed chocolate cookies, topped with whipped cream.", "1572490122747-3968b75cc699", ["Milkshake"], [["Extra cookies", 1.0], ["Chocolate drizzle", 0.75]]),
  d("latte", "Coffee Latte", "drinks", 8, 4.8, "Double shot, silky milk", "A double shot of espresso with steamed milk and a fine layer of microfoam.", "1495474472287-4d71bcdd2085", ["Coffee"], [["Oat milk", 0.75], ["Caramel", 0.5]]),
];

export const dishById = (id: string) => dishes.find((x) => x.id === id);

export const bestSellers = ["sushi", "curry", "lasagna", "cupcake"];
export const recommended = ["burger", "wraps", "brownie", "mojito"];

export const promos = [
  { id: "p1", line: "Experience our delicious new dish", headline: "30% OFF", image: img("1513104890138-7c749659a591", 600), dish: "pizza" },
  { id: "p2", line: "Fresh from the grill this week", headline: "2 for 1", image: img("1555939594-58d7cb561ad1", 600), dish: "skewers" },
  { id: "p3", line: "Sweet finish on every order", headline: "Free dessert", image: img("1606313564200-e75d5e30476c", 600), dish: "brownie" },
];

export const onboarding = [
  { title: "Order For Food", icon: "orderSwap" as IconName, body: "Browse dishes from kitchens near you and order in a few taps.", image: img("1565299624946-b28f40a0ae38", 1000) },
  { title: "Easy Payment", icon: "card" as IconName, body: "Pay by card, Apple Pay, PayPal or Google Pay. Save your favorite for one-tap checkout.", image: img("1563805042-7684c019e1cb", 1000) },
  { title: "Fast Delivery", icon: "delivery" as IconName, body: "Follow your order from the kitchen to your door, usually in under 30 minutes.", image: img("1509042239860-f550ce710b93", 1000) },
];

export type Address = { id: string; label: string; line: string };
export type Card = { id: string; kind: "card" | "apple" | "paypal" | "google"; label: string; last4?: string; holder?: string; expiry?: string };

export const initialAddresses: Address[] = [
  { id: "a1", label: "My home", line: "778 Locust View Drive, Oakland, CA" },
  { id: "a2", label: "My office", line: "1200 Broadway, Oakland, CA" },
  { id: "a3", label: "Parent's house", line: "42 Lakeshore Avenue, Oakland, CA" },
];

export const initialCards: Card[] = [
  { id: "c1", kind: "card", label: "Credit card", last4: "4343", holder: "John Smith", expiry: "04/28" },
  { id: "c2", kind: "apple", label: "Apple Pay" },
  { id: "c3", kind: "paypal", label: "PayPal" },
  { id: "c4", kind: "google", label: "Google Pay" },
];

export const cancelReasons = [
  "I ordered by mistake",
  "Delivery is taking too long",
  "I want to change my order",
  "Found a better price elsewhere",
  "My plans changed",
];

export const faqTopics = ["General", "Account", "Services"] as const;

export const faqs: { topic: (typeof faqTopics)[number]; q: string; a: string }[] = [
  { topic: "General", q: "How long does delivery take?", a: "Most orders arrive in 25–35 minutes. You can follow every step from the order screen once the kitchen accepts it." },
  { topic: "General", q: "Is there a minimum order?", a: "No minimum. A flat $3.00 delivery fee applies to every order, plus tax and service fees shown at checkout." },
  { topic: "General", q: "Can I schedule an order for later?", a: "Not yet. Orders are prepared as soon as they are placed." },
  { topic: "Account", q: "How do I change my password?", a: "Go to Settings, then Password Setting. Enter your current password and choose a new one." },
  { topic: "Account", q: "Can I delete my account?", a: "Yes. Settings, then Delete Account. Your order history is removed within 30 days." },
  { topic: "Services", q: "Can I cancel an order?", a: "You can cancel any active order before the restaurant starts preparing it, from My Orders." },
  { topic: "Services", q: "What if something is missing?", a: "Contact customer service from the Support tab and we will refund the missing item." },
];

export const contacts: { label: string; icon: IconName; detail: string; url: string }[] = [
  { label: "Customer service", icon: "headset", detail: "+1 (510) 555-0134", url: "tel:+15105550134" },
  { label: "Website", icon: "globe", detail: "yumquick.app", url: "https://yumquick.app" },
  { label: "WhatsApp", icon: "whatsapp", detail: "+1 (510) 555-0134", url: "https://wa.me/15105550134" },
  { label: "Facebook", icon: "facebook", detail: "@yumquick", url: "https://facebook.com/yumquick" },
  { label: "Instagram", icon: "instagram", detail: "@yumquick", url: "https://instagram.com/yumquick" },
];

export const DELIVERY_FEE = 3;
export const TAX_RATE = 0.0625;
