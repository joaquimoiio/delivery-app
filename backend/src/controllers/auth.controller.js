// src/controllers/auth.controller.js
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model');
const StoreModel = require('../models/store.model');

class AuthController {
  async register(req, res) {
    try {
      const { name, email, password, phone, address, user_type } = req.body;
      
      // Verificar se o email já está cadastrado
      const existingUser = await UserModel.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email já cadastrado' });
      }
      
      // Criar novo usuário
      const userId = await UserModel.create({
        name,
        email,
        password,
        phone,
        address,
        user_type
      });
      
      return res.status(201).json({
        message: 'Usuário cadastrado com sucesso',
        userId
      });
    } catch (error) {
      console.error('Erro ao registrar usuário:', error);
      return res.status(500).json({ message: 'Erro ao registrar usuário', error: error.message });
    }
  }

  async login(req, res) {
    try {
      const { email, password } = req.body;
      
      // Buscar usuário pelo email
      const user = await UserModel.findByEmail(email);
      if (!user) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      // Verificar senha
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Credenciais inválidas' });
      }
      
      // Gerar token JWT
      const token = jwt.sign(
        { id: user.id, userType: user.user_type },
        process.env.JWT_SECRET,
        { expiresIn: '7d' }
      );
      
      // Se for lojista, verificar se tem loja cadastrada
      let storeId = null;
      if (user.user_type === 'lojista') {
        const store = await StoreModel.findByUserId(user.id);
        if (store) {
          storeId = store.id;
        }
      }
      
      return res.json({
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          userType: user.user_type,
          storeId
        }
      });
    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return res.status(500).json({ message: 'Erro ao fazer login', error: error.message });
    }
  }
}

module.exports = new AuthController();

// src/controllers/user.controller.js
const UserModel = require('../models/user.model');

class UserController {
  async getProfile(req, res) {
    try {
      const userId = req.userId;
      
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      return res.json(user);
    } catch (error) {
      console.error('Erro ao buscar perfil:', error);
      return res.status(500).json({ message: 'Erro ao buscar perfil', error: error.message });
    }
  }

  async updateProfile(req, res) {
    try {
      const userId = req.userId;
      const { name, phone, address } = req.body;
      
      const updated = await UserModel.update(userId, { name, phone, address });
      if (!updated) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      return res.json({ message: 'Perfil atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return res.status(500).json({ message: 'Erro ao atualizar perfil', error: error.message });
    }
  }

  async updatePassword(req, res) {
    try {
      const userId = req.userId;
      const { currentPassword, newPassword } = req.body;
      
      // Buscar usuário
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' });
      }
      
      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: 'Senha atual incorreta' });
      }
      
      // Atualizar senha
      await UserModel.updatePassword(userId, newPassword);
      
      return res.json({ message: 'Senha atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar senha:', error);
      return res.status(500).json({ message: 'Erro ao atualizar senha', error: error.message });
    }
  }
}

module.exports = new UserController();

// src/controllers/store.controller.js
const StoreModel = require('../models/store.model');
const path = require('path');
const fs = require('fs');

class StoreController {
  async getStores(req, res) {
    try {
      const { category, name } = req.query;
      
      const stores = await StoreModel.findAll({ category, name });
      
      // Adicionar rating às lojas
      for (const store of stores) {
        const ratingData = await StoreModel.getStoreRating(store.id);
        store.rating = ratingData.avg_rating || 0;
        store.total_reviews = ratingData.total_reviews || 0;
      }
      
      return res.json(stores);
    } catch (error) {
      console.error('Erro ao buscar lojas:', error);
      return res.status(500).json({ message: 'Erro ao buscar lojas', error: error.message });
    }
  }

  async getStoreById(req, res) {
    try {
      const { id } = req.params;
      
      const store = await StoreModel.findById(id);
      if (!store) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      
      // Adicionar rating à loja
      const ratingData = await StoreModel.getStoreRating(store.id);
      store.rating = ratingData.avg_rating || 0;
      store.total_reviews = ratingData.total_reviews || 0;
      
      return res.json(store);
    } catch (error) {
      console.error('Erro ao buscar loja:', error);
      return res.status(500).json({ message: 'Erro ao buscar loja', error: error.message });
    }
  }

