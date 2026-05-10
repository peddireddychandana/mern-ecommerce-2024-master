export const registerFormControls = [
  {
    name: "userName",
    label: "User Name",
    placeholder: "Enter your user name",
    componentType: "input",
    type: "text",
  },
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const loginFormControls = [
  {
    name: "email",
    label: "Email",
    placeholder: "Enter your email",
    componentType: "input",
    type: "email",
  },
  {
    name: "password",
    label: "Password",
    placeholder: "Enter your password",
    componentType: "input",
    type: "password",
  },
];

export const addProductFormElements = [
  {
    label: "Title",
    name: "title",
    componentType: "input",
    type: "text",
    placeholder: "Enter product title",
  },
  {
    label: "Description",
    name: "description",
    componentType: "textarea",
    placeholder: "Enter product description",
  },
  {
    label: "Category",
    name: "category",
    componentType: "select",
    options: [
      { id: "women-sarees", label: "Women - Sarees" },
      { id: "women-kurtis", label: "Women - Kurtis" },
      { id: "women-dresses", label: "Women - Dresses" },
      { id: "women-leggings", label: "Women - Leggings" },
      { id: "women-chunnis", label: "Women - Chunnis" },
      { id: "women-innerwear", label: "Women - Innerwear" },
      { id: "women-nightwear", label: "Women - Nightwear" },
      { id: "men-shirts", label: "Men - Shirts" },
      { id: "men-t-shirts", label: "Men - T-Shirts" },
      { id: "men-track-pants", label: "Men - Track Pants" },
      { id: "men-innerwear", label: "Men - Innerwear" },
      { id: "men-nightwear", label: "Men - Nightwear" },
      { id: "kids-shirts", label: "Kids - Shirts" },
      { id: "kids-shorts", label: "Kids - Shorts" },
      { id: "kids-t-shirts", label: "Kids - T-Shirts" },
      { id: "kids-nightwear", label: "Kids - Nightwear" },
      { id: "kids-innerwear", label: "Kids - Innerwear" },
    ],
  },
  {
    label: "Price",
    name: "price",
    componentType: "input",
    type: "number",
    placeholder: "Enter product price",
  },
  {
    label: "Sale Price",
    name: "salePrice",
    componentType: "input",
    type: "number",
    placeholder: "Enter sale price (optional)",
  },
  {
    label: "Total Stock",
    name: "totalStock",
    componentType: "input",
    type: "number",
    placeholder: "Enter total stock",
  },
];

export const shoppingViewHeaderMenuItems = [
  {
    id: "home",
    label: "Home",
    path: "/shop/home",
  },
  {
    id: "products",
    label: "Products",
    path: "/shop/listing",
  },
  {
    id: "men",
    label: "Men",
    path: "/shop/listing",
  },
  {
    id: "women",
    label: "Women",
    path: "/shop/listing",
  },
  {
    id: "kids",
    label: "Kids",
    path: "/shop/listing",
  },
  {
    id: "search",
    label: "Search",
    path: "/shop/search",
  },
];

export const categoryOptionsMap = {
  "women-sarees": "Sarees",
  "women-kurtis": "Kurtis",
  "women-dresses": "Dresses",
  "women-leggings": "Leggings",
  "women-chunnis": "Chunnis",
  "women-innerwear": "Innerwear",
  "women-nightwear": "Nightwear",
  "men-shirts": "Shirts",
  "men-t-shirts": "T-Shirts",
  "men-track-pants": "Track Pants",
  "men-innerwear": "Innerwear",
  "men-nightwear": "Nightwear",
  "kids-shirts": "Shirts",
  "kids-shorts": "Shorts",
  "kids-t-shirts": "T-Shirts",
  "kids-nightwear": "Nightwear",
  "kids-innerwear": "Innerwear",
};

export const filterOptions = {
  category: [
    { id: "women-sarees", label: "Sarees", parent: "Women" },
    { id: "women-kurtis", label: "Kurtis", parent: "Women" },
    { id: "women-dresses", label: "Dresses", parent: "Women" },
    { id: "women-leggings", label: "Leggings", parent: "Women" },
    { id: "women-chunnis", label: "Chunnis", parent: "Women" },
    { id: "women-innerwear", label: "Innerwear", parent: "Women" },
    { id: "women-nightwear", label: "Nightwear", parent: "Women" },
    { id: "men-shirts", label: "Shirts", parent: "Men" },
    { id: "men-t-shirts", label: "T-Shirts", parent: "Men" },
    { id: "men-track-pants", label: "Track Pants", parent: "Men" },
    { id: "men-innerwear", label: "Innerwear", parent: "Men" },
    { id: "men-nightwear", label: "Nightwear", parent: "Men" },
    { id: "kids-shirts", label: "Shirts", parent: "Kids" },
    { id: "kids-shorts", label: "Shorts", parent: "Kids" },
    { id: "kids-t-shirts", label: "T-Shirts", parent: "Kids" },
    { id: "kids-nightwear", label: "Nightwear", parent: "Kids" },
    { id: "kids-innerwear", label: "Innerwear", parent: "Kids" },
  ],
};

export const sortOptions = [
  { id: "price-lowtohigh", label: "Price: Low to High" },
  { id: "price-hightolow", label: "Price: High to Low" },
  { id: "title-atoz", label: "Title: A to Z" },
  { id: "title-ztoa", label: "Title: Z to A" },
];

export const addressFormControls = [
  {
    label: "Address",
    name: "address",
    componentType: "input",
    type: "text",
    placeholder: "Enter your address",
  },
  {
    label: "City",
    name: "city",
    componentType: "input",
    type: "text",
    placeholder: "Enter your city",
  },
  {
    label: "Pincode",
    name: "pincode",
    componentType: "input",
    type: "text",
    placeholder: "Enter your pincode",
  },
  {
    label: "Phone",
    name: "phone",
    componentType: "input",
    type: "text",
    placeholder: "Enter your phone number",
  },
  {
    label: "Notes",
    name: "notes",
    componentType: "textarea",
    placeholder: "Enter any additional notes",
  },
];
