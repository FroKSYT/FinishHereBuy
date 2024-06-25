const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");

const port = 4000;

// CORS middleware
const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001'], // Allow requests only from these domains
  methods: ['GET', 'POST'],
  credentials: true // Allow passing cookies and other authorization data
};

app.use(cors(corsOptions));
app.use(express.json());

mongoose.connect("mongodb+srv://froks:Q3t6x2v0bt@cluster0.xln4sbz.mongodb.net/HereBuy", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB connection error:", err));

// Image Storage Engine
const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
});
const upload = multer({ storage: storage });
app.post("/upload", upload.single('product'), (req, res) => {
  res.json({
    success: 1,
    image_url: `http://localhost:4000/images/${req.file.filename}`
  });
});
app.use('/images', express.static('upload/images'));

// Middleware для перевірки токену
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");

  if (!token) {
    return res.status(401).json({ success: false, message: "Access denied. Token not provided." });
  }

  try {
    const decoded = jwt.verify(token.replace("Bearer ", ""), "secret_ecom");
    req.user = decoded.user;
    next();
  } catch (error) {
    console.error("Token verification error:", error);
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

// Схема для створення моделі користувача
const User = mongoose.model("User", {
  name: { type: String },
  email: { type: String, unique: true },
  password: { type: String },
  role: { type: String, enum: ['user', 'seller'], default: 'user' },
  cartData: { type: Object },
  date: { type: Date, default: Date.now }
});

const ProductSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true }, // Додаємо поле id
  name: { type: String, required: true },
  image: { type: String, required: true },
  category: { type: String, required: true },
  genre: { type: String, required: true },
  new_price: { type: Number, required: true },
  old_price: { type: Number, required: true },
  sellerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  sellerName: { type: String },
  date: { type: Date, default: Date.now },
  available: { type: Boolean, default: true }
});


const Product = mongoose.model("Product", ProductSchema);

// Маршрут для отримання продуктів, доданих авторизованим продавцем
app.get("/seller-products", verifyToken, async (req, res) => {
  try {
    const products = await Product.find({ sellerId: req.user.id });
    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching seller products:", error);
    res.status(500).json({ success: false, message: "Error fetching seller products" });
  }
});

// Маршрут для отримання всіх продуктів
app.get("/allproducts", async (req, res) => {
  try {
    const { genre } = req.query;
    let products;

    if (genre) {
      products = await Product.find({ genre });
    } else {
      products = await Product.find({});
    }

    res.json(products);
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

app.get('/genres', async (req, res) => {
  try {
    const genres = await Product.distinct('genre');
    res.json({ success: true, genres });
  } catch (error) {
    console.error("Error fetching genres:", error);
    res.status(500).json({ success: false, message: "Error fetching genres" });
  }
});



app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || password !== user.password) {
      return res.status(400).json({ success: false, message: "Invalid credentials" });
    }
    const token = jwt.sign({ user: { id: user.id, role: user.role } }, 'secret_ecom'); // Додаємо роль в токен
    res.json({ success: true, token, role: user.role }); // Повертаємо роль разом з токеном
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});


app.post('/signup', async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ success: false, message: "Please provide username, email, and password" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists with this email" });
    }

    const newUser = new User({
      name: username,
      email,
      password,
      role: role || 'user',
      cartData: {},
    });

    await newUser.save();

    const token = jwt.sign({ user: { id: newUser.id, role: newUser.role } }, 'secret_ecom');

    res.json({ success: true, token, role: newUser.role }); // Повертаємо роль разом з токеном
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

let currentId = 1; // Початкове значення для id

// Функція для знаходження наступного доступного id
const findNextAvailableId = async () => {
  let idFound = false;
  let nextId = currentId;
  while (!idFound) {
    const existingProduct = await Product.findOne({ id: nextId });
    if (!existingProduct) {
      idFound = true;
    } else {
      nextId++;
    }
  }
  return nextId;
};

