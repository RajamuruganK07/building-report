## 🚀 DEPLOYMENT GUIDE - AZURE & DOCKER

### Deploy Using Docker Locally

**Step 1: Build Docker Image**
```bash
docker build -t apartment-system .
```

**Step 2: Run with Docker Compose (includes MongoDB & Redis)**
```bash
docker-compose up -d
```

**Step 3: Access Application**
- URL: `http://localhost:5000`
- MongoDB: `localhost:27017`
- Redis: `localhost:6379`

**Step 4: Seed Demo Data**
```bash
docker exec apartment-system-app-1 node seed-demo-data.js
```

### Deploy to Azure Cloud

#### **Option 1: Azure Container Instances (Easiest)**

**Prerequisites:**
- Azure CLI installed: `az login`
- Azure subscription

**Steps:**
```bash
# Create resource group
az group create --name apartment-system --location eastus

# Create container registry
az acr create --resource-group apartment-system \
  --name apartmentsystem --sku Basic

# Build image in Azure
az acr build --registry apartmentsystem --image apartment-system:latest .

# Deploy container
az container create \
  --resource-group apartment-system \
  --name apartment-app \
  --image apartmentsystem.azurecr.io/apartment-system:latest \
  --ports 5000 \
  --environment-variables \
    MONGODB_URI="mongodb+srv://..." \
    NODE_ENV=production
```

#### **Option 2: Azure App Service**

```bash
# Create App Service Plan
az appservice plan create \
  --name apartment-plan \
  --resource-group apartment-system \
  --sku B1

# Create Web App
az webapp create \
  --resource-group apartment-system \
  --plan apartment-plan \
  --name apartment-system-app \
  --runtime "NODE|18"

# Deploy code
az webapp up \
  --resource-group apartment-system \
  --name apartment-system-app \
  --runtime node:18
```

#### **Option 3: Terraform (Complete Infrastructure)**

```bash
# Install Terraform
# terraform.io/downloads

# Initialize
cd infrastructure
terraform init

# Plan deployment
terraform plan -out=tfplan

# Apply
terraform apply tfplan
```

### Environment Variables for Azure

Create `.env.azure`:
```
MONGODB_URI=<your-cosmosdb-connection-string>
REDIS_HOST=<your-redis-host>
JWT_SECRET=<your-secret>
NODE_ENV=production
EMAIL_USER=<your-sendgrid-api-key>
```

### Monitoring on Azure

1. **Application Insights**
```bash
az monitor app-insights component create \
  --app apartment-insights \
  --location eastus \
  --resource-group apartment-system
```

2. **View Logs**
```bash
az container logs \
  --resource-group apartment-system \
  --name apartment-app
```

3. **View Metrics**
```bash
az monitor metrics list \
  --resource /subscriptions/{subscription}/resourceGroups/apartment-system/providers/Microsoft.ContainerInstance/containerGroups/apartment-app
```

### Scale on Azure

```bash
# Increase container instances
az container create --resource-group apartment-system \
  --name apartment-app-2 --cpu 2 --memory 2
```

### Cost Estimation (Azure)

| Service | Tier | Cost |
|---------|------|------|
| Container Instances | Pay-as-you-go | ~$15/month |
| Cosmos DB | Free tier | $0 (first 400 RU/s) |
| Redis Cache | Basic | ~$18/month |
| Application Insights | Basic | ~$2.50/month |
| **Total** | - | **~$35-50/month** |

### CI/CD Pipeline (GitHub Actions)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Build Docker image
        run: docker build -t apartment:latest .
      
      - name: Push to Azure
        env:
          AZURE_REGISTRY: apartmentsystem.azurecr.io
        run: |
          az acr build \
            --registry apartmentsystem \
            --image apartment-system:${{ github.sha }} .
      
      - name: Deploy to Azure
        run: |
          az container create \
            --resource-group apartment-system \
            --name apartment-app \
            --image apartmentsystem.azurecr.io/apartment-system:latest
```

### Troubleshooting

**Container won't start:**
```bash
az container logs --name apartment-app --resource-group apartment-system
```

**Database connection issues:**
- Verify connection string
- Check firewall rules
- Ensure credentials are correct

**Memory issues:**
- Increase CPU/Memory allocation
- Use Redis for caching
- Optimize database queries

---

**Deployment successful! Your application is now live on Azure! 🎉**
