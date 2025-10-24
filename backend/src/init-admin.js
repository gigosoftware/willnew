const bcrypt = require('bcryptjs');
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');

const client = new DynamoDBClient({ region: 'us-east-1' });
const docClient = DynamoDBDocumentClient.from(client);

async function createAdmin() {
  const hashedPassword = await bcrypt.hash('gigo123', 10);
  
  const admin = {
    id: '1',
    email: 'rogerio.gigo@conectae.com.br',
    password: hashedPassword,
    isAdmin: true,
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
    TableName: 'Will-Users',
    Item: admin
  }));
  
  console.log('✅ Admin criado:', admin.email);
}

createAdmin().catch(console.error);
