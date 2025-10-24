const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;
const JWT_SECRET = process.env.JWT_SECRET || 'will-secret-key-change-in-production';

// DynamoDB setup
const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);
const USERS_TABLE = 'Will-Users';

app.use(cors());
app.use(express.json());

// Middleware de autenticação
const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Token não fornecido' });
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.userId = decoded.id;
    req.userEmail = decoded.email;
    req.isAdmin = decoded.isAdmin;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido' });
  }
};

// Login
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const result = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { email }
    }));
    
    const user = result.Item;
    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { id: user.id, email: user.email, isAdmin: user.isAdmin },
      JWT_SECRET,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        isAdmin: user.isAdmin,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Criar usuário (admin only)
app.post('/api/users', authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { email, password, isAdmin } = req.body;
    
    // Verificar se já existe
    const existing = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { email }
    }));
    
    if (existing.Item) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = {
      id: Date.now().toString(),
      email,
      password: hashedPassword,
      isAdmin: isAdmin || false,
      createdAt: new Date().toISOString(),
      config: {
        interval: 30,
        showStreamTitles: true,
        showMosaicInfo: true,
        autoFullscreen: true,
        smartInterval: false
      }
    };
    
    await docClient.send(new PutCommand({
      TableName: USERS_TABLE,
      Item: user
    }));
    
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Listar usuários (admin only)
app.get('/api/users', authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const result = await docClient.send(new ScanCommand({
      TableName: USERS_TABLE
    }));
    
    const users = result.Items.map(({ password, ...user }) => user);
    res.json(users);
  } catch (error) {
    console.error('List users error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Atualizar usuário (admin only)
app.put('/api/users/:email', authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { email } = req.params;
    const { password, isAdmin } = req.body;
    
    const updates = {};
    if (password) {
      updates.password = await bcrypt.hash(password, 10);
    }
    if (typeof isAdmin !== 'undefined') {
      updates.isAdmin = isAdmin;
    }
    
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({ error: 'Nenhum campo para atualizar' });
    }
    
    const updateExpression = 'SET ' + Object.keys(updates).map((key, i) => `#${key} = :val${i}`).join(', ');
    const expressionAttributeNames = Object.keys(updates).reduce((acc, key) => {
      acc[`#${key}`] = key;
      return acc;
    }, {});
    const expressionAttributeValues = Object.keys(updates).reduce((acc, key, i) => {
      acc[`:val${i}`] = updates[key];
      return acc;
    }, {});
    
    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email },
      UpdateExpression: updateExpression,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    }));
    
    res.json({ message: 'Usuário atualizado' });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Deletar usuário (admin only)
app.delete('/api/users/:email', authMiddleware, async (req, res) => {
  try {
    if (!req.isAdmin) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const { email } = req.params;
    
    await docClient.send(new DeleteCommand({
      TableName: USERS_TABLE,
      Key: { email }
    }));
    
    res.json({ message: 'Usuário deletado' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Obter configurações do usuário
app.get('/api/config', authMiddleware, async (req, res) => {
  try {
    const result = await docClient.send(new GetCommand({
      TableName: USERS_TABLE,
      Key: { email: req.userEmail }
    }));
    
    res.json(result.Item?.config || {
      interval: 30,
      showStreamTitles: true,
      showMosaicInfo: true,
      autoFullscreen: true,
      smartInterval: false
    });
  } catch (error) {
    console.error('Get config error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

// Salvar configurações do usuário
app.put('/api/config', authMiddleware, async (req, res) => {
  try {
    const config = req.body;
    
    await docClient.send(new UpdateCommand({
      TableName: USERS_TABLE,
      Key: { email: req.userEmail },
      UpdateExpression: 'SET config = :config',
      ExpressionAttributeValues: {
        ':config': config
      }
    }));
    
    res.json({ message: 'Configurações salvas' });
  } catch (error) {
    console.error('Save config error:', error);
    res.status(500).json({ error: 'Erro no servidor' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Will Backend rodando na porta ${PORT}`);
});