  async createStore(req, res) {
    try {
      const userId = req.userId;
      
      // Verificar se o usuário já tem uma loja
      const existingStore = await StoreModel.findByUserId(userId);
      if (existingStore) {
        return res.status(400).json({ message: 'Usuário já possui uma loja cadastrada' });
      }
      
      // Processar upload de imagem se houver
      let logoUrl = null;
      if (req.file) {
        logoUrl = `/uploads/stores/${req.file.filename}`;
      }
      
      const storeData = {
        user_id: userId,
        name: req.body.name,
        description: req.body.description,
        logo_url: logoUrl,
        category: req.body.category,
        address: req.body.address,
        delivery_fee: req.body.delivery_fee,
        avg_delivery_time: req.body.avg_delivery_time
      };
      
      const storeId = await StoreModel.create(storeData);
      
      return res.status(201).json({
        message: 'Loja criada com sucesso',
        storeId
      });
    } catch (error) {
      console.error('Erro ao criar loja:', error);
      return res.status(500).json({ message: 'Erro ao criar loja', error: error.message });
    }
  }

  async updateStore(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      
      // Verificar se a loja existe e pertence ao usuário
      const store = await StoreModel.findById(id);
      if (!store) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      
      if (store.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Processar upload de imagem se houver
      let logoUrl = store.logo_url;
      if (req.file) {
        // Remover imagem antiga se existir
        if (store.logo_url) {
          const oldImagePath = path.join(__dirname, '../../', store.logo_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        logoUrl = `/uploads/stores/${req.file.filename}`;
      }
      
      const storeData = {
        name: req.body.name,
        description: req.body.description,
        logo_url: logoUrl,
        category: req.body.category,
        address: req.body.address,
        delivery_fee: req.body.delivery_fee,
        avg_delivery_time: req.body.avg_delivery_time,
        is_open: req.body.is_open === 'true'
      };
      
      await StoreModel.update(id, storeData);
      
      return res.json({ message: 'Loja atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar loja:', error);
      return res.status(500).json({ message: 'Erro ao atualizar loja', error: error.message });
    }
  }

  async deleteStore(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      
      // Verificar se a loja existe e pertence ao usuário
      const store = await StoreModel.findById(id);
      if (!store) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      
      if (store.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Remover imagem se existir
      if (store.logo_url) {
        const imagePath = path.join(__dirname, '../../', store.logo_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await StoreModel.delete(id);
      
      return res.json({ message: 'Loja removida com sucesso' });
    } catch (error) {
      console.error('Erro ao remover loja:', error);
      return res.status(500).json({ message: 'Erro ao remover loja', error: error.message });
    }
  }
}

module.exports = new StoreController();

// src/controllers/product.controller.js
const ProductModel = require('../models/product.model');
const StoreModel = require('../models/store.model');
const path = require('path');
const fs = require('fs');

class ProductController {
  async getProducts(req, res) {
    try {
      const { storeId, categoryId } = req.query;
      
      if (!storeId) {
        return res.status(400).json({ message: 'ID da loja é obrigatório' });
      }
      
      const products = await ProductModel.findByStoreId(storeId, categoryId);
      
      return res.json(products);
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
      return res.status(500).json({ message: 'Erro ao buscar produtos', error: error.message });
    }
  }

  async getProductById(req, res) {
    try {
      const { id } = req.params;
      
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      return res.json(product);
    } catch (error) {
      console.error('Erro ao buscar produto:', error);
      return res.status(500).json({ message: 'Erro ao buscar produto', error: error.message });
    }
  }

  async createProduct(req, res) {
    try {
      const userId = req.userId;
      const { storeId } = req.body;
      
      // Verificar se a loja existe e pertence ao usuário
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      
      if (store.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Processar upload de imagem se houver
      let imageUrl = null;
      if (req.file) {
        imageUrl = `/uploads/products/${req.file.filename}`;
      }
      
      const productData = {
        store_id: storeId,
        category_id: req.body.categoryId || null,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image_url: imageUrl,
        is_available: req.body.isAvailable === 'true'
      };
      
      const productId = await ProductModel.create(productData);
      
      return res.status(201).json({
        message: 'Produto criado com sucesso',
        productId
      });
    } catch (error) {
      console.error('Erro ao criar produto:', error);
      return res.status(500).json({ message: 'Erro ao criar produto', error: error.message });
    }
  }

  async updateProduct(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      
      // Verificar se o produto existe
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Verificar se a loja pertence ao usuário
      const store = await StoreModel.findById(product.store_id);
      if (store.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Processar upload de imagem se houver
      let imageUrl = product.image_url;
      if (req.file) {
        // Remover imagem antiga se existir
        if (product.image_url) {
          const oldImagePath = path.join(__dirname, '../../', product.image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        
        imageUrl = `/uploads/products/${req.file.filename}`;
      }
      
      const productData = {
        category_id: req.body.categoryId || null,
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        image_url: imageUrl,
        is_available: req.body.isAvailable === 'true'
      };
      
      await ProductModel.update(id, productData);
      
      return res.json({ message: 'Produto atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar produto:', error);
      return res.status(500).json({ message: 'Erro ao atualizar produto', error: error.message });
    }
  }

  async deleteProduct(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      
      // Verificar se o produto existe
      const product = await ProductModel.findById(id);
      if (!product) {
        return res.status(404).json({ message: 'Produto não encontrado' });
      }
      
      // Verificar se a loja pertence ao usuário
      const store = await StoreModel.findById(product.store_id);
      if (store.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Remover imagem se existir
      if (product.image_url) {
        const imagePath = path.join(__dirname, '../../', product.image_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
      
      await ProductModel.delete(id);
      
      return res.json({ message: 'Produto removido com sucesso' });
    } catch (error) {
      console.error('Erro ao remover produto:', error);
      return res.status(500).json({ message: 'Erro ao remover produto', error: error.message });
    }
  }

  // Métodos para categorias de produtos
  async getCategories(req, res) {
    try {
      const { storeId } = req.query;
      
      if (!storeId) {
        return res.status(400).json({ message: 'ID da loja é obrigatório' });
      }
      
      const categories = await ProductModel.getCategories(storeId);
      
      return res.json(categories);
    } catch (error) {
      console.error('Erro ao buscar categorias:', error);
      return res.status(500).json({ message: 'Erro ao buscar categorias', error: error.message });
    }
  }

  async createCategory(req, res) {
    try {
      const userId = req.userId;
      const { storeId, name } = req.body;
      
      // Verificar se a loja existe e pertence ao usuário
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      
      if (store.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      const categoryId = await ProductModel.createCategory(storeId, name);
      
      return res.status(201).json({
        message: 'Categoria criada com sucesso',
        categoryId
      });
    } catch (error) {
      console.error('Erro ao criar categoria:', error);
      return res.status(500).json({ message: 'Erro ao criar categoria', error: error.message });
    }
  }

  async updateCategory(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { name } = req.body;
      
      // Verificar se a categoria existe
      // Para simplificar, verificamos se o usuário tem permissão na rota
      await ProductModel.updateCategory(id, name);
      
      return res.json({ message: 'Categoria atualizada com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar categoria:', error);
      return res.status(500).json({ message: 'Erro ao atualizar categoria', error: error.message });
    }
  }

  async deleteCategory(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      
      // Verificar se a categoria existe
      // Para simplificar, verificamos se o usuário tem permissão na rota
      await ProductModel.deleteCategory(id);
      
      return res.json({ message: 'Categoria removida com sucesso' });
    } catch (error) {
      console.error('Erro ao remover categoria:', error);
      return res.status(500).json({ message: 'Erro ao remover categoria', error: error.message });
    }
  }
}

module.exports = new ProductController();

// src/controllers/order.controller.js
const OrderModel = require('../models/order.model');
const StoreModel = require('../models/store.model');
const ProductModel = require('../models/product.model');

class OrderController {
  async getOrders(req, res) {
    try {
      const userId = req.userId;
      const userType = req.userType;
      
      let orders = [];
      
      if (userType === 'cliente') {
        // Buscar pedidos do cliente
        orders = await OrderModel.findByUserId(userId);
      } else if (userType === 'lojista') {
        // Buscar loja do lojista
        const store = await StoreModel.findByUserId(userId);
        if (!store) {
          return res.status(404).json({ message: 'Loja não encontrada' });
        }
        
        // Buscar pedidos da loja
        const { status } = req.query;
        orders = await OrderModel.findByStoreId(store.id, status);
      }
      
      return res.json(orders);
    } catch (error) {
      console.error('Erro ao buscar pedidos:', error);
      return res.status(500).json({ message: 'Erro ao buscar pedidos', error: error.message });
    }
  }

  async getOrderById(req, res) {
    try {
      const userId = req.userId;
      const userType = req.userType;
      const { id } = req.params;
      
      // Buscar pedido
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      // Verificar permissão
      if (userType === 'cliente' && order.user_id !== userId) {
        return res.status(403).json({ message: 'Acesso negado' });
      } else if (userType === 'lojista') {
        const store = await StoreModel.findByUserId(userId);
        if (!store || store.id !== order.store_id) {
          return res.status(403).json({ message: 'Acesso negado' });
        }
      }
      
      // Buscar itens do pedido
      const items = await OrderModel.getOrderItems(id);
      order.items = items;
      
      return res.json(order);
    } catch (error) {
      console.error('Erro ao buscar pedido:', error);
      return res.status(500).json({ message: 'Erro ao buscar pedido', error: error.message });
    }
  }

  async createOrder(req, res) {
    try {
      const userId = req.userId;
      const {
        storeId,
        items,
        deliveryAddress,
        paymentMethod,
        notes
      } = req.body;
      
      // Verificar se a loja existe
      const store = await StoreModel.findById(storeId);
      if (!store) {
        return res.status(404).json({ message: 'Loja não encontrada' });
      }
      
      // Verificar se a loja está aberta
      if (!store.is_open) {
        return res.status(400).json({ message: 'Esta loja está fechada no momento' });
      }
      
      // Calcular total do pedido
      let totalAmount = 0;
      const orderItems = [];
      
      for (const item of items) {
        const product = await ProductModel.findById(item.productId);
        if (!product) {
          return res.status(404).json({ message: `Produto ID ${item.productId} não encontrado` });
        }
        
        if (!product.is_available) {
          return res.status(400).json({ message: `Produto "${product.name}" não está disponível` });
        }
        
        const itemTotal = product.price * item.quantity;
        totalAmount += itemTotal;
        
        orderItems.push({
          product_id: product.id,
          quantity: item.quantity,
          unit_price: product.price,
          notes: item.notes
        });
      }
      
      // Adicionar taxa de entrega
      const deliveryFee = parseFloat(store.delivery_fee);
      
      // Criar pedido
      const orderData = {
        user_id: userId,
        store_id: storeId,
        total_amount: totalAmount,
        delivery_fee: deliveryFee,
        payment_method: paymentMethod,
        delivery_address: deliveryAddress,
        notes,
        items: orderItems
      };
      
      const orderId = await OrderModel.create(orderData);
      
      return res.status(201).json({
        message: 'Pedido realizado com sucesso',
        orderId
      });
    } catch (error) {
      console.error('Erro ao criar pedido:', error);
      return res.status(500).json({ message: 'Erro ao criar pedido', error: error.message });
    }
  }

  async updateOrderStatus(req, res) {
    try {
      const userId = req.userId;
      const { id } = req.params;
      const { status } = req.body;
      
      // Verificar se o pedido existe
      const order = await OrderModel.findById(id);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      // Verificar se o usuário é o lojista da loja do pedido
      const store = await StoreModel.findByUserId(userId);
      if (!store || store.id !== order.store_id) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Atualizar status do pedido
      await OrderModel.updateStatus(id, status);
      
      return res.json({ message: 'Status do pedido atualizado com sucesso' });
    } catch (error) {
      console.error('Erro ao atualizar status do pedido:', error);
      return res.status(500).json({ message: 'Erro ao atualizar status do pedido', error: error.message });
    }
  }
}

module.exports = new OrderController();

// src/controllers/review.controller.js
const ReviewModel = require('../models/review.model');
const OrderModel = require('../models/order.model');

class ReviewController {
  async getStoreReviews(req, res) {
    try {
      const { storeId } = req.params;
      
      const reviews = await ReviewModel.findByStoreId(storeId);
      
      return res.json(reviews);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
      return res.status(500).json({ message: 'Erro ao buscar avaliações', error: error.message });
    }
  }

  async createReview(req, res) {
    try {
      const userId = req.userId;
      const { storeId, orderId, rating, comment } = req.body;
      
      // Verificar se o pedido existe e pertence ao usuário
      const order = await OrderModel.findById(orderId);
      if (!order) {
        return res.status(404).json({ message: 'Pedido não encontrado' });
      }
      
      if (order.user_id !== userId || order.store_id !== parseInt(storeId)) {
        return res.status(403).json({ message: 'Acesso negado' });
      }
      
      // Verificar se o pedido foi entregue
      if (order.status !== 'entregue') {
        return res.status(400).json({ message: 'Só é possível avaliar pedidos entregues' });
      }
      
      // Verificar se o pedido já foi avaliado
      const existingReview = await ReviewModel.findByOrderId(orderId);
      if (existingReview) {
        return res.status(400).json({ message: 'Este pedido já foi avaliado' });
      }
      
      // Criar avaliação
      const reviewData = {
        user_id: userId,
        store_id: storeId,
        order_id: orderId,
        rating,
        comment
      };
      
      const reviewId = await ReviewModel.create(reviewData);
      
      return res.status(201).json({
        message: 'Avaliação enviada com sucesso',
        reviewId
      });
    } catch (error) {
      console.error('Erro ao criar avaliação:', error);
      return res.status(500).json({ message: 'Erro ao criar avaliação', error: error.message });
    }
  }
}

module.exports = new ReviewController();