app.post("/addproduct", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const { name, image, category, new_price, old_price, genre } = req.body;

    if (!genre) {
      return res.status(400).json({ success: false, message: "Genre is required" });
    }

    // Знаходимо наступний доступний id
    const nextAvailableId = await findNextAvailableId();

    const product = new Product({
      id: nextAvailableId, // Використовуємо знайдений наступний доступний id
      name,
      image,
      category,
      genre,
      new_price,
      old_price,
      sellerId: req.user.id,
      sellerName: user.name,
    });

    const savedProduct = await product.save();

    console.log("Product saved successfully:", savedProduct);
    res.json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Error saving product:", error);
    res.status(500).json({ success: false, message: "Error saving product" });
  }
});


// Маршрут для видалення продукту
app.post("/removeproduct", verifyToken, async (req, res) => {
  try {
    const { id } = req.body; // Отримання _id з тіла запиту
    const product = await Product.findOneAndDelete({ _id: id }); // Використовуємо _id
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.log("Product removed successfully");
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error removing product:", error);
    res.status(500).json({ success: false, message: "Error removing product" });
  }
});


// Маршрут для отримання популярних продуктів
app.get("/popular", async (req, res) => {
  try {
    const products = await Product.find({}).limit(4).sort({ date: -1 });
    res.json(products);
  } catch (error) {
    console.error("Error fetching popular products:", error);
    res.status(500).json({ success: false, message: "Error fetching popular products" });
  }
});

// Маршрут для отримання кошика користувача
app.post('/getcart', verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    res.json({ success: true, cartData: user.cartData });
  } catch (error) {
    console.error("Error fetching user cart:", error);
    res.status(500).json({ success: false, message: "Error fetching user cart" });
  }
});

// Маршрут для додавання продукту в кошик користувача
app.post('/addtocart', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    user.cartData[itemId] = (user.cartData[itemId] || 0) + 1;
    await user.save();
    res.send("Item added to cart");
  } catch (error) {
    console.error("Error adding item to cart:", error);
    res.status(500).json({ success: false, message: "Error adding item to cart" });
  }
});

// Маршрут для видалення продукту з кошика користувача
app.post('/removefromcart', verifyToken, async (req, res) => {
  try {
    const { itemId } = req.body;
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    if (user.cartData[itemId] && user.cartData[itemId] > 0) {
      user.cartData[itemId] -= 1;
      await user.save();
    }
    res.send("Item removed from cart");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    res.status(500).json({ success: false, message: "Error removing item from cart" });
  }
});

app.post('/checkout', verifyToken, async (req, res) => {
  try {
    const { userId, totalAmount } = req.body; // Отримання інформації з тіла запиту

    // Тут ви можете імітувати оплату, наприклад, просто чекаємо певний час
    await new Promise(resolve => setTimeout(resolve, 3000)); // Затримка 3 секунди для імітації оплати

    // Після успішної оплати, можна оновити статус оплати в базі даних або зробити інше необхідне
    // В даному випадку просто надішліть повідомлення про успішну оплату
    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, message: "Error processing payment" });
  }
});

const nodemailer = require("nodemailer");
const mailgunTransport = require("nodemailer-mailgun-transport");

// Конфігурація Mailgun
const auth = {
  auth: {
    api_key: "d70ed03c20588bb82098a344ea4f2975-51356527-6b6468f8",  // API-ключ Mailgun
    domain: "sandbox73e71fd364c04744b67ca87a4fe1fc54.mailgun.org"    // Домен Mailgun
  }
};

// Створення транспортера для відправки електронної пошти
const transporter = nodemailer.createTransport(mailgunTransport(auth));

module.exports = transporter;


