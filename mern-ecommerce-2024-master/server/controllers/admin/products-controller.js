const { imageUploadUtil } = require("../../helpers/cloudinary");
const Product = require("../../models/Product");

const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64");
    const url = "data:" + req.file.mimetype + ";base64," + b64;
    const result = await imageUploadUtil(url);

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

// add a new product
const addProduct = async (req, res) => {
  try {
    console.log("REQ BODY:", req.body);

    const {
      image,
      images,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
      sizes,
      colors,
      fabric,
      length,
      typeOfPiece,
      occasion,
    } = req.body;

    // Parse arrays if coming as strings from FormData
    const parsedSizes =
      typeof sizes === "string"
        ? JSON.parse(sizes)
        : sizes || [];

    const parsedColors =
      typeof colors === "string"
        ? JSON.parse(colors)
        : colors || [];

    const parsedImages =
      typeof images === "string"
        ? JSON.parse(images)
        : images || [];

    const newlyCreatedProduct = new Product({
      image: parsedImages?.[0] || image || "",
      images: parsedImages,

      title,
      description,
      category,

      price: Number(price) || 0,
      salePrice: Number(salePrice) || 0,
      totalStock: Number(totalStock) || 0,
      averageReview: Number(averageReview) || 0,

      sizes: parsedSizes,
      colors: parsedColors,

      fabric: fabric || "",
      length: length || "",
      typeOfPiece: typeOfPiece || "",
      occasion: occasion || "",
    });

    await newlyCreatedProduct.save();

    res.status(201).json({
      success: true,
      data: newlyCreatedProduct,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// fetch all products
const fetchAllProducts = async (req, res) => {
  try {
    const listOfProducts = await Product.find({});

    res.status(200).json({
      success: true,
      data: listOfProducts,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// edit a product
const editProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      image,
      images,
      title,
      description,
      category,
      price,
      salePrice,
      totalStock,
      averageReview,
      sizes,
      colors,
      fabric,
      length,
      typeOfPiece,
      occasion,
    } = req.body;

    let findProduct = await Product.findById(id);

    if (!findProduct)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    // Parse arrays if coming as strings
    const parsedSizes =
      typeof sizes === "string"
        ? JSON.parse(sizes)
        : sizes || findProduct.sizes;

    const parsedColors =
      typeof colors === "string"
        ? JSON.parse(colors)
        : colors || findProduct.colors;

    const parsedImages =
      typeof images === "string"
        ? JSON.parse(images)
        : images || findProduct.images;

    findProduct.title = title || findProduct.title;
    findProduct.description = description || findProduct.description;
    findProduct.category = category || findProduct.category;

    findProduct.price =
      price === "" ? 0 : Number(price) || findProduct.price;

    findProduct.salePrice =
      salePrice === ""
        ? 0
        : Number(salePrice) || findProduct.salePrice;

    findProduct.totalStock =
      Number(totalStock) || findProduct.totalStock;

    findProduct.image =
      parsedImages?.[0] || image || findProduct.image;

    findProduct.images = parsedImages;

    findProduct.averageReview =
      Number(averageReview) || findProduct.averageReview;

    findProduct.sizes = parsedSizes;
    findProduct.colors = parsedColors;

    findProduct.fabric = fabric || findProduct.fabric;
    findProduct.length = length || findProduct.length;
    findProduct.typeOfPiece =
      typeOfPiece || findProduct.typeOfPiece;
    findProduct.occasion =
      occasion || findProduct.occasion;

    await findProduct.save();

    res.status(200).json({
      success: true,
      data: findProduct,
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

// delete a product
const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findByIdAndDelete(id);

    if (!product)
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });

    res.status(200).json({
      success: true,
      message: "Product delete successfully",
    });
  } catch (e) {
    console.log(e);

    res.status(500).json({
      success: false,
      message: "Error occured",
    });
  }
};

module.exports = {
  handleImageUpload,
  addProduct,
  fetchAllProducts,
  editProduct,
  deleteProduct,
};