app.post('/checkout', verifyToken, async (req, res) => {
  try {
    // Отримання необхідних даних з тіла запиту
    const { userId, totalAmount } = req.body;

    // Імітація оплати (можливо, затримка на 3 секунди)
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Отримання інформації про користувача, наприклад, його email
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Надсилання електронного листа
    const mailOptions = {
      from: 'your_email@gmail.com',
      to: user.email,
      subject: 'Payment Confirmation',
      text: `Dear ${user.name},\n\nYour payment of ${totalAmount} has been successfully processed.\n\nThank you for shopping with us!`
    };

    await transporter.sendMail(mailOptions);

    // Відповідь про успішну оплату
    res.json({ success: true, message: "Payment successful" });
  } catch (error) {
    console.error("Error processing payment:", error);
    res.status(500).json({ success: false, message: "Error processing payment" });
  }
});
const router = express.Router();

// Маршрут для отримання всіх продуктів
app.get("/admin/allproducts", async (req, res) => {
  try {
    const { genre } = req.query;
    let products;

    if (genre) {
      products = await Product.find({ genre });
    } else {
      products = await Product.find({});
    }

    if (!products) {
      return res.status(404).json({ success: false, message: "Products not found" });
    }

    res.json({ success: true, products });
  } catch (error) {
    console.error("Error fetching all products:", error);
    res.status(500).json({ success: false, message: "Error fetching products" });
  }
});

module.exports = router;
const bodyParser = require('body-parser');
// Middleware для обробки JSON-даних
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Функція для знаходження наступного доступного id для адміністратора
const findNextAvailableAdminId = async () => {
  try {
    let idFound = false;
    let nextId = 1; // Початкове значення для id

    while (!idFound) {
      const existingProduct = await Product.findOne({ id: nextId });
      if (!existingProduct) {
        idFound = true;
      } else {
        nextId++;
      }
    }

    return nextId;
  } catch (error) {
    console.error("Error finding next available admin id:", error);
    throw new Error("Failed to find next available admin id");
  }
};

// Маршрут для додавання продукту для адміністраторів
app.post("/admin/addproduct", async (req, res) => {
  try {
    const { name, image, category, new_price, old_price, genre } = req.body;

    // Перевірка обов'язкових полів
    if (!name || !genre || !category || !new_price || !old_price) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Знаходимо наступний доступний id для адміна
    const nextAvailableAdminId = await findNextAvailableAdminId();

    const product = new Product({
      id: nextAvailableAdminId,
      name,
      image,
      category,
      genre,
      new_price,
      old_price,
    });

    const savedProduct = await product.save();

    console.log("Product saved successfully by admin:", savedProduct);
    res.json({ success: true, product: savedProduct });
  } catch (error) {
    console.error("Error saving product by admin:", error);
    res.status(500).json({ success: false, message: "Error saving product by admin" });
  }
});


// Маршрут для видалення продукту для адміністраторів
app.post("/admin/removeproduct", async (req, res) => {
  try {
    const { id } = req.body; // Отримання _id з тіла запиту
    const product = await Product.findOneAndDelete({ _id: id }); // Використовуємо _id
    if (!product) {
      return res.status(404).json({ success: false, message: "Product not found" });
    }
    console.log("Product removed successfully by admin");
    res.json({ success: true, product });
  } catch (error) {
    console.error("Error removing product by admin:", error);
    res.status(500).json({ success: false, message: "Error removing product by admin" });
  }
});

// Маршрут для отримання всіх користувачів для адміністраторів
app.get("/admin/users", async (req, res) => {
  try {
    const users = await User.find({});
    res.json({ success: true, users });
  } catch (error) {
    console.error("Error fetching users for admin:", error);
    res.status(500).json({ success: false, message: "Error fetching users for admin" });
  }
});

// Маршрут для оновлення інформації про користувача для адміністраторів
app.put("/admin/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, email, role } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { name, email, role },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error("Error updating user for admin:", error);
    res.status(500).json({ success: false, message: "Error updating user for admin" });
  }
});


// Старт сервера
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

